const {
    createBattle,
    activePokemon,
    legalActions,
    calcDamage,
    resolveTurn,
    calcStat,
} = require('../src/engine');
const { effectiveness } = require('../src/typeChart');
const { chooseAction } = require('../src/bot');
const { defaultTeam } = require('../src/pokedex');

const TEAM = defaultTeam();

// rng determinístico: devolve os valores da fila na ordem, depois repete o último.
function fakeRng(values) {
    let i = 0;
    return () => values[Math.min(i++, values.length - 1)];
}

// rng "sem sorte nem azar": nunca erra golpe (accuracy) e roll de dano máximo.
const noLuck = () => 0;

function freshBattle() {
    return createBattle(TEAM, TEAM);
}

describe('type chart', () => {
    test('super efetivo, não muito efetivo, imune e dupla fraqueza', () => {
        expect(effectiveness('water', ['fire'])).toBe(2);
        expect(effectiveness('fire', ['water'])).toBe(0.5);
        expect(effectiveness('normal', ['ghost'])).toBe(0);
        expect(effectiveness('electric', ['ground'])).toBe(0);
        // Charizard (fire/flying) toma 4x de pedra
        expect(effectiveness('rock', ['fire', 'flying'])).toBe(4);
        // Venusaur (grass/poison) resiste 4x a grama
        expect(effectiveness('grass', ['grass', 'poison'])).toBe(0.25);
    });
});

describe('stats', () => {
    test('fórmula de stat no nível 100', () => {
        expect(calcStat(100, true)).toBe(404); // HP: 2*100+31+63 + 110
        expect(calcStat(100)).toBe(299); // demais: 2*100+31+63 + 5
    });

    test('pokémon construído começa com HP cheio', () => {
        const state = freshBattle();
        for (const poke of state.players[0].team) {
            expect(poke.hp).toBe(poke.maxHp);
            expect(poke.hp).toBeGreaterThan(0);
            expect(poke.moves).toHaveLength(4);
        }
    });
});

describe('calcDamage', () => {
    const charizard = () => activePokemon(freshBattle(), 0); // fire/flying
    const blastoise = () => freshBattle().players[0].team[1]; // water

    test('STAB multiplica por 1.5', () => {
        const atk = charizard();
        const def = freshBattle().players[1].team[4]; // snorlax (normal)
        const flamethrower = atk.moves[0]; // fire, STAB
        const dragonClaw = atk.moves[2]; // dragon 80, sem STAB

        const withStab = calcDamage(atk, def, { ...dragonClaw, type: 'fire' }, 1).damage;
        const without = calcDamage(atk, def, dragonClaw, 1).damage;
        // mesmo poder/categoria/efetividade neutra, só muda o STAB
        expect(withStab).toBeGreaterThan(without);
        expect(withStab / without).toBeCloseTo(1.5, 1);
    });

    test('efetividade entra no dano e no retorno', () => {
        const atk = blastoise();
        const def = charizard(); // água pega 2x em fire/flying
        const surf = atk.moves[0];
        const { damage, mult } = calcDamage(atk, def, surf, 1);
        expect(mult).toBe(2);
        expect(damage).toBeGreaterThan(0);
    });

    test('imunidade dá dano zero', () => {
        const state = freshBattle();
        const jolteon = state.players[0].team[5];
        const thunderbolt = jolteon.moves[0];
        // fabrica um defensor tipo terra
        const target = { ...state.players[1].team[0], types: ['ground'] };
        expect(calcDamage(jolteon, target, thunderbolt, 1)).toEqual({ damage: 0, mult: 0 });
    });

    test('categoria física usa atk/def, especial usa spa/spd', () => {
        const snorlax = freshBattle().players[0].team[4]; // atk 110 >> spa 65
        const def = freshBattle().players[1].team[1]; // blastoise
        const bodySlam = snorlax.moves[0]; // physical 85
        const fakeSpecial = { ...bodySlam, category: 'special' };
        expect(calcDamage(snorlax, def, bodySlam, 1).damage)
            .toBeGreaterThan(calcDamage(snorlax, def, fakeSpecial, 1).damage);
    });

    test('dano mínimo é 1 quando não há imunidade', () => {
        const weak = { types: ['normal'], stats: { atk: 1, spa: 1 }, moves: [] };
        const tank = { types: ['steel'], stats: { def: 9999, spd: 9999 }, maxHp: 999 };
        const move = { type: 'normal', category: 'physical', power: 10, accuracy: 100 };
        expect(calcDamage(weak, tank, move, 0.85).damage).toBe(1);
    });
});

