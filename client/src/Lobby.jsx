import React, { useEffect, useState } from 'react';
import { fetchPokedex, prettyName, spriteIcon } from './pokedex';

export default function Lobby({ onPlay, onEditTeam, team, error }) {
    const [name, setName] = useState(localStorage.getItem('wooper-name') || '');
    const [code, setCode] = useState('');
    const [dex, setDex] = useState(null);

    // Só para desenhar os ícones do time salvo
    useEffect(() => {
        if (team) fetchPokedex().then(setDex).catch(() => {});
    }, [team]);

    const start = (mode, payload = {}) => {
        localStorage.setItem('wooper-name', name);
        onPlay(mode, { name, ...payload });
    };

    const updateName = (value) => {
        setName(value);
        localStorage.setItem('wooper-name', value);
    };

    const idOf = (slug) => dex?.pokemon.find((p) => p.slug === slug)?.pokedexId;

    return (
        <div className="screen">
            <div className="frame menu">
                <img className="mascot" alt="Wooper"
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/194.gif" />
                <h1 className="title">WOOPER</h1>
                <p className="tagline">- batalhas pokémon 1v1 -</p>

                <input
                    className="input"
                    placeholder="Seu nome (opcional)"
                    maxLength={20}
                    value={name}
                    onChange={(e) => updateName(e.target.value)}
                />

                {/* Time atual */}
                <button className="team-strip" onClick={onEditTeam}
                    title={team ? team.map((s) => prettyName(s.slug)).join(', ') : 'Montar time'}>
                    {team ? (
                        team.map((slot) => (
                            <img key={slot.slug} alt={prettyName(slot.slug)}
                                src={idOf(slot.slug) ? spriteIcon(idOf(slot.slug)) : ''} />
                        ))
                    ) : (
                        <span className="team-strip-label">Time padrão</span>
                    )}
                    <span className="team-strip-edit">Montar time ▸</span>
                </button>

                <nav className="menu-list">
                    <button className="menu-item" onClick={() => start('play-bot')}>
                        Jogar contra o Bot
                    </button>
                    <button className="menu-item" onClick={() => start('queue')}>
                        Partida rápida
                    </button>
                    <button className="menu-item" onClick={() => start('create-room')}>
                        Criar sala
                    </button>
                    <div className="join-row">
                        <input
                            className="input code-input"
                            placeholder="CÓDIGO"
                            maxLength={4}
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                        />
                        <button className="menu-item" disabled={code.length !== 4}
                            onClick={() => start('join-room', { code })}>
                            Entrar na sala
                        </button>
                    </div>
                </nav>

                {error && <p className="error">{error}</p>}

                <p className="disclaimer">
                    Projeto de fã, sem afiliação com Nintendo/Game Freak/The Pokémon Company.
                    Dados e sprites via <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokéAPI</a>.
                </p>
            </div>
        </div>
    );
}
