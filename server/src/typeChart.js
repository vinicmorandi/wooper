// Tabela de efetividade de tipos (Gen 6+).
// Linha = tipo do ataque, coluna = tipo do defensor.
const TYPES = [
    'normal', 'fighting', 'flying', 'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
    'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy',
];

const TYPE_CHART = [
    //           nor  fig  fly  poi  gro  roc  bug  gho  ste  fir  wat  gra  ele  psy  ice  dra  dar  fai
    /* normal */ [1,   1,   1,   1,   1,   0.5, 1,   0,   0.5, 1,   1,   1,   1,   1,   1,   1,   1,   1],
    /* fight  */ [2,   1,   0.5, 0.5, 1,   2,   0.5, 0,   2,   1,   1,   1,   1,   0.5, 2,   1,   2,   0.5],
    /* flying */ [1,   2,   1,   1,   1,   0.5, 2,   1,   0.5, 1,   1,   2,   0.5, 1,   1,   1,   1,   1],
    /* poison */ [1,   1,   1,   0.5, 0.5, 0.5, 1,   0.5, 0,   1,   1,   2,   1,   1,   1,   1,   1,   2],
    /* ground */ [1,   1,   0,   2,   1,   2,   0.5, 1,   2,   2,   1,   0.5, 2,   1,   1,   1,   1,   1],
    /* rock   */ [1,   0.5, 2,   1,   0.5, 1,   2,   1,   0.5, 2,   1,   1,   1,   1,   2,   1,   1,   1],
    /* bug    */ [1,   0.5, 0.5, 0.5, 1,   1,   1,   0.5, 0.5, 0.5, 1,   2,   1,   2,   1,   1,   2,   0.5],
    /* ghost  */ [0,   1,   1,   1,   1,   1,   1,   2,   1,   1,   1,   1,   1,   2,   1,   1,   0.5, 1],
    /* steel  */ [1,   1,   1,   1,   1,   2,   1,   1,   0.5, 0.5, 0.5, 1,   0.5, 1,   2,   1,   1,   2],
    /* fire   */ [1,   1,   1,   1,   1,   0.5, 2,   1,   2,   0.5, 0.5, 2,   1,   1,   2,   0.5, 1,   1],
    /* water  */ [1,   1,   1,   1,   2,   2,   1,   1,   1,   2,   0.5, 0.5, 1,   1,   1,   0.5, 1,   1],
    /* grass  */ [1,   1,   0.5, 0.5, 2,   2,   0.5, 1,   0.5, 0.5, 2,   0.5, 1,   1,   1,   0.5, 1,   1],
    /* electr */ [1,   1,   2,   1,   0,   1,   1,   1,   1,   1,   2,   0.5, 0.5, 1,   1,   0.5, 1,   1],
    /* psychi */ [1,   2,   1,   2,   1,   1,   1,   1,   0.5, 1,   1,   1,   1,   0.5, 1,   1,   0,   1],
    /* ice    */ [1,   1,   2,   1,   2,   1,   1,   1,   0.5, 0.5, 0.5, 2,   1,   1,   0.5, 2,   1,   1],
    /* dragon */ [1,   1,   1,   1,   1,   1,   1,   1,   0.5, 1,   1,   1,   1,   1,   1,   2,   1,   0],
    /* dark   */ [1,   0.5, 1,   1,   1,   1,   1,   2,   1,   1,   1,   1,   1,   2,   1,   1,   0.5, 0.5],
    /* fairy  */ [1,   2,   1,   0.5, 1,   1,   1,   1,   0.5, 0.5, 1,   1,   1,   1,   1,   2,   2,   1],
];

// Multiplicador do ataque `moveType` contra um defensor com 1 ou 2 tipos.
function effectiveness(moveType, defenderTypes) {
    const row = TYPE_CHART[TYPES.indexOf(moveType)];
    return defenderTypes.reduce((mult, t) => mult * row[TYPES.indexOf(t)], 1);
}

module.exports = { TYPES, TYPE_CHART, effectiveness };
