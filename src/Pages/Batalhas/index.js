// React
import React, { useEffect, useState, initialState } from "react";

// Material UI
import { LinearProgress, Typography, Button, CircularProgress } from "@mui/material";

import socketClient  from "socket.io-client"

// CSS
import './batalhas.css'

// Socket.IO
var socket = socketClient ();

//// IMPORTANTE ////

// Praticamente tudo que tá aqui é inútil por enquanto
// Não vale nem a pena olhar
// Funções, CSS, etc.
// Eu vou refazer tudo quando integrar o socket e uma api decente
// Só fiz isso pq não tinha mais nada pra fazer durante a aula

const Batalha = () => {
    // Seta os states - só vou começar a usar isso quando integrar o socket.io
    const [pokemon, setpokemon] = useState(initialState)
    const [user, setUser] = useState(initialState)

    useEffect(() => {
        document.title = 'Batalha | Sussy'
        importaPokemon()
    })

    socket.on('connection', (username) => {
        setUser(username)
    })

    const importaPokemon = async () => {
        // Variáveis
        var pokemon = [];

        // Básicos
        let url = "https://pokeapi.co/api/v2/pokemon/1";
        var resposta = await fetch(url);
        pokemon[0] = await resposta.json();

        // Stats
        pokemon[0].currentHP = pokemon[0].stats[0].base_stat

        await defineMoves(pokemon[0])
        setpokemon(pokemon);
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

    // const checaTurnos = () => {
    //     console.log('safe');
    // }

    // const turno = (ataque1, ataque2) => {
    //     console.log(ataque1 + ataque2);
    // }

    return (
        (pokemon) ?
            <div id='batalhaMaster'>
                <div>
                    {(user) ? user : "AAAA"}
                </div>
                <div id='telaBatalha'>
                    <div id='self'>
                        <Typography>{(pokemon) ? pokemon[0].species.name : ""}</Typography>
                        <Typography>{(pokemon) ? pokemon[0].currentHP + "/" + pokemon[0].stats[0].base_stat : ""}</Typography>
                        <LinearProgress variant='determinate' value={(pokemon) ? pokemon[0].currentHP / pokemon[0].stats[0].base_stat * 100 : ""}></LinearProgress>
                        <div><img loading='lazy' alt={(pokemon) ? pokemon[0].species.name : ""} src={(pokemon) ? "./Assets/Images/pokemons/" + pokemon[0].id.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) + pokemon[0].species.name + ".png" : ""}></img></div>
                    </div>
                    <div id='enemy'>

                    </div>
                </div>
                <div id='ataquesBTL'>
                    <Button className={((pokemon) ? pokemon[0].movesSelect[0].type.name : "") + ' ATK'} variant="text">{(pokemon) ? pokemon[0].movesSelect[0].name : ""}</Button>
                    <Button className={((pokemon) ? pokemon[0].movesSelect[4].type.name : "") + ' ATK'} variant="text">{(pokemon) ? pokemon[0].movesSelect[4].name : ""}</Button>
                    <Button className={((pokemon) ? pokemon[0].movesSelect[17].type.name : "") + ' ATK'} variant="text">{(pokemon) ? pokemon[0].movesSelect[17].name : ""}</Button>
                    <Button className={((pokemon) ? pokemon[0].movesSelect[20].type.name : "") + ' ATK'} variant="text">{(pokemon) ? pokemon[0].movesSelect[20].name : ""}</Button>
                </div>
                <div id='opcoesBTL'>
                    <Button variant="text">Desistir</Button>
                    <Button variant="text">Lorem</Button>
                </div>
            </div>

            : <CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='100px' color='inherit' />
    );
}

export default Batalha