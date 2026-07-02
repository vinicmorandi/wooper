import React, { useEffect, useMemo, useState } from 'react';
import {
    fetchPokedex, prettyName, spriteIcon, autoMoves, randomTeam,
    baseStatTotal, TYPE_LABELS_PT,
} from './pokedex';

const PAGE = 48;

function TypeChips({ types }) {
    return (
        <span className="type-chips">
            {types.map((t) => (
                <span key={t} className={`chip type-${t}`}>{TYPE_LABELS_PT[t] || t}</span>
            ))}
        </span>
    );
}

// Modal de escolha de golpes de um pokémon (até 4).
function MovePicker({ dex, poke, initial, onConfirm, onCancel }) {
    const [picked, setPicked] = useState(initial || []);
    const [query, setQuery] = useState('');

    const options = useMemo(() => {
        const q = query.trim().toLowerCase();
        return poke.moves
            .filter((slug) => slug.includes(q))
            .sort((a, b) => dex.moves[b].power - dex.moves[a].power);
    }, [dex, poke, query]);

    const toggle = (slug) => {
        setPicked((old) => old.includes(slug)
            ? old.filter((m) => m !== slug)
            : old.length < 4 ? [...old, slug] : old);
    };

    return (
        <div className="overlay">
            <div className="dialog move-picker">
                <div className="picker-head">
                    <img alt={poke.slug} src={spriteIcon(poke.pokedexId)} />
                    <div>
                        <h3>{prettyName(poke.slug)}</h3>
                        <TypeChips types={poke.types} />
                    </div>
                    <span className="picked-count">{picked.length}/4</span>
                </div>

                <input className="input" placeholder="Buscar golpe..."
                    value={query} onChange={(e) => setQuery(e.target.value)} />

                <div className="move-list">
                    {options.map((slug) => {
                        const move = dex.moves[slug];
                        const on = picked.includes(slug);
                        return (
                            <button key={slug}
                                className={`move-row ${on ? 'picked' : ''}`}
                                onClick={() => toggle(slug)}>
                                <span className={`chip type-${move.type}`}>{TYPE_LABELS_PT[move.type]}</span>
                                <span className="move-row-name">{prettyName(slug)}</span>
                                <span className="move-row-meta">
                                    {move.power} POW · {move.accuracy}% · {move.category === 'physical' ? 'FÍS' : 'ESP'}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="dialog-actions">
                    <button className="btn" onClick={() => setPicked(autoMoves(poke, dex.moves))}>
                        Auto
                    </button>
                    <button className="btn" onClick={onCancel}>Cancelar</button>
                    <button className="btn primary" disabled={picked.length === 0}
                        onClick={() => onConfirm(picked)}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TeamBuilder({ team, onSave, onBack }) {
    const [dex, setDex] = useState(null);
    const [loadError, setLoadError] = useState(false);
    const [slots, setSlots] = useState(team || []);
    const [query, setQuery] = useState('');
    const [limit, setLimit] = useState(PAGE);
    const [editing, setEditing] = useState(null); // { poke, initial }

    useEffect(() => {
        fetchPokedex().then(setDex).catch(() => setLoadError(true));
    }, []);

    const results = useMemo(() => {
        if (!dex) return [];
        const q = query.trim().toLowerCase();
        if (!q) return dex.pokemon;
        return dex.pokemon.filter((p) => p.slug.includes(q) || String(p.pokedexId) === q);
    }, [dex, query]);

    if (loadError) {
        return (
            <div className="screen">
                <div className="frame builder">
                    <p>Não consegui carregar a Pokédex do servidor.</p>
                    <p className="hint">Sem time montado você joga com o time padrão.</p>
                    <button className="btn" onClick={onBack}>Voltar</button>
                </div>
            </div>
        );
    }

    if (!dex) {
        return (
            <div className="screen">
                <div className="frame builder">
                    <p className="loading-text">Carregando Pokédex<span className="dots" /></p>
                </div>
            </div>
        );
    }

    const bySlug = (slug) => dex.pokemon.find((p) => p.slug === slug);

    const addOrEdit = (poke) => {
        const existing = slots.find((s) => s.slug === poke.slug);
        if (!existing && slots.length >= 6) return;
        setEditing({ poke, initial: existing ? existing.moves : autoMoves(poke, dex.moves) });
    };

    const confirmMoves = (moves) => {
        const { poke } = editing;
        setSlots((old) => {
            const idx = old.findIndex((s) => s.slug === poke.slug);
            if (idx >= 0) {
                const next = [...old];
                next[idx] = { slug: poke.slug, moves };
                return next;
            }
            return [...old, { slug: poke.slug, moves }];
        });
        setEditing(null);
    };

    const remove = (slug) => setSlots((old) => old.filter((s) => s.slug !== slug));

    return (
        <div className="screen">
            <div className="frame builder">
                <div className="builder-head">
                    <h2>Monte seu time</h2>
                    <span className="picked-count">{slots.length}/6</span>
                </div>

                {/* Slots do time */}
                <div className="team-slots">
                    {Array.from({ length: 6 }, (_, i) => {
                        const slot = slots[i];
                        if (!slot) return <div key={i} className="slot empty">?</div>;
                        const poke = bySlug(slot.slug);
                        return (
                            <div key={slot.slug} className="slot" title={slot.moves.map(prettyName).join(', ')}>
                                <button className="slot-remove" aria-label={`Remover ${prettyName(slot.slug)}`}
                                    onClick={() => remove(slot.slug)}>×</button>
                                <img alt={slot.slug} src={spriteIcon(poke.pokedexId)}
                                    onClick={() => addOrEdit(poke)} />
                                <span>{prettyName(slot.slug)}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="builder-tools">
                    <input className="input" placeholder="Buscar pokémon (nome ou nº)..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setLimit(PAGE); }} />
                    <button className="btn" onClick={() => setSlots(randomTeam(dex))}>Aleatório</button>
                    <button className="btn" onClick={() => setSlots([])}>Limpar</button>
                </div>

                {/* Grade da pokédex */}
                <div className="dex-grid">
                    {results.slice(0, limit).map((poke) => {
                        const inTeam = slots.some((s) => s.slug === poke.slug);
                        return (
                            <button key={poke.slug}
                                className={`dex-card ${inTeam ? 'in-team' : ''}`}
                                disabled={!inTeam && slots.length >= 6}
                                onClick={() => addOrEdit(poke)}>
                                <img loading="lazy" alt={poke.slug} src={spriteIcon(poke.pokedexId)} />
                                <span className="dex-num">Nº{poke.pokedexId}</span>
                                <span className="dex-name">{prettyName(poke.slug)}</span>
                                <TypeChips types={poke.types} />
                                <span className="dex-bst">BST {baseStatTotal(poke)}</span>
                            </button>
                        );
                    })}
                </div>
                {results.length > limit && (
                    <button className="btn wide" onClick={() => setLimit((l) => l + PAGE)}>
                        Mostrar mais ({limit} de {results.length})
                    </button>
                )}
                {results.length === 0 && <p className="hint">Nenhum pokémon encontrado.</p>}

                <div className="builder-actions">
                    <button className="btn" onClick={onBack}>Voltar</button>
                    <button className="btn primary" disabled={slots.length !== 6}
                        onClick={() => onSave(slots)}>
                        Salvar time
                    </button>
                </div>
            </div>

            {editing && (
                <MovePicker
                    dex={dex}
                    poke={editing.poke}
                    initial={editing.initial}
                    onConfirm={confirmMoves}
                    onCancel={() => setEditing(null)}
                />
            )}
        </div>
    );
}