describe('resolveTurn', () => {
    test('o mais rápido ataca primeiro', () => {
        const state = freshBattle();
        state.players[0].active = 5; // jolteon, spe 130
        state.players[1].active = 4; // snorlax, spe 30
        const { events } = resolveTurn(state, {
            0: { type: 'move', index: 0 },
            1: { type: 'move', index: 0 },
        }, noLuck);
        const moveEvents = events.filter((e) => e.type === 'move');
        expect(moveEvents[0].player).toBe(0);
        expect(moveEvents[1].player).toBe(1);
    });

    test('empate de velocidade é decidido pelo rng', () => {
        const state = freshBattle(); // espelho: charizard x charizard, mesma spe
        const first = (rngValue) => {
            const { events } = resolveTurn(state, {
                0: { type: 'move', index: 0 },
                1: { type: 'move', index: 0 },
            }, fakeRng([rngValue, 0, 0, 0, 0, 0]));
            return events.filter((e) => e.type === 'move')[0].player;
        };
        expect(first(0.1)).toBe(0); // rng < 0.5 -> jogador 0 primeiro
        expect(first(0.9)).toBe(1);
    });

    test('golpe pode errar pela precisão', () => {
        const state = freshBattle();
        state.players[0].active = 5; // jolteon
        // thunder tem 70 de precisão; rng 0.99 -> 99 >= 70 -> erra
        const { events } = resolveTurn(state, {
            0: { type: 'move', index: 1 },
            1: { type: 'switch', index: 1 },
        }, fakeRng([0.99]));
        expect(events.some((e) => e.type === 'miss' && e.player === 0)).toBe(true);
        expect(events.some((e) => e.type === 'damage')).toBe(false);
    });

    test('troca voluntária resolve antes do golpe do adversário', () => {
        const state = freshBattle();
        const { state: next, events } = resolveTurn(state, {
            0: { type: 'switch', index: 4 }, // entra snorlax
            1: { type: 'move', index: 0 },
        }, noLuck);
        const switchIdx = events.findIndex((e) => e.type === 'switch');
        const damageIdx = events.findIndex((e) => e.type === 'damage');
        expect(switchIdx).toBeLessThan(damageIdx);
        // quem levou o dano foi o snorlax que acabou de entrar
        expect(next.players[0].team[4].hp).toBeLessThan(next.players[0].team[4].maxHp);
        expect(next.players[0].team[0].hp).toBe(next.players[0].team[0].maxHp);
    });

    test('faint abre fase de troca forçada e quem desmaiou não age', () => {
        const state = freshBattle();
        state.players[0].active = 5; // jolteon rápido
        state.players[1].team[0].hp = 1; // charizard adversário no talo
        const { state: next, events } = resolveTurn(state, {
            0: { type: 'move', index: 0 },
            1: { type: 'move', index: 0 },
        }, noLuck);
        expect(events.some((e) => e.type === 'faint' && e.player === 1)).toBe(true);
        // adversário desmaiou antes de agir: só um evento de golpe
        expect(events.filter((e) => e.type === 'move')).toHaveLength(1);
        expect(next.phase).toBe('switch');
        expect(next.mustSwitch).toEqual([false, true]);
        // na fase de troca, só vale trocar
        const legal = legalActions(next, 1);
        expect(legal.length).toBeGreaterThan(0);
        expect(legal.every((a) => a.type === 'switch')).toBe(true);
        expect(legalActions(next, 0)).toEqual([]);
    });

    test('fase de troca resolve e volta para fase de golpes', () => {
        const state = freshBattle();
        state.players[1].team[0].hp = 0;
        state.phase = 'switch';
        state.mustSwitch = [false, true];
        const { state: next, events } = resolveTurn(state, {
            1: { type: 'switch', index: 3 },
        }, noLuck);
        expect(events).toEqual([
            { type: 'switch', player: 1, pokemon: 'gengar', name: 'Gengar' },
        ]);
        expect(next.phase).toBe('move');
        expect(next.players[1].active).toBe(3);
    });

    test('último pokémon desmaiado encerra a partida', () => {
        const state = freshBattle();
        state.players[0].active = 5; // jolteon
        // adversário só com o charizard, com 1 de HP
        state.players[1].team.forEach((p, i) => { if (i !== 0) p.hp = 0; });
        state.players[1].team[0].hp = 1;
        const { state: next, events } = resolveTurn(state, {
            0: { type: 'move', index: 0 },
            1: { type: 'move', index: 0 },
        }, noLuck);
        expect(next.phase).toBe('over');
        expect(next.winner).toBe(0);
        expect(events[events.length - 1]).toEqual({ type: 'end', winner: 0 });
    });

    test('ação ilegal é rejeitada', () => {
        const state = freshBattle();
        expect(() => resolveTurn(state, {
            0: { type: 'switch', index: 0 }, // trocar para quem já está ativo
            1: { type: 'move', index: 0 },
        }, noLuck)).toThrow(/illegal/);
        expect(() => resolveTurn(state, {
            0: { type: 'move', index: 7 },
            1: { type: 'move', index: 0 },
        }, noLuck)).toThrow(/illegal/);
    });

    test('estado original não é mutado', () => {
        const state = freshBattle();
        const snapshot = JSON.stringify(state);
        resolveTurn(state, {
            0: { type: 'move', index: 0 },
            1: { type: 'move', index: 0 },
        }, noLuck);
        expect(JSON.stringify(state)).toBe(snapshot);
    });
});

