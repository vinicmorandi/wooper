// Gera server/data/pokedex.json a partir da PokéAPI.
// Rodar uma vez (ou quando quiser atualizar): node scripts/fetch-pokedex.js
// Em runtime o jogo só usa o arquivo gerado, sem bater na API.
const https = require('https');
const fs = require('fs');
const path = require('path');

const VALID_TYPES = [
    'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
    'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy',
];
const MAX_POKEDEX_ID = 10000; // acima disso são formas alternativas

function getJson(url, attempt = 1) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'wooper-dataset' } }, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                if (attempt < 8) return setTimeout(() => resolve(getJson(url, attempt + 1)), 2000 * attempt);
                return reject(new Error(`HTTP ${res.statusCode} em ${url}`));
            }
            let body = '';
            res.on('data', (c) => { body += c; });
            res.on('end', () => resolve(JSON.parse(body)));
        }).on('error', (err) => {
            if (attempt < 8) return setTimeout(() => resolve(getJson(url, attempt + 1)), 2000 * attempt);
            reject(err);
        });
    });
}

// Executa `tasks` (funções que retornam Promise) com no máximo `limit` em paralelo.
async function pool(tasks, limit) {
    const results = new Array(tasks.length);
    let next = 0;
    async function worker() {
        while (next < tasks.length) {
            const i = next++;
            results[i] = await tasks[i]();
            if (i > 0 && i % 100 === 0) console.log(`  ${i}/${tasks.length}`);
        }
    }
    await Promise.all(Array.from({ length: limit }, worker));
    return results;
}

async function main() {
    console.log('Listando golpes...');
    const moveList = await getJson('https://pokeapi.co/api/v2/move?limit=100000');
    console.log(`${moveList.results.length} golpes no total; baixando detalhes...`);
    const moveDetails = await pool(moveList.results.map((m) => () => getJson(m.url)), 25);

    // Só golpes de dano direto com tipo padrão (sem status, sem dano fixo/OHKO)
    const moves = {};
    for (const move of moveDetails) {
        const isDamaging = move.power && move.power > 0
            && (move.damage_class.name === 'physical' || move.damage_class.name === 'special')
            && VALID_TYPES.includes(move.type.name);
        if (!isDamaging) continue;
        moves[move.name] = {
            type: move.type.name,
            category: move.damage_class.name,
            power: move.power,
            accuracy: move.accuracy ? move.accuracy : 100, // null/0 = nunca erra
        };
    }
    console.log(`${Object.keys(moves).length} golpes de dano mantidos.`);

    console.log('Listando pokémon...');
    const pokeList = await getJson('https://pokeapi.co/api/v2/pokemon?limit=100000');
    const entries = pokeList.results.filter((p) => {
        const id = Number(p.url.split('/').filter(Boolean).pop());
        return id < MAX_POKEDEX_ID;
    });
    console.log(`${entries.length} pokémon (sem formas alternativas); baixando detalhes...`);
    // Entrada indisponível (a PokéAPI às vezes devolve 502 persistente) -> pula com aviso.
    const pokeDetails = await pool(entries.map((p) => () => getJson(p.url).catch((err) => {
        console.warn(`AVISO: pulando ${p.name}: ${err.message}`);
        return null;
    })), 25);

    const pokemon = [];
    for (const poke of pokeDetails.filter(Boolean)) {
        const learnable = [...new Set(poke.moves.map((m) => m.move.name))]
            .filter((slug) => moves[slug])
            .sort();
        if (learnable.length === 0) continue; // ex.: Ditto - não tem golpe de dano
        const stats = {};
        for (const s of poke.stats) stats[s.stat.name] = s.base_stat;
        pokemon.push({
            slug: poke.name,
            pokedexId: poke.id,
            types: poke.types.map((t) => t.type.name),
            baseStats: {
                hp: stats.hp,
                atk: stats.attack,
                def: stats.defense,
                spa: stats['special-attack'],
                spd: stats['special-defense'],
                spe: stats.speed,
            },
            moves: learnable,
        });
    }
    pokemon.sort((a, b) => a.pokedexId - b.pokedexId);

    const out = { generatedAt: new Date().toISOString(), moves, pokemon };
    const dest = path.join(__dirname, '..', 'data', 'pokedex.json');
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, JSON.stringify(out));
    const mb = (fs.statSync(dest).size / 1024 / 1024).toFixed(1);
    console.log(`OK: ${pokemon.length} pokémon, ${Object.keys(moves).length} golpes -> ${dest} (${mb} MB)`);
}

main().catch((err) => {
    console.error('Falhou:', err.message);
    process.exit(1);
});
