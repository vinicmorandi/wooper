// Motor de batalha. Funções puras: estado + ações + rng -> novo estado + eventos.
// O rng vem de fora pra facilitar os testes.
const { effectiveness } = require('./typeChart');

const LEVEL = 100;

// Fórmula padrão de stats no nível 100 (IV 31, EV ~63).
function calcStat(base, isHp) {
    const core = Math.floor(2 * base + 31 + 255 / 4);
    return isHp ? core + LEVEL + 10 : core + 5;
}

function buildPokemon(spec) {
    const stats = {
        atk: calcStat(spec.baseStats.atk),
        def: calcStat(spec.baseStats.def),
        spa: calcStat(spec.baseStats.spa),
        spd: calcStat(spec.baseStats.spd),
        spe: calcStat(spec.baseStats.spe),
    };
    const maxHp = calcStat(spec.baseStats.hp, true);
    return {
        slug: spec.slug,
        name: spec.name,
        pokedexId: spec.pokedexId,
        types: spec.types,
        stats,
        maxHp,
        hp: maxHp,
        moves: spec.moves,
    };
}

function createBattle(teamSpecsA, teamSpecsB) {
    return {
        turn: 1,
        phase: 'move', // 'move' | 'switch' | 'over'
        winner: null, // 0 | 1 | null
        mustSwitch: [false, false],
        players: [
            { active: 0, team: teamSpecsA.map(buildPokemon) },
            { active: 0, team: teamSpecsB.map(buildPokemon) },
        ],
    };
}

function activePokemon(state, playerIdx) {
    const p = state.players[playerIdx];
    return p.team[p.active];
}

function aliveIndexes(state, playerIdx) {
    return state.players[playerIdx].team
        .map((poke, i) => (poke.hp > 0 ? i : -1))
        .filter((i) => i >= 0);
}

// ações válidas agora; também serve pro sorteio do timeout
function legalActions(state, playerIdx) {
    if (state.phase === 'over') return [];
    const player = state.players[playerIdx];
    const switches = aliveIndexes(state, playerIdx)
        .filter((i) => i !== player.active)
        .map((i) => ({ type: 'switch', index: i }));

    if (state.phase === 'switch') {
        return state.mustSwitch[playerIdx] ? switches : [];
    }
    const moves = activePokemon(state, playerIdx).moves
        .map((_, i) => ({ type: 'move', index: i }));
    return moves.concat(switches);
}

function isLegal(state, playerIdx, action) {
    return legalActions(state, playerIdx).some(
        (a) => action && a.type === action.type && a.index === action.index
    );
}

// Dano de um golpe já com STAB, efetividade e roll (0.85-1.0).
// Categoria física usa atk/def; especial usa spa/spd.
function calcDamage(attacker, defender, move, roll) {
    const mult = effectiveness(move.type, defender.types);
    if (mult === 0) return { damage: 0, mult };

    const atk = move.category === 'physical' ? attacker.stats.atk : attacker.stats.spa;
    const def = move.category === 'physical' ? defender.stats.def : defender.stats.spd;
    const stab = attacker.types.includes(move.type) ? 1.5 : 1;

    const base = Math.floor(((2 * LEVEL / 5 + 2) * move.power * atk / def) / 50) + 2;
    const damage = Math.max(1, Math.floor(base * stab * mult * roll));
    return { damage, mult };
}

function applySwitch(state, playerIdx, index, events) {
    state.players[playerIdx].active = index;
    const poke = activePokemon(state, playerIdx);
    events.push({ type: 'switch', player: playerIdx, pokemon: poke.slug, name: poke.name });
}

function applyMove(state, playerIdx, moveIndex, rng, events) {
    const attacker = activePokemon(state, playerIdx);
    if (attacker.hp <= 0) return; // desmaiou antes de agir neste turno

    const defenderIdx = 1 - playerIdx;
    const defender = activePokemon(state, defenderIdx);
    const move = attacker.moves[moveIndex];
    events.push({
        type: 'move',
        player: playerIdx,
        pokemon: attacker.name,
        move: move.name,
        moveType: move.type,
        moveCategory: move.category, // physical/special: muda a animação no cliente
    });

    if (rng() * 100 >= move.accuracy) {
        events.push({ type: 'miss', player: playerIdx });
        return;
    }

    const roll = 0.85 + rng() * 0.15;
    const { damage, mult } = calcDamage(attacker, defender, move, roll);
    defender.hp = Math.max(0, defender.hp - damage);
    events.push({
        type: 'damage',
        player: playerIdx,
        target: defenderIdx,
        damage,
        effectiveness: mult,
        targetHp: defender.hp,
        targetMaxHp: defender.maxHp,
    });

    if (defender.hp === 0) {
        events.push({ type: 'faint', player: defenderIdx, pokemon: defender.name });
    }
}

// Fecha o turno: decide vencedor, troca forçada ou próximo turno.
function settle(state, events) {
    for (const playerIdx of [0, 1]) {
        const alive = aliveIndexes(state, playerIdx);
        if (alive.length === 0) {
            state.phase = 'over';
            state.winner = 1 - playerIdx;
            events.push({ type: 'end', winner: state.winner });
            return;
        }
        state.mustSwitch[playerIdx] = activePokemon(state, playerIdx).hp === 0;
    }
    state.phase = state.mustSwitch.some(Boolean) ? 'switch' : 'move';
}

// resolve um passo da batalha; na fase 'switch' só quem tem mustSwitch age.
// devolve um estado novo, o original não é mutado.
function resolveTurn(prevState, actions, rng) {
    if (prevState.phase === 'over') {
        throw new Error('battle is over');
    }
    const state = JSON.parse(JSON.stringify(prevState));
    const events = [];

    if (state.phase === 'switch') {
        for (const playerIdx of [0, 1]) {
            if (!state.mustSwitch[playerIdx]) continue;
            const action = actions[playerIdx];
            if (!isLegal(state, playerIdx, action)) {
                throw new Error(`illegal switch action for player ${playerIdx}`);
            }
            applySwitch(state, playerIdx, action.index, events);
            state.mustSwitch[playerIdx] = false;
        }
        state.phase = 'move';
        return { state, events };
    }

    for (const playerIdx of [0, 1]) {
        if (!isLegal(state, playerIdx, actions[playerIdx])) {
            throw new Error(`illegal action for player ${playerIdx}`);
        }
    }

    // Trocas voluntárias resolvem antes de qualquer golpe.
    for (const playerIdx of [0, 1]) {
        if (actions[playerIdx].type === 'switch') {
            applySwitch(state, playerIdx, actions[playerIdx].index, events);
        }
    }

    // Golpes em ordem de velocidade; empate decidido no rng.
    const movers = [0, 1].filter((i) => actions[i].type === 'move');
    if (movers.length === 2) {
        const speedA = activePokemon(state, 0).stats.spe;
        const speedB = activePokemon(state, 1).stats.spe;
        const firstIsA = speedA === speedB ? rng() < 0.5 : speedA > speedB;
        if (!firstIsA) movers.reverse();
    }
    for (const playerIdx of movers) {
        if (state.phase === 'over') break;
        applyMove(state, playerIdx, actions[playerIdx].index, rng, events);
        settle(state, events);
    }
    if (state.phase !== 'over') {
        state.turn += 1;
    }
    return { state, events };
}

module.exports = {
    LEVEL,
    calcStat,
    buildPokemon,
    createBattle,
    activePokemon,
    aliveIndexes,
    legalActions,
    isLegal,
    calcDamage,
    resolveTurn,
};
