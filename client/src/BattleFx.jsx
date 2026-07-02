import React from 'react';

// Efeitos visuais dos golpes, agrupados por família de tipo.
// As cores vêm das classes .type-X do css.
export const KIND_BY_TYPE = {
    fire: 'flame',
    water: 'splash',
    electric: 'bolt',
    grass: 'leaf',
    bug: 'leaf',
    ice: 'shard',
    steel: 'shard',
    rock: 'chunk',
    ground: 'chunk',
    flying: 'gust',
    normal: 'hit',
    fighting: 'star',
    poison: 'bubble',
    psychic: 'ring',
    ghost: 'ring',
    dark: 'ring',
    dragon: 'ring',
    fairy: 'sparkle',
};

export function fxKind(type) {
    return KIND_BY_TYPE[type] || 'hit';
}

const MELEE_BY_TYPE = {
    normal: 'claw', flying: 'claw', dragon: 'claw', bug: 'claw',
    fighting: 'pow', rock: 'pow', ground: 'pow', steel: 'pow',
    dark: 'bite', ghost: 'bite', poison: 'bite',
    fire: 'wave', water: 'wave', grass: 'wave', electric: 'wave',
    ice: 'wave', psychic: 'wave', fairy: 'wave',
};

export function meleeKind(type) {
    return MELEE_BY_TYPE[type] || 'claw';
}

// efeito do golpe físico, desenhado sobre o alvo
export function MeleeFx({ type }) {
    const kind = meleeKind(type);
    const cls = `type-${type}`;
    switch (kind) {
        case 'pow': // estrela de impacto estalando + satélites
            return (
                <>
                    <span className={`mfx pow-big ${cls}`} />
                    <span className={`mfx pow-small pow-a ${cls}`} />
                    <span className={`mfx pow-small pow-b ${cls}`} />
                </>
            );
        case 'bite': // presas se fechando sobre o alvo
            return (
                <>
                    <span className={`mfx teeth teeth-top ${cls}`} />
                    <span className={`mfx teeth teeth-bottom ${cls}`} />
                </>
            );
        case 'wave': // meia-lua de energia elemental cortando
            return <span className={`mfx wave ${cls}`} />;
        default: // garra: três riscos varrendo na diagonal
            return (
                <>
                    <span className={`mfx claw claw-a ${cls}`} />
                    <span className={`mfx claw claw-b ${cls}`} />
                    <span className={`mfx claw claw-c ${cls}`} />
                </>
            );
    }
}

// posições determinísticas pra não mudarem a cada render
const spread = (n, fn) => Array.from({ length: n }, (_, i) => fn(i, n));

function particleStyle({ dx = 0, dy = 0, delay = 0, size = null, dur = null }) {
    return {
        '--dx': `${dx}px`,
        '--dy': `${dy}px`,
        animationDelay: `${delay}ms`,
        ...(size ? { width: size, height: size } : {}),
        ...(dur ? { animationDuration: `${dur}ms` } : {}),
    };
}

