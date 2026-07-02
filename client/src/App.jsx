import React, { useCallback, useEffect, useRef, useState } from 'react';
import { socket, getToken } from './socket';
import Lobby from './Lobby';
import Battle from './Battle';
import TeamBuilder from './TeamBuilder';
import MuteButton from './MuteButton';
import { startBattleMusic, stopMusic, sfx } from './audio';

const TEAM_KEY = 'wooper-team';

function loadTeam() {
    try {
        const team = JSON.parse(localStorage.getItem(TEAM_KEY));
        return Array.isArray(team) && team.length === 6 ? team : null;
    } catch {
        return null;
    }
}

export default function App() {
    const [screen, setScreen] = useState('lobby'); // 'lobby' | 'team' | 'waiting' | 'battle'
    const [view, setView] = useState(null);
    const [log, setLog] = useState([]);
    const [packets, setPackets] = useState([]); // fila de turnos para o Battle animar
    const [waitInfo, setWaitInfo] = useState(null); // { mode, code? }
    const [error, setError] = useState('');
    const [actionSent, setActionSent] = useState(false);
    const [enemyOffline, setEnemyOffline] = useState(false);
    const [team, setTeam] = useState(loadTeam);
    const tokenRef = useRef(getToken());
    const viewRef = useRef(null);
    const seqRef = useRef(0);

    useEffect(() => {
        socket.connect();

        socket.on('connect', () => {
            // Se caímos no meio de uma partida, o servidor nos coloca de volta.
            socket.emit('resume', { token: tokenRef.current });
        });

        socket.on('match-start', (v) => {
            viewRef.current = v;
            setView(v);
            setLog(['A batalha começou! Escolha um golpe.']);
            setPackets([]);
            setActionSent(false);
            setEnemyOffline(false);
            setError('');
            setScreen('battle');
            startBattleMusic();
        });

        socket.on('state', (v) => {
            viewRef.current = v;
            setView(v);
            setActionSent(false);
        });

        socket.on('turn-result', ({ events, view: v }) => {
            const prevView = viewRef.current;
            viewRef.current = v;
            setView(v);
            setActionSent(false);
            // guarda a view junto: cada animação usa o estado do próprio turno
            setPackets((old) => [...old, { seq: ++seqRef.current, events, view: v, prevView }]);
        });

        socket.on('waiting', (info) => {
            setWaitInfo(info);
            setScreen('waiting');
        });

        socket.on('opponent-connection', ({ connected }) => {
            setEnemyOffline(!connected);
            setLog((old) => [
                ...old,
                connected ? 'O adversário voltou!' : 'O adversário caiu... aguardando 30s pela reconexão.',
            ]);
        });

        socket.on('no-match', () => { /* sem partida pra retomar: segue no lobby */ });
        socket.on('error-msg', (msg) => setError(msg));

        return () => {
            socket.removeAllListeners();
            stopMusic();
        };
    }, []);

    const appendLog = useCallback((lines) => {
        setLog((old) => [...old, ...lines]);
    }, []);

    const settleView = useCallback((nextView) => {
        viewRef.current = nextView;
        setView(nextView);
    }, []);

    const dropPacket = useCallback((seq) => {
        setPackets((old) => old.filter((packet) => packet.seq > seq));
    }, []);

    const play = (mode, payload = {}) => {
        setError('');
        sfx.click(); // também "destrava" o AudioContext dentro do gesto do usuário
        socket.emit(mode, { token: tokenRef.current, team, ...payload });
    };

    const sendAction = (action) => {
        if (actionSent) return;
        setActionSent(true);
        socket.emit('action', { action });
    };

    const saveTeam = (slots) => {
        localStorage.setItem(TEAM_KEY, JSON.stringify(slots));
        setTeam(slots);
        setScreen('lobby');
    };

    const backToLobby = () => {
        stopMusic();
        setScreen('lobby');
        setView(null);
        setLog([]);
        setPackets([]);
        setWaitInfo(null);
        setActionSent(false);
    };

    const exitBattle = () => {
        socket.emit('forfeit');
        backToLobby();
    };

    const cancelWait = () => {
        socket.emit('cancel-wait');
        backToLobby();
    };

    if (screen === 'battle' && view) {
        return (
            <Battle
                key={view.matchId}
                view={view}
                log={log}
                packets={packets}
                actionSent={actionSent}
                enemyOffline={enemyOffline}
                onAction={sendAction}
                onLeave={backToLobby}
                onExitBattle={exitBattle}
                onLog={appendLog}
                onViewSettled={settleView}
                onPacketDone={dropPacket}
            />
        );
    }

    if (screen === 'team') {
        return <TeamBuilder team={team} onSave={saveTeam} onBack={() => setScreen('lobby')} />;
    }

    if (screen === 'waiting') {
        return (
            <div className="screen">
                <div className="frame menu waiting-panel">
                    <img className="mascot" alt="Wooper"
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/194.gif" />
                    {waitInfo?.mode === 'room' ? (
                        <>
                            <h2>Sala criada!</h2>
                            <p>Passe este código para o seu adversário:</p>
                            <div className="room-code">{waitInfo.code}</div>
                        </>
                    ) : (
                        <h2>Procurando adversário<span className="dots" /></h2>
                    )}
                    <p className="hint">A partida começa assim que alguém entrar.</p>
                    <button className="btn" onClick={cancelWait}>Cancelar</button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="corner-mute"><MuteButton /></div>
            <Lobby
                onPlay={play}
                onEditTeam={() => { sfx.click(); setScreen('team'); }}
                team={team}
                error={error}
            />
        </>
    );
}
