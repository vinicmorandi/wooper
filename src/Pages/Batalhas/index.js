// React
import React, { useEffect, useState } from "react";

// Material UI
import { LinearProgress, Typography, CircularProgress } from "@mui/material";

// CSS
import './batalhas.css'

const Batalha = () => {
    const [pokemon, setPokemon] = useState('')
    const [move1, setMove1] = useState('')
    const [poke1, setPoke1] = useState('')
    // const [bloqueado, setBloqueado] = useState('')
    var usuario = JSON.parse(localStorage.getItem('usuario'))

    useEffect(() => {
        document.title = 'Batalha | Wooper'
        if (pokemon === "") importaPokemon()
        if (move1) {
            turno(move1, poke1);
        }
    })

    const importaPokemon = async () => {
        if (usuario.times) {
            var timeUsu = JSON.parse(usuario.times.replaceAll("'", "\""))
            for (let i = 0; i < timeUsu.length; i++) {
                timeUsu[i].currentHP = timeUsu[i].stats[0].base_stat
            }
            setPokemon(timeUsu)
            console.log(timeUsu)
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

    const trocarPokemon = async () => {
        if (pokemon[0].currentHP === 0) {
            let url = "https://pokeapi.co/api/v2/pokemon/2";
            var resposta = await fetch(url);
            var pokemonA = []
            pokemonA[0] = await resposta.json();

            // Stats
            pokemonA[0].currentHP = pokemonA[0].stats[0].base_stat

            await defineMoves(pokemonA[0])
            setPoke1(pokemonA[0]);
            setPokemon(pokemonA);
        }
    }

    const turno = (ataque1, poke1) => {
        poke1.currentHP -= 20
        if (poke1.currentHP <= 0) {
            // setBloqueado(true);
            poke1.currentHP = 0;
            alert('O seu pokemon foi derrotado! Selecione outro!')
        }
        setMove1('')
    }

    return (
        (pokemon) ?
            <>
                <div id='telaBatalha'>
                    <div id='enemyBTL'>
                        <Typography>{(pokemon) ? pokemon[0].name : ""}</Typography>
                        <Typography>{(pokemon) ? pokemon[0].currentHP + "/" + pokemon[0].stats[0].base_stat : ""}</Typography>
                        <LinearProgress variant='determinate' value={(pokemon) ? pokemon[0].currentHP / pokemon[0].stats[0].base_stat * 100 : ""}></LinearProgress>
                        <div><img loading='lazy' alt={(pokemon) ? pokemon[0].name : ""} src={(pokemon) ? "./Assets/Images/pokemons/" + pokemon[0].id.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) + pokemon[0].name + ".png" : ""}></img></div>
                    </div>
                    <div>a</div>
                    <div id='pokeEnemyBTL'>
                        <div>b</div>
                    </div>
                    <div>a</div>
                    <div>b</div>
                    <div>c</div>
                    <div id='selfBTL'>
                        <Typography>{(pokemon) ? pokemon[0].name : ""}</Typography>
                        <Typography>{(pokemon) ? pokemon[0].currentHP + "/" + pokemon[0].stats[0].base_stat : ""}</Typography>
                        <LinearProgress variant='determinate' value={(pokemon) ? pokemon[0].currentHP / pokemon[0].stats[0].base_stat * 100 : ""}></LinearProgress>
                    </div>
                    <div>a</div>
                    <div id='ataquesBTL'>
                        {/* <div disabled={bloqueado} onClick={() => { setMove1(pokemon[0].[0].id) }} className={((pokemon) ? pokemon[0].movesSelect[0].type.name : "") + ' ATK'}><div className={((pokemon) ? pokemon[0].movesSelect[20].type.name : "")}></div>{(pokemon) ? pokemon[0].movesSelect[0].name.replaceAll("-", " ") : ""}</div>
                        <div disabled={bloqueado} onClick={() => { setMove1(pokemon[0].[4].id) }} className={((pokemon) ? pokemon[0].movesSelect[4].type.name : "") + ' ATK'}><div className={((pokemon) ? pokemon[0].movesSelect[20].type.name : "")}></div>{(pokemon) ? pokemon[0].movesSelect[4].name.replaceAll("-", " ") : ""}</div>
                        <div disabled={bloqueado} onClick={() => { setMove1(pokemon[0].[17].id) }} className={((pokemon) ? pokemon[0].movesSelect[17].type.name : "") + ' ATK'}><div className={((pokemon) ? pokemon[0].movesSelect[20].type.name : "")}></div>{(pokemon) ? pokemon[0].movesSelect[17].name.replaceAll("-", " ") : ""}</div>
                        <div disabled={bloqueado} onClick={() => { setMove1(pokemon[0].[20].id) }} className={((pokemon) ? pokemon[0].movesSelect[20].type.name : "") + ' ATK'}><div className={((pokemon) ? pokemon[0].movesSelect[20].type.name : "")}></div>{(pokemon) ? pokemon[0].movesSelect[20].name.replaceAll("-", " ") : ""}</div> */}
                        <div onClick={trocarPokemon()} className='trocar ATK'>Trocar de Pokémon</div>
                    </div>
                </div>
            </>
            : <CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='100px' color='inherit' />
    );
}

export default Batalha