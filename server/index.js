// Servidor do Wooper: Express (pokédex + health) + Socket.IO (todo o jogo).
// Sem banco na v1 - partidas vivem em memória, ninguém cria conta.
const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const compression = require('compression');
const { Server } = require('socket.io');
const { Match } = require('./src/match');
const pokedex = require('./src/pokedex');

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

const app = express();
app.use(cors());
app.use(compression());
app.get('/', (req, res) => res.json({ ok: true, service: 'wooper-server' }));

// Dataset completo para o team builder (o cliente monta, o servidor valida).
app.get('/pokedex', (req, res) => {
    res.set('Cache-Control', 'public, max-age=86400');
    res.json({ moves: pokedex.raw.moves, pokemon: pokedex.raw.pokemon });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: CLIENT_ORIGIN, methods: ['GET', 'POST'] },
});

// ---- Estado em memória ----
let queue = null; // { token, name, socket, team } aguardando matchmaking
const rooms = new Map(); // código -> { token, name, socket, team }
const matchByToken = new Map(); // token do jogador -> Match ativa

function sanitizeName(name) {
    const clean = String(name || '').trim().slice(0, 20);
    return clean || 'Treinador';
}

// Sem time -> time padrão; time inválido -> null (o handler avisa e aborta).
function resolveTeam(input, socket) {
    if (input == null) return pokedex.defaultTeam();
    const result = pokedex.validateTeam(input);
    if (!result.ok) {
        socket.emit('error-msg', `Time recusado: ${result.error}`);
        return null;
    }
    return result.specs;
}

function roomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    do {
        code = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    } while (rooms.has(code));
    return code;
}

function startMatch(p0, p1) {
    const match = new Match([p0, p1], io, (ended) => {
        for (const p of ended.players) matchByToken.delete(p.token);
    });
    for (const p of [p0, p1]) {
        if (!p.isBot) matchByToken.set(p.token, match);
    }
    match.start();
}

function leaveWaitingSpots(socket) {
    if (queue && queue.socket.id === socket.id) queue = null;
    for (const [code, waiting] of rooms) {
        if (waiting.socket.id === socket.id) rooms.delete(code);
    }
}

io.on('connection', (socket) => {
    let myToken = null;

    const inMatch = () => (myToken && matchByToken.get(myToken)) || null;

    // Retomar partida depois de cair (o token identifica o jogador)
    socket.on('resume', ({ token }) => {
        myToken = token;
        const match = matchByToken.get(token);
        if (match) {
            match.handleReconnect(match.playerIndex(token), socket);
        } else {
            socket.emit('no-match');
        }
    });

    socket.on('play-bot', ({ token, name, team }) => {
        if (inMatch()) return;
        const specs = resolveTeam(team, socket);
        if (!specs) return;
        myToken = token;
        leaveWaitingSpots(socket);
        startMatch(
            { token, name: sanitizeName(name), socket, team: specs },
            { token: `bot-${token}`, name: 'Wooper Bot', socket: null, isBot: true, team: pokedex.randomTeam() }
        );
    });

    socket.on('queue', ({ token, name, team }) => {
        if (inMatch()) return;
        const specs = resolveTeam(team, socket);
        if (!specs) return;
        myToken = token;
        leaveWaitingSpots(socket);
        if (queue && queue.token !== token) {
            const opponent = queue;
            queue = null;
            startMatch(opponent, { token, name: sanitizeName(name), socket, team: specs });
        } else {
            queue = { token, name: sanitizeName(name), socket, team: specs };
            socket.emit('waiting', { mode: 'queue' });
        }
    });

    socket.on('create-room', ({ token, name, team }, ack) => {
        if (inMatch()) return;
        const specs = resolveTeam(team, socket);
        if (!specs) return;
        myToken = token;
        leaveWaitingSpots(socket);
        const code = roomCode();
        rooms.set(code, { token, name: sanitizeName(name), socket, team: specs });
        if (typeof ack === 'function') ack({ code });
        socket.emit('waiting', { mode: 'room', code });
    });

    socket.on('join-room', ({ token, name, team, code }) => {
        if (inMatch()) return;
        const specs = resolveTeam(team, socket);
        if (!specs) return;
        myToken = token;
        leaveWaitingSpots(socket);
        const waiting = rooms.get(String(code || '').toUpperCase());
        if (!waiting || waiting.token === token) {
            socket.emit('error-msg', 'Sala não encontrada.');
            return;
        }
        rooms.delete(String(code).toUpperCase());
        startMatch(waiting, { token, name: sanitizeName(name), socket, team: specs });
    });

    socket.on('action', ({ action }) => {
        const match = inMatch();
        if (match) match.submitAction(match.playerIndex(myToken), action);
    });

    socket.on('forfeit', () => {
        const match = inMatch();
        if (match) match.forfeit(match.playerIndex(myToken));
    });

    socket.on('cancel-wait', () => leaveWaitingSpots(socket));

    socket.on('disconnect', () => {
        leaveWaitingSpots(socket);
        const match = inMatch();
        if (match) match.handleDisconnect(match.playerIndex(myToken));
    });
});

httpServer.listen(PORT, () => {
    console.log(`Wooper server ouvindo na porta ${PORT}`);
});
