// Ciclo de vida de uma partida: ações pendentes, timers, bot e reconexão.
const engine = require('./engine');
const bot = require('./bot');

const TURN_MS = 30 * 1000; // sem ação em 30s -> ação aleatória legal
const RECONNECT_MS = 30 * 1000; // desconectou e não voltou em 30s -> W.O.

let nextMatchId = 1;

class Match {
    // players: [{ token, name, socket|null, isBot, team: specs[] }]
    constructor(players, io, onEnd) {
        this.id = `m${nextMatchId++}`;
        this.io = io;
        this.onEnd = onEnd;
        this.players = players.map((p) => ({
            ...p,
            connected: !p.isBot,
            reconnectTimer: null,
        }));
        this.state = engine.createBattle(players[0].team, players[1].team);
        this.pending = { 0: null, 1: null };
        this.turnTimer = null;
        this.turnEndsAt = null;
        this.rng = Math.random;
    }

    start() {
        for (const i of [0, 1]) {
            const socket = this.players[i].socket;
            if (socket) socket.emit('match-start', this.view(i));
        }
        this.beginTurn();
    }

    playerIndex(token) {
        return this.players.findIndex((p) => p.token === token);
    }

    // na fase de troca só age quem desmaiou
    mustAct(i) {
        if (this.state.phase === 'over') return false;
        if (this.state.phase === 'switch') return this.state.mustSwitch[i];
        return true;
    }

    beginTurn() {
        this.pending = { 0: null, 1: null };
        for (const i of [0, 1]) {
            if (this.players[i].isBot && this.mustAct(i)) {
                this.pending[i] = bot.chooseAction(this.state, i);
            }
        }
        this.turnEndsAt = Date.now() + TURN_MS;
        clearTimeout(this.turnTimer);
        this.turnTimer = setTimeout(() => this.forceResolve(), TURN_MS);
        this.broadcastView();
        this.maybeResolve();
    }

    submitAction(playerIdx, action) {
        if (!this.mustAct(playerIdx) || this.pending[playerIdx]) return;
        if (!engine.isLegal(this.state, playerIdx, action)) {
            this.emitTo(playerIdx, 'error-msg', 'Ação inválida.');
            return;
        }
        this.pending[playerIdx] = action;
        this.maybeResolve();
    }

    // Timeout do turno: quem não agiu recebe uma ação legal aleatória.
    forceResolve() {
        for (const i of [0, 1]) {
            if (this.mustAct(i) && !this.pending[i]) {
                const legal = engine.legalActions(this.state, i);
                this.pending[i] = legal[Math.floor(this.rng() * legal.length)];
            }
        }
        this.resolve();
    }

    maybeResolve() {
        const ready = [0, 1].every((i) => !this.mustAct(i) || this.pending[i]);
        if (ready) this.resolve();
    }

    resolve() {
        clearTimeout(this.turnTimer);
        const { state, events } = engine.resolveTurn(this.state, this.pending, this.rng);
        this.state = state;

        if (state.phase === 'over') {
            this.turnEndsAt = null;
            for (const i of [0, 1]) {
                this.emitTo(i, 'turn-result', { events: this.localizeEvents(events, i), view: this.view(i) });
            }
            this.finish();
            return;
        }
        // Prepara o próximo passo antes de emitir, para a view já ir com o timer novo.
        this.pending = { 0: null, 1: null };
        for (const i of [0, 1]) {
            if (this.players[i].isBot && this.mustAct(i)) {
                this.pending[i] = bot.chooseAction(this.state, i);
            }
        }
        this.turnEndsAt = Date.now() + TURN_MS;
        this.turnTimer = setTimeout(() => this.forceResolve(), TURN_MS);
        for (const i of [0, 1]) {
            this.emitTo(i, 'turn-result', { events: this.localizeEvents(events, i), view: this.view(i) });
        }
        this.maybeResolve();
    }

