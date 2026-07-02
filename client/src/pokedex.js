// Acesso à pokédex servida pelo backend (/pokedex) + helpers de UI.
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

let cache = null;
let inflight = null;

export function fetchPokedex() {
    if (cache) return Promise.resolve(cache);
    if (!inflight) {
        inflight = fetch(`${SERVER_URL}/pokedex`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                cache = data;
                return data;
            })
            .catch((err) => {
                inflight = null;
                throw err;
            });
    }
    return inflight;
}

// "mr-mime" -> "Mr Mime"
export function prettyName(slug) {
    return slug
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

// Sprites animados só existem até a gen 5 (#649); depois, PNG estático.
const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function spriteFront(id) {
    return id <= 649
        ? `${SPRITES}/versions/generation-v/black-white/animated/${id}.gif`
        : `${SPRITES}/${id}.png`;
}

// depois da gen 5 não tem sprite de costas: usa o da frente espelhado no css
export function spriteBack(id) {
    return id <= 649
        ? `${SPRITES}/versions/generation-v/black-white/animated/back/${id}.gif`
        : `${SPRITES}/${id}.png`;
}

export function needsMirror(id) {
    return id > 649;
}

export function spriteIcon(id) {
    return `${SPRITES}/${id}.png`;
}

function moveScore(poke, moves, slug) {
    const move = moves[slug];
    const stab = poke.types.includes(move.type) ? 1.5 : 1;
    return move.power * (move.accuracy / 100) * stab;
}

// mesma heurística do servidor: melhores golpes priorizando cobertura
export function autoMoves(poke, moves) {
    const ranked = [...poke.moves].sort((a, b) => moveScore(poke, moves, b) - moveScore(poke, moves, a));
    const picked = [];
    const usedTypes = new Set();
    for (const slug of ranked) {
        if (picked.length >= 4) break;
        if (!usedTypes.has(moves[slug].type)) {
            picked.push(slug);
            usedTypes.add(moves[slug].type);
        }
    }
    for (const slug of ranked) {
        if (picked.length >= 4) break;
        if (!picked.includes(slug)) picked.push(slug);
    }
    return picked;
}

export function baseStatTotal(poke) {
    return Object.values(poke.baseStats).reduce((a, b) => a + b, 0);
}

export function randomTeam(dex) {
    const pool = dex.pokemon.filter((p) => baseStatTotal(p) >= 450);
    const picked = new Map();
    while (picked.size < 6) {
        const poke = pool[Math.floor(Math.random() * pool.length)];
        if (!picked.has(poke.slug)) {
            picked.set(poke.slug, { slug: poke.slug, moves: autoMoves(poke, dex.moves) });
        }
    }
    return [...picked.values()];
}

export const TYPE_LABELS_PT = {
    normal: 'Normal', fighting: 'Lutador', flying: 'Voador', poison: 'Veneno',
    ground: 'Terra', rock: 'Pedra', bug: 'Inseto', ghost: 'Fantasma',
    steel: 'Aço', fire: 'Fogo', water: 'Água', grass: 'Planta',
    electric: 'Elétrico', psychic: 'Psíquico', ice: 'Gelo', dragon: 'Dragão',
    dark: 'Sombrio', fairy: 'Fada',
};
