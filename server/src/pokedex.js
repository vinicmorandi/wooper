// Pokédex congelada (gerada por scripts/fetch-pokedex.js) + validação de time.
const raw = require('../data/pokedex.json');

const MOVES = raw.moves;
const POKEMON_BY_SLUG = new Map(raw.pokemon.map((p) => [p.slug, p]));

const TEAM_SIZE = 6;
const MAX_MOVES = 4;

// "mr-mime" -> "Mr Mime"
function prettyName(slug) {
    return slug
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function buildSpec(slug, moveSlugs) {
    const poke = POKEMON_BY_SLUG.get(slug);
    return {
        slug: poke.slug,
        name: prettyName(poke.slug),
        pokedexId: poke.pokedexId,
        types: poke.types,
        baseStats: poke.baseStats,
        moves: moveSlugs.map((m) => ({
            slug: m,
            name: prettyName(m),
            type: MOVES[m].type,
            category: MOVES[m].category,
            power: MOVES[m].power,
            accuracy: MOVES[m].accuracy,
        })),
    };
}

// [{ slug, moves: [slug, ...] }, ...] -> { ok, specs?, error? }
function validateTeam(input) {
    if (!Array.isArray(input) || input.length !== TEAM_SIZE) {
        return { ok: false, error: `O time precisa de ${TEAM_SIZE} pokémon.` };
    }
    const seen = new Set();
    const specs = [];
    for (const entry of input) {
        if (!entry || typeof entry.slug !== 'string' || !Array.isArray(entry.moves)) {
            return { ok: false, error: 'Formato de time inválido.' };
        }
        const poke = POKEMON_BY_SLUG.get(entry.slug);
        if (!poke) return { ok: false, error: `Pokémon desconhecido: ${entry.slug}` };
        if (seen.has(entry.slug)) return { ok: false, error: `${prettyName(entry.slug)} repetido no time.` };
        seen.add(entry.slug);

        const moves = [...new Set(entry.moves)];
        if (moves.length < 1 || moves.length > MAX_MOVES || moves.length !== entry.moves.length) {
            return { ok: false, error: `${prettyName(entry.slug)} precisa de 1 a ${MAX_MOVES} golpes, sem repetir.` };
        }
        for (const move of moves) {
            if (!poke.moves.includes(move)) {
                return { ok: false, error: `${prettyName(entry.slug)} não aprende ${prettyName(String(move))}.` };
            }
        }
        specs.push(buildSpec(entry.slug, moves));
    }
    return { ok: true, specs };
}

function moveScore(poke, moveSlug) {
    const move = MOVES[moveSlug];
    const stab = poke.types.includes(move.type) ? 1.5 : 1;
    return move.power * (move.accuracy / 100) * stab;
}

// 4 melhores golpes evitando repetir tipo, pra ter cobertura
function autoMoves(slug) {
    const poke = POKEMON_BY_SLUG.get(slug);
    const ranked = [...poke.moves].sort((a, b) => moveScore(poke, b) - moveScore(poke, a));
    const picked = [];
    const usedTypes = new Set();
    for (const move of ranked) {
        if (picked.length >= MAX_MOVES) break;
        if (!usedTypes.has(MOVES[move].type)) {
            picked.push(move);
            usedTypes.add(MOVES[move].type);
        }
    }
    for (const move of ranked) {
        if (picked.length >= MAX_MOVES) break;
        if (!picked.includes(move)) picked.push(move);
    }
    return picked;
}

// pool do time aleatório: só pokémon com BST decente
const STRONG_POOL = raw.pokemon.filter((p) => {
    const total = Object.values(p.baseStats).reduce((a, b) => a + b, 0);
    return total >= 450;
});

function randomTeam(rng = Math.random) {
    const picked = new Set();
    while (picked.size < TEAM_SIZE) {
        picked.add(STRONG_POOL[Math.floor(rng() * STRONG_POOL.length)].slug);
    }
    return [...picked].map((slug) => buildSpec(slug, autoMoves(slug)));
}

// quem não montou time joga com esse
const DEFAULT_TEAM_DEF = [
    { slug: 'charizard', moves: ['flamethrower', 'air-slash', 'dragon-claw', 'earthquake'] },
    { slug: 'blastoise', moves: ['surf', 'ice-beam', 'flash-cannon', 'earthquake'] },
    { slug: 'venusaur', moves: ['energy-ball', 'sludge-bomb', 'earthquake', 'body-slam'] },
    { slug: 'gengar', moves: ['shadow-ball', 'sludge-bomb', 'thunderbolt', 'psychic'] },
    { slug: 'snorlax', moves: ['body-slam', 'earthquake', 'crunch', 'ice-punch'] },
    { slug: 'jolteon', moves: ['thunderbolt', 'thunder', 'shadow-ball', 'signal-beam'] },
];

function defaultTeam() {
    const result = validateTeam(DEFAULT_TEAM_DEF);
    if (!result.ok) throw new Error(`Time padrão inválido: ${result.error}`);
    return result.specs;
}

module.exports = {
    TEAM_SIZE,
    MAX_MOVES,
    prettyName,
    buildSpec,
    validateTeam,
    autoMoves,
    randomTeam,
    defaultTeam,
    raw,
};