    // player 0/1 -> "eu"/"inimigo" pro cliente
    localizeEvents(events, viewerIdx) {
        return events.map((e) => {
            const out = { ...e };
            if ('player' in out) out.mine = out.player === viewerIdx;
            if ('target' in out) out.targetMine = out.target === viewerIdx;
            if ('winner' in out) out.youWon = out.winner === viewerIdx;
            delete out.player;
            delete out.target;
            delete out.winner;
            return out;
        });
    }

    // do adversário só vai o ativo e a contagem de vivos, nada de vazar o time
    view(viewerIdx) {
        const enemyIdx = 1 - viewerIdx;
        const you = this.state.players[viewerIdx];
        const enemyPlayer = this.state.players[enemyIdx];
        const enemyActive = engine.activePokemon(this.state, enemyIdx);
        return {
            matchId: this.id,
            turn: this.state.turn,
            phase: this.state.phase,
            youWon: this.state.winner === null ? null : this.state.winner === viewerIdx,
            mustSwitch: this.state.mustSwitch[viewerIdx],
            waitingEnemy: this.mustAct(1 - viewerIdx) && !this.pending[1 - viewerIdx],
            turnEndsAt: this.turnEndsAt,
            you: {
                name: this.players[viewerIdx].name,
                active: you.active,
                team: you.team,
            },
            enemy: {
                name: this.players[enemyIdx].name,
                isBot: !!this.players[enemyIdx].isBot,
                connected: this.players[enemyIdx].connected || !!this.players[enemyIdx].isBot,
                active: {
                    slug: enemyActive.slug,
                    name: enemyActive.name,
                    pokedexId: enemyActive.pokedexId,
                    types: enemyActive.types,
                    hp: enemyActive.hp,
                    maxHp: enemyActive.maxHp,
                },
                alive: enemyPlayer.team.filter((p) => p.hp > 0).length,
                teamSize: enemyPlayer.team.length,
            },
        };
    }

    broadcastView() {
        for (const i of [0, 1]) this.emitTo(i, 'state', this.view(i));
    }

    emitTo(playerIdx, event, payload) {
        const socket = this.players[playerIdx].socket;
        if (socket) socket.emit(event, payload);
    }

    handleDisconnect(playerIdx) {
        const player = this.players[playerIdx];
        player.connected = false;
        player.socket = null;
        if (this.state.phase === 'over') return;
        this.emitTo(1 - playerIdx, 'opponent-connection', { connected: false, graceMs: RECONNECT_MS });
        player.reconnectTimer = setTimeout(() => {
            // Não voltou a tempo: W.O. para o adversário.
            this.state.phase = 'over';
            this.state.winner = 1 - playerIdx;
            clearTimeout(this.turnTimer);
            this.turnEndsAt = null;
            this.emitTo(1 - playerIdx, 'turn-result', {
                events: [{ type: 'forfeit' }, { type: 'end', youWon: true }],
                view: this.view(1 - playerIdx),
            });
            this.finish();
        }, RECONNECT_MS);
    }

    forfeit(playerIdx) {
        if (this.state.phase === 'over') return;
        this.state.phase = 'over';
        this.state.winner = 1 - playerIdx;
        clearTimeout(this.turnTimer);
        this.turnEndsAt = null;
        const events = [
            { type: 'forfeit', player: playerIdx },
            { type: 'end', winner: this.state.winner },
        ];
        for (const i of [0, 1]) {
            this.emitTo(i, 'turn-result', { events: this.localizeEvents(events, i), view: this.view(i) });
        }
        this.finish();
    }

    handleReconnect(playerIdx, socket) {
        const player = this.players[playerIdx];
        clearTimeout(player.reconnectTimer);
        player.reconnectTimer = null;
        player.connected = true;
        player.socket = socket;
        socket.emit('match-start', this.view(playerIdx));
        this.emitTo(1 - playerIdx, 'opponent-connection', { connected: true });
    }

    finish() {
        clearTimeout(this.turnTimer);
        for (const p of this.players) clearTimeout(p.reconnectTimer);
        this.onEnd(this);
    }
}

module.exports = { Match, TURN_MS, RECONNECT_MS };
