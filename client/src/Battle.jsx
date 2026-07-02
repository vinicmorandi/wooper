import React, { useEffect, useRef, useState } from 'react';
import { spriteFront, spriteBack, needsMirror, spriteIcon, TYPE_LABELS_PT } from './pokedex';
import { sfx, playCry, stopMusic } from './audio';
import MuteButton from './MuteButton';
import ImpactFx, { fxKind, MeleeFx } from './BattleFx';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function messagesFor(e) {
    switch (e.type) {
        case 'switch':
            return [e.mine ? `Você mandou ${e.name}!` : `O adversário mandou ${e.name}!`];
        case 'move':
            return [`${e.mine ? 'Seu ' : ''}${e.pokemon} usou ${e.move}!`];
        case 'miss':
            return [e.mine ? 'Errou!' : 'O golpe do adversário errou!'];
        case 'damage': {
            if (e.effectiveness === 0) return ['Não afeta o alvo...'];
            const lines = [`Causou ${e.damage} de dano.`];
            if (e.effectiveness > 1) lines.push('É super efetivo!');
            if (e.effectiveness < 1) lines.push('Não é muito efetivo...');
            return lines;
        }
        case 'faint':
            return [`${e.pokemon} desmaiou!`];
        case 'forfeit':
            return [e.mine ? 'Você abandonou a partida.' : 'O adversário abandonou a partida.'];
        case 'end':
            return [e.youWon ? 'Você venceu a batalha!' : 'Você perdeu a batalha...'];
        default:
            return [];
    }
}

function sceneFrom(view) {
    const you = view.you.team[view.you.active];
    return {
        you: { poke: you, hp: you.hp },
        enemy: { poke: view.enemy.active, hp: view.enemy.active.hp },
        faintedYou: you.hp === 0,
        faintedEnemy: view.enemy.active.hp === 0,
    };
}

