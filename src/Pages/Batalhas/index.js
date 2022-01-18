// React
import React, { useEffect, useState, initialState } from "react";

// Material UI
import { LinearProgress, Typography, Button, CircularProgress } from "@mui/material";

import socketClient from "socket.io-client"

// CSS
import './batalhas.css'

// Socket.IO
var socket = socketClient();

const Batalha = () => {
    const [pokemon, setPokemon] = useState('')
    const [move1, setMove1] = useState('')
    const [move2, setMove2] = useState('')
    const [poke1, setPoke1] = useState('')
    const [poke2, setPoke2] = useState('')
    const [bloqueado, setBloqueado] = useState('')
    const [user, setUser] = useState(initialState)
    var usuario = JSON.parse(localStorage.getItem('usuario'))

    useEffect(() => {
        document.title = 'Batalha | Wooper'
        importaPokemon()
        if (move1 && move2) {
            turno(move1, move2, poke1, poke2);
        }
    })

    socket.on('connection', (username) => {
        setUser(username)
        console.log(usuario)
    })

    const importaPokemon = async () => {

        // Variáveis
        var pokemonA = [];

        // Básicos
        let url = "https://pokeapi.co/api/v2/pokemon/1";
        var resposta = await fetch(url);
        pokemonA[0] = await resposta.json();

        // Stats
        pokemonA[0].currentHP = pokemonA[0].stats[0].base_stat

        if (pokemon === '' || pokemon === undefined) {
            await defineMoves(pokemonA[0])
            setPoke1(pokemonA[0]);
            setPoke2('a')
            setPokemon(pokemonA);
        }
    }

    const defineMoves = async (poke) => {
        var arrayMoves = []
        for (let i = 0; i < poke.moves.length; i++) {
            let urlMove = poke.moves[i].move.url;
            var moveR = await fetch(urlMove);
            var move = await moveR.json();
            arrayMoves[i] = move
        }

        poke.movesSelect = arrayMoves
    }

    const turno = (ataque1, ataque2, poke1, poke2) => {
        poke1.currentHP -= ataque2
        if (poke1.currentHP <= 0) {
            setBloqueado(true);
            poke1.currentHP = 0;
            alert('O seu pokemon foi derrotado! Selecione outro!')
        }
        setMove1('')
        setMove2('')
    }

    return (
        (pokemon) ?
            <>
                <div id='telaBatalha'>
                    <div id='enemyBTL'>
                        <Typography>{(pokemon) ? pokemon[0].species.name : ""}</Typography>
                        <Typography>{(pokemon) ? pokemon[0].currentHP + "/" + pokemon[0].stats[0].base_stat : ""}</Typography>
                        <LinearProgress variant='determinate' value={(pokemon) ? pokemon[0].currentHP / pokemon[0].stats[0].base_stat * 100 : ""}></LinearProgress>
                        <div><img loading='lazy' alt={(pokemon) ? pokemon[0].species.name : ""} src={(pokemon) ? "./Assets/Images/pokemons/" + pokemon[0].id.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) + pokemon[0].species.name + ".png" : ""}></img></div>
                    </div>
                    <div>a</div>
                    <div id='pokeEnemyBTL'>
                        <div>b</div>
                    </div>
                    <div>a</div>
                    <div>b</div>
                    <div>c</div>
                    <div id='selfBTL'>
                        <Typography>{(pokemon) ? pokemon[0].species.name : ""}</Typography>
                        <Typography>{(pokemon) ? pokemon[0].currentHP + "/" + pokemon[0].stats[0].base_stat : ""}</Typography>
                        <LinearProgress variant='determinate' value={(pokemon) ? pokemon[0].currentHP / pokemon[0].stats[0].base_stat * 100 : ""}></LinearProgress>
                    </div>
                    <div>a</div>
                    <div id='ataquesBTL'>
                        <div disabled={bloqueado} onClick={() => { setMove1(pokemon[0].movesSelect[0].id) }} className={((pokemon) ? pokemon[0].movesSelect[0].type.name : "") + ' ATK'}><div className={((pokemon) ? pokemon[0].movesSelect[20].type.name : "")}></div>{(pokemon) ? pokemon[0].movesSelect[0].name.replaceAll("-", " ") : ""}</div>
                        <div disabled={bloqueado} onClick={() => { setMove1(pokemon[0].movesSelect[4].id) }} className={((pokemon) ? pokemon[0].movesSelect[4].type.name : "") + ' ATK'}><div className={((pokemon) ? pokemon[0].movesSelect[20].type.name : "")}></div>{(pokemon) ? pokemon[0].movesSelect[4].name.replaceAll("-", " ") : ""}</div>
                        <div disabled={bloqueado} onClick={() => { setMove1(pokemon[0].movesSelect[17].id) }} className={((pokemon) ? pokemon[0].movesSelect[17].type.name : "") + ' ATK'}><div className={((pokemon) ? pokemon[0].movesSelect[20].type.name : "")}></div>{(pokemon) ? pokemon[0].movesSelect[17].name.replaceAll("-", " ") : ""}</div>
                        <div disabled={bloqueado} onClick={() => { setMove1(pokemon[0].movesSelect[20].id) }} className={((pokemon) ? pokemon[0].movesSelect[20].type.name : "") + ' ATK'}><div className={((pokemon) ? pokemon[0].movesSelect[20].type.name : "")}></div>{(pokemon) ? pokemon[0].movesSelect[20].name.replaceAll("-", " ") : ""}</div>
                    </div>
                </div>
            </>
            : <CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='100px' color='inherit' />
    );
}

export default Batalha