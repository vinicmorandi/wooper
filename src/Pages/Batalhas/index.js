// React
import React, { useEffect, useState } from "react";

// Material UI
import { LinearProgress, Typography, CircularProgress, Button, DialogContent, DialogContentText, DialogActions, List, ListItem, ListItemAvatar, ListItemText, DialogTitle, Dialog } from "@mui/material";

// CSS
import './batalhas.css'

const Batalha = () => {
    const [pokemon, setPokemon] = useState('')
    const [move1, setMove1] = useState('')
    const [poke1, setPoke1] = useState('')
    const [move2, setMove2] = useState('')
    const [poke2, setPoke2] = useState('')
    const [pokemon2, setPokemon2] = useState('')
    const [open, setOpen] = useState(false)
    const [openFinal, setOpenFinal] = useState(false)
    const [bloqueado, setBloqueado] = useState('')
    const [ganhou, setGanhou] = useState('')
    const tabelaFraquezas = [[1, 1, 1, 1, 1, 0.5, 1, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1], [2, 1, 0.5, 0.5, 1, 2, 0.5, 0, 2, 1, 1, 1, 1, 0.5, 2, 1, 2, 1], [1, 2, 1, 1, 1, 0.5, 2, 0, 0.5, 1, 1, 2, 0.5, 1, 1, 1, 1, 1], [1, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 1, 2, 1, 1, 1, 1, 1, 2], [1, 1, 0, 2, 1, 2, 0.5, 0, 2, 2, 1, 0.5, 2, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 0.5, 1, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 0.5, 1, 2, 1, 2, 1, 1, 2, 1], [0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 1], [1, 1, 1, 1, 1, 2, 1, 0, 0.5, 0.5, 0.5, 1, 0.5, 1, 2, 1, 1, 2], [1, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5, 0.5, 2, 1, 1, 2, 0.5, 1, 1], [1, 1, 1, 1, 2, 2, 1, 1, 0.5, 2, 0.5, 0.5, 1, 1, 1, 0.5, 1, 1], [1, 1, 0.5, 0.5, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 1, 0.5, 1, 1], [1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 2, 0.5, 0.5, 1, 1, 0.5, 1, 1], [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 0, 1], [1, 1, 2, 1, 2, 1, 1, 1, 0.5, 0.5, 0.5, 2, 1, 1, 0.5, 2, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 0], [1, 0.5, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5], [1, 2, 1, 0.5, 1, 1, 1, 0, 0.5, 0.5, 1, 1, 1, 1, 1, 2, 2, 1]]
    var usuario = JSON.parse(localStorage.getItem('usuario'))

    useEffect(() => {
        document.title = 'Batalha | Wooper'
        if (pokemon === "") importaPokemon()
        if (move1) {
            turno(move1, poke1);
        }
    })

    const importaPokemon = async () => {
        if (usuario) {
            if (usuario.times) {
                var timeUsu = JSON.parse(usuario.times.replaceAll("'", "\""))
                for (let i = 0; i < timeUsu.length; i++) {
                    timeUsu[i].currentHP = timeUsu[i].stats[0].base_stat

                    var arrayMoves = []
                    for (let c = 0; c < 4; c++) {
                        await fetch("https://pokeapi.co/api/v2/move/" + timeUsu[i].moves[c].move.name, {
                            method: 'GET',
                        }).then((res) => res.json())
                            .then((result) => arrayMoves[c] = result);
                    }
                    timeUsu[i].moves = arrayMoves
                }

                var teste = JSON.parse(usuario.times.replaceAll("'", "\""))
                for (let i = 0; i < teste.length; i++) {
                    teste[i].currentHP = teste[i].stats[0].base_stat

                    var arrayMoves = []
                    for (let c = 0; c < 4; c++) {
                        await fetch("https://pokeapi.co/api/v2/move/" + teste[i].moves[c].move.name, {
                            method: 'GET',
                        }).then((res) => res.json())
                            .then((result) => arrayMoves[c] = result);
                    }
                    teste[i].moves = arrayMoves
                }
                setPokemon(timeUsu)
                setPoke1(timeUsu[0])
                setPoke2(teste[0])
                setPokemon2(teste)
            }
        }
    }


    const trocarPokemon = async (poke) => {
        setPoke1(poke);
        setOpen(false)
    }

    const turno = (ataque1, poke1) => {
        poke2.currentHP -= ataque1.power
        var derrotados = 0;
        var derrotadosIni = 0;
        if (poke1.currentHP <= 0) {
            setBloqueado(true)
            poke1.currentHP = 0;
            for (let i = 0; i < pokemon.length; i++) {
                if (pokemon[i].currentHP === 0) {
                    derrotados++
                }
            }
            if (derrotados < 6) {
                setOpen(true)
            } else {
                setGanhou(false)
                setOpenFinal(true)
            }
        } else if (poke2.currentHP <= 0) {
            poke2.currentHP = 0
            for (let i = 0; i < pokemon2.length; i++) {
                console.log(pokemon2[i].currentHP === 0)
                if (pokemon2[i].currentHP === 0) {
                    derrotadosIni++
                }
            }
            if (derrotadosIni < 6) {
                setTimeout(() => { setPoke2(pokemon2[derrotadosIni]) }, 400)
            } else {
                setGanhou(true)
                setOpenFinal(true)
            }
        }
        setMove1('')
        setMove2('')
    }

    return (
        (poke1) ?
            <>
                <div id='telaBatalha'>
                    <div id='enemyBTL'>
                        <Typography>{(poke2) ? poke2.name : ""}</Typography>
                        <Typography>{(poke2) ? poke2.currentHP + "/" + poke2.stats[0].base_stat : ""}</Typography>
                        <LinearProgress variant='determinate' value={(poke2) ? poke2.currentHP / poke2.stats[0].base_stat * 100 : 0}></LinearProgress>
                        <div><img loading='lazy' id='pokeIni' alt={(poke2) ? poke2.name : ""} src={(poke2) ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/" + poke2.id + ".gif" : ""}></img></div>
                    </div>
                    <div><img id='imgPokeMain' loading='lazy' alt={(pokemon) ? poke1.name : ""} src={(pokemon) ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/" + poke1.id + ".gif" : ""}></img></div>
                    <div id='selfBTL'>
                        <Typography>{(pokemon) ? poke1.name : ""}</Typography>
                        <Typography>{(pokemon) ? poke1.currentHP + "/" + poke1.stats[0].base_stat : ""}</Typography>
                        <LinearProgress variant='determinate' value={(pokemon) ? poke1.currentHP / poke1.stats[0].base_stat * 100 : ""}></LinearProgress>
                    </div>
                    <div id='ataquesBTL'>
                        <div onClick={() => { setMove1(poke1.moves[0]) }} className={((pokemon) ? poke1.moves[0].type.name : "") + ' ATK'}><div className={((pokemon) ? poke1.moves[0].type.name : "")}></div>{(pokemon) ? poke1.moves[0].name.replaceAll("-", " ") : ""}</div>
                        <div onClick={() => { setMove1(poke1.moves[1]) }} className={((pokemon) ? poke1.moves[1].type.name : "") + ' ATK'}><div className={((pokemon) ? poke1.moves[1].type.name : "")}></div>{(pokemon) ? poke1.moves[1].name.replaceAll("-", " ") : ""}</div>
                        <div onClick={() => { setMove1(poke1.moves[2]) }} className={((pokemon) ? poke1.moves[2].type.name : "") + ' ATK'}><div className={((pokemon) ? poke1.moves[2].type.name : "")}></div>{(pokemon) ? poke1.moves[2].name.replaceAll("-", " ") : ""}</div>
                        <div onClick={() => { setMove1(poke1.moves[3]) }} className={((pokemon) ? poke1.moves[3].type.name : "") + ' ATK'}><div className={((pokemon) ? poke1.moves[3].type.name : "")}></div>{(pokemon) ? poke1.moves[3].name.replaceAll("-", " ") : ""}</div>
                        <div onClick={() => { setOpen(true) }} className='trocar ATK'>Trocar de Pokémon</div>
                    </div>
                </div>
                {/* Troca de Pokémon */}
                <Dialog onClose={() => { if (!bloqueado) setOpen(false) }} open={open}>
                    <DialogTitle>Selecione um Pokémon</DialogTitle>
                    <List>
                        {pokemon.map((pokemon) => (
                            (pokemon.currentHP > 0) ?
                                <ListItem button onClick={() => trocarPokemon(pokemon)} key={pokemon.name}>
                                    <ListItemAvatar>
                                        <img height='55px' loading='lazy' alt={(pokemon) ? pokemon.name : ""} src={(pokemon) ? pokemon.sprites.front_default : ""}></img>
                                    </ListItemAvatar>
                                    <ListItemText sx={{ textTransform: "capitalize" }} primary={pokemon.name} />
                                </ListItem>
                                : ""
                        ))}
                    </List>
                </Dialog>

                {/* Perdeu */}
                <Dialog open={openFinal} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {(ganhou) ? "Você Ganhou!" : "Você Perdeu! :("}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {(ganhou) ? "BOA, CARALHO! ESSE É O MEU MENINO! QUER AMASSAR MAIS UM?" : "Não foi dessa vez, guerreirinho. Deseja tentar novamente?"}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { window.location.href = "/" }}>Não :(</Button>
                        <Button onClick={() => { window.location.href = "/batalha" }}>BORA, PORRA</Button>
                    </DialogActions>
                </Dialog>
            </>
            : <CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='100px' color='inherit' />
    );
}

export default Batalha