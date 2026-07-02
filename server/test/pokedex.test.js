const {
    validateTeam,
    defaultTeam,
    randomTeam,
    autoMoves,
    prettyName,
    TEAM_SIZE,
    MAX_MOVES,
    raw,
} = require('../src/pokedex');

const validEntry = (slug, moves) => ({ slug, moves });

function validDef() {
    return [
        validEntry('charizard', ['flamethrower', 'earthquake']),
        validEntry('blastoise', ['surf']),
        validEntry('venusaur', ['energy-ball']),
        validEntry('gengar', ['shadow-ball']),
        validEntry('snorlax', ['body-slam']),
        validEntry('jolteon', ['thunderbolt']),
    ];
}

describe('dataset', () => {
    test('tem a pokédex inteira e golpes de dano', () => {
        expect(raw.pokemon.length).toBeGreaterThan(1000);
        expect(Object.keys(raw.moves).length).toBeGreaterThan(400);
    });

    test('todo pokémon tem pelo menos 1 golpe de dano aprendível', () => {
        for (const poke of raw.pokemon) {
            expect(poke.moves.length).toBeGreaterThan(0);
        }
    });

    test('golpes só usam os 18 tipos padrão e categorias físico/especial', () => {
        const types = new Set(['normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
            'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
            'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy']);
        for (const move of Object.values(raw.moves)) {
            expect(types.has(move.type)).toBe(true);
            expect(['physical', 'special']).toContain(move.category);
            expect(move.power).toBeGreaterThan(0);
            expect(move.accuracy).toBeGreaterThan(0);
        }
    });
});

describe('validateTeam', () => {
    test('aceita time válido e monta os specs', () => {
        const result = validateTeam(validDef());
        expect(result.ok).toBe(true);
        expect(result.specs).toHaveLength(TEAM_SIZE);
        expect(result.specs[0].name).toBe('Charizard');
        expect(result.specs[0].moves[0]).toMatchObject({
            slug: 'flamethrower', type: 'fire', category: 'special', power: 90, accuracy: 100,
        });
        expect(result.specs[0].baseStats.hp).toBe(78);
    });

    test('rejeita tamanho errado', () => {
        expect(validateTeam(validDef().slice(0, 5)).ok).toBe(false);
        expect(validateTeam(null).ok).toBe(false);
        expect(validateTeam('oi').ok).toBe(false);
    });

    test('rejeita pokémon duplicado ou desconhecido', () => {
        const dupe = validDef();
        dupe[1] = validEntry('charizard', ['earthquake']);
        expect(validateTeam(dupe).ok).toBe(false);

        const unknown = validDef();
        unknown[0] = validEntry('agumon', ['flamethrower']);
        expect(validateTeam(unknown).ok).toBe(false);
    });

    test('rejeita golpe que o pokémon não aprende', () => {
        const bad = validDef();
        bad[0] = validEntry('charizard', ['surf']); // charizard não aprende surf
        const result = validateTeam(bad);
        expect(result.ok).toBe(false);
        expect(result.error).toMatch(/não aprende/);
    });

    test('rejeita lista de golpes vazia, repetida ou grande demais', () => {
        const noMoves = validDef();
        noMoves[0] = validEntry('charizard', []);
        expect(validateTeam(noMoves).ok).toBe(false);

        const repeated = validDef();
        repeated[0] = validEntry('charizard', ['flamethrower', 'flamethrower']);
        expect(validateTeam(repeated).ok).toBe(false);

        const tooMany = validDef();
        tooMany[0] = validEntry('charizard', ['flamethrower', 'earthquake', 'dragon-claw', 'air-slash', 'fire-blast']);
        expect(validateTeam(tooMany).ok).toBe(false);
    });

    test('rejeita golpe injetado que não existe no dataset', () => {
        const injected = validDef();
        injected[0] = validEntry('charizard', ['golpe-hackeado']);
        expect(validateTeam(injected).ok).toBe(false);
    });
});

describe('times automáticos', () => {
    test('time padrão é válido e tem 6 pokémon com 4 golpes', () => {
        const team = defaultTeam();
        expect(team).toHaveLength(TEAM_SIZE);
        for (const spec of team) expect(spec.moves).toHaveLength(MAX_MOVES);
    });

    test('time aleatório sai válido pelo próprio validateTeam', () => {
        for (let i = 0; i < 5; i++) {
            const team = randomTeam();
            const asInput = team.map((spec) => ({
                slug: spec.slug,
                moves: spec.moves.map((m) => m.slug),
            }));
            expect(validateTeam(asInput).ok).toBe(true);
        }
    });

    test('autoMoves prioriza cobertura de tipos', () => {
        const moves = autoMoves('charizard');
        expect(moves.length).toBeGreaterThan(0);
        expect(moves.length).toBeLessThanOrEqual(MAX_MOVES);
        const types = moves.map((m) => raw.moves[m].type);
        expect(new Set(types).size).toBe(types.length); // sem tipo repetido
    });
});

describe('prettyName', () => {
    test('formata slugs', () => {
        expect(prettyName('mr-mime')).toBe('Mr Mime');
        expect(prettyName('charizard')).toBe('Charizard');
    });
});