export default function ImpactFx({ type }) {
    const kind = fxKind(type);
    const cls = `fxp type-${type}`;

    switch (kind) {
        case 'flame': // labaredas subindo, tremeluzindo
            return spread(7, (i, n) => (
                <span key={i} className={`${cls} p-flame`} style={particleStyle({
                    dx: (i - (n - 1) / 2) * 11,
                    dy: -48 - (i % 3) * 14,
                    delay: i * 40,
                    size: 10 + (i % 3) * 4,
                })} />
            ));
        case 'splash': // gotas espirrando pros lados e caindo
            return spread(9, (i, n) => (
                <span key={i} className={`${cls} p-drop`} style={particleStyle({
                    dx: (i - (n - 1) / 2) * 13,
                    dy: (i % 2 ? 34 : -18) + (i % 3) * 8,
                    delay: i * 22,
                    size: 8 + (i % 2) * 3,
                })} />
            ));
        case 'bolt': // um raio em zigue-zague + faíscas
            return (
                <>
                    <span className={`${cls} p-bolt`} />
                    {spread(5, (i, n) => (
                        <span key={i} className={`${cls} p-spark`} style={particleStyle({
                            dx: (i - (n - 1) / 2) * 22,
                            dy: (i % 2 ? -1 : 1) * (14 + i * 4),
                            delay: 120 + i * 30,
                            size: 7,
                        })} />
                    ))}
                </>
            );
        case 'leaf': // folhas girando para fora
            return spread(8, (i, n) => (
                <span key={i} className={`${cls} p-leaf`} style={particleStyle({
                    dx: Math.round(46 * Math.cos((i / n) * 2 * Math.PI)),
                    dy: Math.round(34 * Math.sin((i / n) * 2 * Math.PI)) - 8,
                    delay: i * 28,
                    size: 12,
                })} />
            ));
        case 'shard': // estilhaços em losango voando
            return spread(8, (i, n) => (
                <span key={i} className={`${cls} p-shard`} style={particleStyle({
                    dx: Math.round(50 * Math.cos((i / n) * 2 * Math.PI)),
                    dy: Math.round(36 * Math.sin((i / n) * 2 * Math.PI)),
                    delay: i * 14,
                    size: 10 + (i % 2) * 4,
                })} />
            ));
        case 'chunk': // pedras/torrões caindo
            return spread(6, (i, n) => (
                <span key={i} className={`${cls} p-chunk`} style={particleStyle({
                    dx: (i - (n - 1) / 2) * 18,
                    dy: 34 + (i % 3) * 12,
                    delay: i * 36,
                    size: 11 + (i % 3) * 3,
                })} />
            ));
        case 'gust': // rajadas de vento em arco
            return spread(3, (i) => (
                <span key={i} className={`${cls} p-gust`} style={particleStyle({
                    delay: i * 90,
                    size: 60 + i * 26,
                })} />
            ));
        case 'star': // estrelas de impacto estalando em sequência (soco/chute)
            return spread(3, (i) => (
                <span key={i} className={`${cls} p-star`} style={{
                    ...particleStyle({ delay: i * 110, size: 26 + (i % 2) * 8 }),
                    marginLeft: (i - 1) * 26,
                    marginTop: (i % 2 ? 14 : -10),
                }} />
            ));
        case 'bubble': // bolhas de veneno subindo devagar
            return spread(8, (i, n) => (
                <span key={i} className={`${cls} p-bubble`} style={particleStyle({
                    dx: (i - (n - 1) / 2) * 12,
                    dy: -36 - (i % 4) * 10,
                    delay: i * 55,
                    size: 8 + (i % 3) * 4,
                    dur: 750,
                })} />
            ));
        case 'ring': // anéis concêntricos pulsando (psíquico/fantasma/dragão)
            return spread(3, (i) => (
                <span key={i} className={`${cls} p-ringwave`} style={particleStyle({
                    delay: i * 100,
                    size: 60 + i * 34,
                })} />
            ));
        case 'sparkle': // brilhos cintilando ao redor
            return spread(9, (i, n) => (
                <span key={i} className={`${cls} p-sparkle`} style={particleStyle({
                    dx: Math.round(44 * Math.cos((i / n) * 2 * Math.PI + 0.5)),
                    dy: Math.round(34 * Math.sin((i / n) * 2 * Math.PI + 0.5)),
                    delay: i * 45,
                    size: 9 + (i % 2) * 4,
                })} />
            ));
        default: // pancada genérica: riscos brancos radiais
            return spread(6, (i, n) => (
                <span key={i} className={`${cls} p-hit`} style={particleStyle({
                    dx: Math.round(42 * Math.cos((i / n) * 2 * Math.PI)),
                    dy: Math.round(30 * Math.sin((i / n) * 2 * Math.PI)),
                    delay: i * 18,
                    size: 10,
                })} />
            ));
    }
}
