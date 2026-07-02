// Bot da v1: escolhe o golpe de maior dano esperado
// (poder x precisão x efetividade x STAB). Em troca forçada, manda o
// Pokémon cujo melhor golpe rende mais contra o adversário atual.
const { effectiveness } = require('./typeChart');
const { activePokemon, aliveIndexes } = require('./engine');

function expectedDamage(attacker, move, defender) {
    const stab = attacker.types.includes(move.type) ? 1.5 : 1;
    const mult = effectiveness(move.type, defender.types);
    return move.power * (move.accuracy / 100) * stab * mult;
}

function bestMoveIndex(attacker, defender) {
    let best = 0;
    let bestScore = -1;
    attacker.moves.forEach((move, i) => {
        const score = expectedDamage(attacker, move, defender);
        if (score > bestScore) {
            bestScore = score;
            best = i;
        }
    });
    return best;
}

function chooseAction(state, playerIdx) {
    const enemy = activePokemon(state, 1 - playerIdx);

    if (state.phase === 'switch') {
        const options = aliveIndexes(state, playerIdx)
            .filter((i) => i !== state.players[playerIdx].active);
        let best = options[0];
        let bestScore = -1;
        for (const i of options) {
            const poke = state.players[playerIdx].team[i];
            const score = expectedDamage(poke, poke.moves[bestMoveIndex(poke, enemy)], enemy);
            if (score > bestScore) {
                bestScore = score;
                best = i;
            }
        }
        return { type: 'switch', index: best };
    }

    const self = activePokemon(state, playerIdx);
    return { type: 'move', index: bestMoveIndex(self, enemy) };
}

module.exports = { chooseAction, expectedDamage, bestMoveIndex };