describe('bot', () => {
    test('escolhe o golpe de maior dano esperado', () => {
        const state = freshBattle();
        state.players[1].active = 5; // jolteon (electric)
        state.players[0].active = 1; // blastoise: earthquake (ground 100) pega 2x em electric
        const action = chooseAction(state, 0);
        expect(action).toEqual({ type: 'move', index: 3 });
    });

    test('prefere dano esperado (precisão conta) a poder bruto', () => {
        const state = freshBattle();
        state.players[0].active = 5; // jolteon vs charizard: thunderbolt 2x
        const action = chooseAction(state, 0);
        // thunderbolt (90*2*1.5) > thunder (110*0.7*2*1.5)? 270 vs 231 -> thunderbolt
        expect(action).toEqual({ type: 'move', index: 0 });
    });

    test('em troca forçada escolhe um pokémon vivo diferente do atual', () => {
        const state = freshBattle();
        state.players[0].team[0].hp = 0;
        state.phase = 'switch';
        state.mustSwitch = [true, false];
        const action = chooseAction(state, 0);
        expect(action.type).toBe('switch');
        expect(action.index).not.toBe(0);
        expect(state.players[0].team[action.index].hp).toBeGreaterThan(0);
    });
});

describe('partida completa (fluxo de ponta a ponta)', () => {
    test('dois bots jogando sempre chegam a um vencedor', () => {
        // rng pseudo-determinístico simples
        let seed = 42;
        const rng = () => {
            seed = (seed * 1103515245 + 12345) % 2147483648;
            return seed / 2147483648;
        };
        let state = freshBattle();
        let guard = 0;
        while (state.phase !== 'over' && guard++ < 500) {
            const actions = {};
            if (state.phase === 'switch') {
                for (const i of [0, 1]) {
                    if (state.mustSwitch[i]) actions[i] = chooseAction(state, i);
                }
            } else {
                actions[0] = chooseAction(state, 0);
                actions[1] = chooseAction(state, 1);
            }
            state = resolveTurn(state, actions, rng).state;
        }
        expect(state.phase).toBe('over');
        expect([0, 1]).toContain(state.winner);
    });
});
