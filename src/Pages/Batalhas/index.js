// React
import React, { useEffect, useState, initialState } from "react";

// CSS
import './batalhas.css'
import Button from '@mui/material/Button'
import { LinearProgress, Typography } from "@mui/material";

const Batalha = () => {
    const [pokemon, setpokemon, currentPokemon, setCurrentPokemon, data, setData] = useState(initialState)

    useEffect(() => {
        document.title = 'Batalha | Sussy'
        carregaDadosSocket()
        importaPokemon()
    })

    const carregaDadosSocket = async () => {
        var result = await fetch("../../api/index.js")
        var res = result.json()
        console.log(res)
    }

    const importaPokemon = async () => {
        // Variáveis
        var pokemon = [];
        var arrayMoves = []

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

    const checaTurnos = () => {
        console.log('safe');
    }

    const turno = (ataque1, ataque2) => {
        console.log(ataque1 + ataque2);
    }

    return (
        <div id='batalhaMaster'>
            <div>
                {(data) ? data : "AAAA"}
            </div>
            <div id='telaBatalha'>
                <div id='self'>
                    <Typography>{(pokemon) ? pokemon[0].species.name : ""}</Typography>
                    <Typography>{(pokemon) ? pokemon[0].currentHP + "/" + pokemon[0].stats[0].base_stat : ""}</Typography>
                    <LinearProgress variant='determinate' value={(pokemon) ? pokemon[0].currentHP / pokemon[0].stats[0].base_stat * 100 : ""}></LinearProgress>
                    <div><img loading='lazy' alt={(pokemon) ? pokemon[0].species.name : ""} src={(pokemon) ? "./Assets/Images/pokemons/" + pokemon[0].id.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) + pokemon[0].species.name + ".png" :""}></img></div>
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
    );
}

export default Batalha