function HpBar({ hp, maxHp }) {
    const pct = Math.round((hp / maxHp) * 100);
    const tone = pct > 50 ? 'ok' : pct > 20 ? 'warn' : 'danger';
    return (
        <div className="hp-row">
            <span className="hp-label">HP</span>
            <div className="hpbar">
                <div className={`hpbar-fill ${tone}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function Countdown({ endsAt }) {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 250);
        return () => clearInterval(t);
    }, []);
    if (!endsAt) return null;
    const secs = Math.max(0, Math.ceil((endsAt - now) / 1000));
    return <span className={`countdown ${secs <= 10 ? 'danger' : ''}`}>{secs}</span>;
}

export default function Battle({
    view,
    log,
    packets = [],
    actionSent,
    enemyOffline,
    onAction,
    onLeave,
    onExitBattle,
    onLog,
    onViewSettled,
    onPacketDone,
}) {
    const { you, enemy } = view;
    const active = you.team[you.active];
    const [showSwitch, setShowSwitch] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [scene, setScene] = useState(() => sceneFrom(view));
    const [fx, setFx] = useState({});
    const [effects, setEffects] = useState([]);
    const [animating, setAnimating] = useState(false);
    const logEndRef = useRef(null);
    const viewRef = useRef(view);
    const prevViewRef = useRef(view); // view no início do turno sendo animado
    const visualViewRef = useRef(view);
    const mountedRef = useRef(true);
    const playingSeqRef = useRef(null);
    const fxSeqRef = useRef(0);
    const timersRef = useRef([]);

    viewRef.current = view;

    const addTimer = (timer) => {
        timersRef.current.push(timer);
        return timer;
    };

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            timersRef.current.forEach(clearTimeout);
            timersRef.current = [];
        };
    }, []);

    // Cries de entrada na batalha
    useEffect(() => {
        playCry(viewRef.current.you.team[viewRef.current.you.active].pokedexId);
        const t = setTimeout(() => playCry(viewRef.current.enemy.active.pokedexId), 800);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [log]);

    function scheduleEffect(effect, delay = 0, duration = 700) {
        const id = ++fxSeqRef.current;
        addTimer(setTimeout(() => {
            if (!mountedRef.current) return;
            setEffects((old) => [...old, { ...effect, id }]);
            addTimer(setTimeout(() => {
                if (!mountedRef.current) return;
                setEffects((old) => old.filter((item) => item.id !== id));
            }, duration));
        }, delay));
        return id;
    }

    function scheduleSpriteFx(effect, delay = 0, duration = 450) {
        const id = ++fxSeqRef.current;
        addTimer(setTimeout(() => {
            if (!mountedRef.current) return;
            setFx({ ...effect, id });
            addTimer(setTimeout(() => {
                if (!mountedRef.current) return;
                setFx((current) => (current.id === id ? {} : current));
            }, duration));
        }, delay));
    }

    // físico: investida + efeito em cima do alvo; especial: projétil
    function scheduleAttack(attacker, target, damage, moveType, category, superEffective, delay = 0) {
        const impactAt = category === 'special' ? delay + 400 : delay + 280;
        if (category === 'special') {
            scheduleEffect({ kind: 'projectile', side: attacker, type: moveType }, delay, 430);
        } else {
            scheduleSpriteFx({ lunge: attacker }, delay, 450);
            scheduleEffect({ kind: 'melee', side: target, type: moveType }, delay + 130, 620);
        }
        scheduleEffect({ kind: 'impact', side: target, type: moveType, text: damage > 0 ? `-${damage}` : null }, impactAt, 900);
        scheduleSpriteFx({ shake: target, screenShake: superEffective }, impactAt, 450);
        return impactAt - delay;
    }

    useEffect(() => {
        const hasQueuedAnimation = packets.length > 0 || animating;
        const sameMatch = visualViewRef.current?.matchId === view.matchId;
        if (sameMatch && hasQueuedAnimation) return;

        setScene(sceneFrom(view));
        prevViewRef.current = view;
        visualViewRef.current = view;
    }, [view, packets.length, animating]);

    // Coreografia do turno: cada evento vira som + efeito + linha de log.
    useEffect(() => {
        if (animating || packets.length === 0) return;
        const packet = packets[0];
        if (playingSeqRef.current === packet.seq) return;
        playingSeqRef.current = packet.seq;
        playPacket(packet);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [packets, animating]);

    async function playPacket(packet) {
        setAnimating(true);
        const finalView = packet.view;
        let lastMoveType = 'normal';
        let lastMoveCategory = 'physical';

        try {
            const startView = packet.prevView || visualViewRef.current || finalView;
            setScene(sceneFrom(startView));
            prevViewRef.current = startView;
            visualViewRef.current = startView;

            for (const [eventIdx, e] of packet.events.entries()) {
                if (!mountedRef.current) return;
                const msgs = messagesFor(e);
                if (msgs.length) onLog(msgs);

                switch (e.type) {
                    case 'switch': {
                        // quem entra aparece com o HP de entrada, não com o
                        // pós-turno (a view final já desconta o golpe que vem)
                        sfx.switchIn();
                        if (e.mine) {
                            const idx = finalView.you.active;
                            const poke = finalView.you.team[idx];
                            const before = startView.you.team[idx];
                            setScene((current) => ({
                                ...current,
                                you: { poke, hp: before ? before.hp : poke.hp },
                                faintedYou: false,
                            }));
                            playCry(poke.pokedexId);
                        } else {
                            const poke = finalView.enemy.active;
                            // sem acesso ao banco inimigo: soma de volta o dano
                            // do golpe que ele levar depois da troca
                            const hitAfter = packet.events
                                .slice(eventIdx + 1)
                                .find((ev) => ev.type === 'damage' && ev.targetMine === false);
                            const enteringHp = hitAfter
                                ? Math.min(poke.maxHp, hitAfter.targetHp + hitAfter.damage)
                                : poke.hp;
                            setScene((current) => ({
                                ...current,
                                enemy: { poke, hp: enteringHp },
                                faintedEnemy: false,
                            }));
                            playCry(poke.pokedexId);
                        }
                        await sleep(700);
                        break;
                    }
                    case 'move':
                        lastMoveType = e.moveType || 'normal';
                        lastMoveCategory = e.moveCategory || 'physical';
                        sfx.move(lastMoveType);
                        await sleep(450);
                        break;
                    case 'miss':
                        sfx.miss();
                        await sleep(450);
                        break;
                    case 'damage': {
                        const target = e.targetMine ? 'you' : 'enemy';
                        const attacker = e.targetMine ? 'enemy' : 'you';
                        const impactAt = scheduleAttack(
                            attacker, target, e.damage,
                            lastMoveType, lastMoveCategory, e.effectiveness > 1
                        );
                        // som do impacto em sincronia com o visual
                        addTimer(setTimeout(() => sfx.hit(e.effectiveness), impactAt));
                        await sleep(impactAt + 20);
                        setScene((current) => ({
                            ...current,
                            [target]: {
                                ...current[target],
                                hp: e.targetHp,
                            },
                            ...(target === 'you'
                                ? { faintedYou: e.targetHp === 0 }
                                : { faintedEnemy: e.targetHp === 0 }),
                        }));
                        await sleep(800);
                        break;
                    }
                    case 'faint': {
                        const target = e.mine ? 'you' : 'enemy';
                        setScene((current) => ({
                            ...current,
                            [target]: {
                                ...current[target],
                                hp: 0,
                            },
                            ...(target === 'you'
                                ? { faintedYou: true }
                                : { faintedEnemy: true }),
                        }));
                        sfx.faint();
                        await sleep(750);
                        break;
                    }
                    case 'end':
                        stopMusic();
                        if (e.youWon) sfx.win(); else sfx.lose();
                        await sleep(500);
                        break;
                    default:
                        await sleep(200);
                }
            }
        } catch (err) {
            console.error('Erro ao animar turno:', err);
        } finally {
            if (!mountedRef.current) return;
            setScene(sceneFrom(finalView));
            prevViewRef.current = finalView;
            visualViewRef.current = finalView;
            onViewSettled(finalView);
            onPacketDone(packet.seq);
            setAnimating(false);
            playingSeqRef.current = null;
        }
    }

    const resolvingTurn = packets.length > 0 || animating;
    const gameOver = view.youWon !== null;
    const showResult = gameOver && !resolvingTurn;
    const forcedSwitch = view.phase === 'switch' && view.mustSwitch;
    const canAct = !gameOver && !actionSent && !resolvingTurn && (view.phase === 'move' || forcedSwitch);
    const canUseMoves = canAct && view.phase === 'move';

    // Troca forçada abre o seletor sozinha (depois da animação)
    useEffect(() => {
        if (resolvingTurn || actionSent || gameOver) {
            setShowSwitch(false);
            return;
        }
        if (forcedSwitch) setShowSwitch(true);
        else setShowSwitch(false);
    }, [forcedSwitch, actionSent, resolvingTurn, gameOver]);

    const benchTargets = you.team
        .map((poke, i) => ({ poke, i }))
        .filter(({ poke, i }) => poke.hp > 0 && i !== you.active);

    const doSwitch = (i) => {
        setShowSwitch(false);
        onAction({ type: 'switch', index: i });
    };

    const yourPoke = scene.you.poke;
    const enemyPoke = scene.enemy.poke;
    const screenShake = fx.screenShake || effects.some((effect) => effect.screenShake);

    return (
        <div className="screen battle-screen">
            <header className="battle-top">
                <span>TURNO {view.turn}</span>
                {!gameOver && <Countdown endsAt={view.turnEndsAt} />}
                {enemyOffline && <span className="offline">adversário reconectando...</span>}
                {!gameOver && (
                    <button className="battle-exit btn" onClick={() => setShowExitConfirm(true)}>
                        Sair
                    </button>
                )}
                <MuteButton />
            </header>

            <div className={`arena frame ${screenShake ? 'screen-shake' : ''}`}>
                {effects
                    .filter((effect) => effect.kind === 'projectile')
                    .map((effect) => (
                        <div key={effect.id} className={`projectile ${effect.side}`}>
                            <span className={`pj pj-${fxKind(effect.type)} type-${effect.type}`} />
                        </div>
                    ))}
                {/* Adversário */}
                <div className="side enemy-side">
                    <div className="statbox">
                        <div className="statbox-head">
                            <strong>{enemyPoke.name}</strong>
                            <span className="trainer">{enemy.name}{enemy.isBot ? ' [BOT]' : ''}</span>
                        </div>
                        <HpBar hp={scene.enemy.hp} maxHp={enemyPoke.maxHp} />
                        <div className="balls">
                            {Array.from({ length: enemy.teamSize }, (_, i) => (
                                <span key={i} className={`ball ${i < enemy.alive ? '' : 'out'}`} />
                            ))}
                        </div>
                    </div>
                    <div className="pedestal">
                        <img
                            className={[
                                'sprite enemy-sprite',
                                scene.faintedEnemy ? 'fainted' : '',
                                fx.lunge === 'enemy' ? 'lunge-enemy' : '',
                                fx.shake === 'enemy' ? 'hit-shake' : '',
                            ].join(' ')}
                            alt={enemyPoke.name}
                            src={spriteFront(enemyPoke.pokedexId)}
                        />
                        <div className="platform" />
                        {effects
                            .filter((effect) => effect.kind === 'melee' && effect.side === 'enemy')
                            .map((effect) => <MeleeFx key={effect.id} type={effect.type} />)}
                        {effects
                            .filter((effect) => effect.kind === 'impact' && effect.side === 'enemy')
                            .map((effect) => (
                                <React.Fragment key={effect.id}>
                                    <ImpactFx type={effect.type} />
                                    <div className={`impact-ring type-${effect.type}`} />
                                    {effect.text && <span className="dmg-popup">{effect.text}</span>}
                                </React.Fragment>
                            ))}
                    </div>
                </div>

                {/* Você */}
                <div className="side you-side">
                    <div className="pedestal">
                        <img
                            className={[
                                'sprite you-sprite',
                                scene.faintedYou ? 'fainted' : '',
                                needsMirror(yourPoke.pokedexId) ? 'mirrored' : '',
                                fx.lunge === 'you' ? 'lunge-you' : '',
                                fx.shake === 'you' ? 'hit-shake' : '',
                            ].join(' ')}
                            alt={yourPoke.name}
                            src={spriteBack(yourPoke.pokedexId)}
                        />
                        <div className="platform" />
                        {effects
                            .filter((effect) => effect.kind === 'melee' && effect.side === 'you')
                            .map((effect) => <MeleeFx key={effect.id} type={effect.type} />)}
                        {effects
                            .filter((effect) => effect.kind === 'impact' && effect.side === 'you')
                            .map((effect) => (
                                <React.Fragment key={effect.id}>
                                    <ImpactFx type={effect.type} />
                                    <div className={`impact-ring type-${effect.type}`} />
                                    {effect.text && <span className="dmg-popup">{effect.text}</span>}
                                </React.Fragment>
                            ))}
                    </div>
                    <div className="statbox">
                        <div className="statbox-head">
                            <strong>{yourPoke.name}</strong>
                            <span className="trainer">{you.name}</span>
                        </div>
                        <HpBar hp={scene.you.hp} maxHp={yourPoke.maxHp} />
                        <span className="hp-num">{scene.you.hp}/{yourPoke.maxHp}</span>
                        <div className="balls">
                            {you.team.map((p) => (
                                <span key={p.slug} className={`ball ${p.hp > 0 ? '' : 'out'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bottom">
                <div className="moves frame">
                    {active.moves.map((move, i) => (
                        <button key={move.slug + i}
                            className={`move type-${move.type}`}
                            disabled={!canUseMoves}
                            onClick={() => onAction({ type: 'move', index: i })}>
                            <span className="move-name">{move.name}</span>
                            <span className="move-meta">
                                {TYPE_LABELS_PT[move.type]} · {move.power} POW · {move.accuracy}%
                            </span>
                        </button>
                    ))}
                    <button className="move switch-btn"
                        disabled={!canUseMoves || benchTargets.length === 0}
                        onClick={() => setShowSwitch(true)}>
                        Trocar de Pokémon
                    </button>
                    {actionSent && !showResult && <p className="hint">Aguardando o adversário...</p>}
                    {!actionSent && resolvingTurn && !showResult && <p className="hint">Resolvendo turno...</p>}
                </div>

                <div className="log frame">
                    {log.map((line, i) => <p key={i}>{line}</p>)}
                    <div ref={logEndRef} />
                </div>
            </div>

            {/* Seletor de troca */}
            {showSwitch && !gameOver && !resolvingTurn && !actionSent && (
                <div className="overlay">
                    <div className="dialog">
                        <h3>{forcedSwitch ? `${active.name} desmaiou! Escolha o próximo:` : 'Trocar para:'}</h3>
                        <div className="bench">
                            {benchTargets.map(({ poke, i }) => (
                                <button key={poke.slug} className="bench-item" onClick={() => doSwitch(i)}>
                                    <img alt={poke.name} src={spriteIcon(poke.pokedexId)} />
                                    <span>{poke.name}</span>
                                    <small>{poke.hp}/{poke.maxHp} HP</small>
                                </button>
                            ))}
                        </div>
                        {!forcedSwitch && (
                            <button className="btn" onClick={() => setShowSwitch(false)}>Cancelar</button>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmação de saída (sair = W.O. para o adversário) */}
            {showExitConfirm && !gameOver && (
                <div className="overlay">
                    <div className="dialog">
                        <h3>Sair da batalha?</h3>
                        <p>Abandonar a partida conta como derrota por W.O.</p>
                        <div className="dialog-actions">
                            <button className="btn" onClick={() => setShowExitConfirm(false)}>Ficar</button>
                            <button className="btn primary" onClick={onExitBattle}>Sair</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resultado */}
            {showResult && (
                <div className="overlay">
                    <div className={`dialog result ${view.youWon ? 'win' : 'lose'}`}>
                        <h2>{view.youWon ? 'VOCÊ VENCEU!' : 'VOCÊ PERDEU...'}</h2>
                        <p>{view.youWon
                            ? 'BOA! Esse é o meu menino! Vamos mais uma?'
                            : 'Não foi dessa vez, guerreirinho. Vamos mais uma?'}</p>
                        <button className="btn primary" onClick={onLeave}>Jogar de novo</button>
                    </div>
                </div>
            )}
        </div>
    );
}
