// React
import React, { useEffect, useState } from "react";

// Material UI
import { LinearProgress, Typography, CircularProgress, Button, DialogContent, DialogContentText, DialogActions, List, ListItem, ListItemAvatar, ListItemText, DialogTitle, Dialog } from "@mui/material";

// CSS
import './batalhas.css';

const Batalha = () => {
    const [pokemon, setPokemon] = useState('');
    const [move1, setMove1] = useState('');
    const [poke1, setPoke1] = useState('');
    const [move2, setMove2] = useState('');
    const [poke2, setPoke2] = useState('');
    const [pokemon2, setPokemon2] = useState('');
    const [open, setOpen] = useState(false);
    const [openFinal, setOpenFinal] = useState(false);
    const [bloqueado, setBloqueado] = useState('');
    const [ganhou, setGanhou] = useState('');
    const tabelaFraquezas = [
        [1, 1, 1, 1, 1, 0.5, 1, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 1, 0.5, 0.5, 1, 2, 0.5, 0, 2, 1, 1, 1, 1, 0.5, 2, 1, 2, 1],
        [1, 2, 1, 1, 1, 0.5, 2, 0, 0.5, 1, 1, 2, 0.5, 1, 1, 1, 1, 1],
        [1, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 1, 2, 1, 1, 1, 1, 1, 2],
        [1, 1, 0, 2, 1, 2, 0.5, 0, 2, 2, 1, 0.5, 2, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 0.5, 1, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 0.5, 1, 2, 1, 2, 1, 1, 2, 1],
        [0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 1],
        [1, 1, 1, 1, 1, 2, 1, 0, 0.5, 0.5, 0.5, 1, 0.5, 1, 2, 1, 1, 2],
        [1, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5, 0.5, 2, 1, 1, 2, 0.5, 1, 1],
        [1, 1, 1, 1, 2, 2, 1, 1, 0.5, 2, 0.5, 0.5, 1, 1, 1, 0.5, 1, 1],
        [1, 1, 0.5, 0.5, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 1, 0.5, 1, 1],
        [1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 2, 0.5, 0.5, 1, 1, 0.5, 1, 1],
        [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 0, 1],
        [1, 1, 2, 1, 2, 1, 1, 1, 0.5, 0.5, 0.5, 2, 1, 1, 0.5, 2, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 0],
        [1, 0.5, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5],
        [1, 2, 1, 0.5, 1, 1, 1, 0, 0.5, 0.5, 1, 1, 1, 1, 1, 2, 2, 1]
    ];
    // const tabelaFraquezas = [
    //     [1  , 1  , 1  , 1  , 1  , 0.5, 1  , 0  , 0.5, 1  , 1  , 1  , 1  , 1  , 1  , 1  , 1  , 1  ], 
    //     [2  , 1  , 0.5, 0.5, 1  , 2  , 0.5, 0  , 2  , 1  , 1  , 1  , 1  , 0.5, 2  , 1  , 2  , 1  ], 
    //     [1  , 2  , 1  , 1  , 1  , 0.5, 2  , 0  , 0.5, 1  , 1  , 2  , 0.5, 1  , 1  , 1  , 1  , 1  ], 
    //     [1  , 1  , 1  , 0.5, 0.5, 0.5, 1  , 0.5, 0  , 1  , 1  , 2  , 1  , 1  , 1  , 1  , 1  , 2  ], 
    //     [1  , 1  , 0  , 2  , 1  , 2  , 0.5, 0  , 2  , 2  , 1  , 0.5, 2  , 1  , 1  , 1  , 1  , 1  ], 
    //     [1  , 1  , 1  , 1  , 1  , 0.5, 1  , 0  , 0.5, 1  , 1  , 1  , 1  , 1  , 1  , 1  , 1  , 1  ], 
    //     [1  , 0.5, 0.5, 0.5, 1  , 1  , 1  , 0.5, 0.5, 0.5, 1  , 2  , 1  , 2  , 1  , 1  , 2  , 1  ], 
    //     [0  , 1  , 1  , 1  , 1  , 1  , 1  , 2  , 1  , 1  , 1  , 1  , 1  , 2  , 1  , 1  , 0.5, 1  ], 
    //     [1  , 1  , 1  , 1  , 1  , 2  , 1  , 0  , 0.5, 0.5, 0.5, 1  , 0.5, 1  , 2  , 1  , 1  , 2  ], 
    //     [1  , 1  , 1  , 1  , 1  , 0.5, 2  , 1  , 2  , 0.5, 0.5, 2  , 1  , 1  , 2  , 0.5, 1  , 1  ], 
    //     [1  , 1  , 1  , 1  , 2  , 2  , 1  , 1  , 0.5, 2  , 0.5, 0.5, 1  , 1  , 1  , 0.5, 1  , 1  ], 
    //     [1  , 1  , 0.5, 0.5, 2  , 2  , 0.5, 1  , 0.5, 0.5, 2  , 0.5, 1  , 1  , 1  , 0.5, 1  , 1  ], 
    //     [1  , 1  , 2  , 1  , 0  , 1  , 1  , 0  , 1  , 1  , 2  , 0.5, 0.5, 1  , 1  , 0.5, 1  , 1  ], 
    //     [1  , 2  , 1  , 2  , 1  , 1  , 1  , 1  , 0.5, 1  , 1  , 1  , 1  , 0.5, 1  , 1  , 0  , 1  ], 
    //     [1  , 1  , 2  , 1  , 2  , 1  , 1  , 1  , 0.5, 0.5, 0.5, 2  , 1  , 1  , 0.5, 2  , 1  , 1  ], 
    //     [1  , 1  , 1  , 1  , 1  , 1  , 1  , 1  , 0.5, 1  , 1  , 1  , 1  , 1  , 1  , 2  , 1  , 0  ], 
    //     [1  , 0.5, 1  , 1  , 1  , 1  , 1  , 2  , 1  , 1  , 1  , 1  , 1  , 2  , 1  , 1  , 0.5, 0.5], 
    //     [1  , 2  , 1  , 0.5, 1  , 1  , 1  , 0  , 0.5, 0.5, 1  , 1  , 1  , 1  , 1  , 2  , 2  , 1  ]
    // ]
    var usuario = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
        document.title = 'Batalha | Wooper';
        if (pokemon === "") importaPokemon();
        if (move1) {
            turno(move1, poke1);
        }
    });

    const importaPokemon = async () => {
        if (usuario) {
            if (usuario.times) {
                var timeUsu = JSON.parse(usuario.times.replaceAll("'", "\""));
                for (let i = 0; i < timeUsu.length; i++) {
                    // Cálculo de stats
                    timeUsu[i].stats[0] = timeUsu[i].currentHP = Math.floor((2 * timeUsu[i].stats[0].base_stat + 31 + (255 / 4)) + 100 + 10);
                    timeUsu[i].stats[1] = Math.floor((2 * timeUsu[i].stats[1].base_stat + 31 + (255 / 4)) + 5);
                    timeUsu[i].stats[2] = Math.floor((2 * timeUsu[i].stats[2].base_stat + 31 + (255 / 4)) + 5);
                    timeUsu[i].stats[3] = Math.floor((2 * timeUsu[i].stats[3].base_stat + 31 + (255 / 4)) + 5);
                    timeUsu[i].stats[4] = Math.floor((2 * timeUsu[i].stats[4].base_stat + 31 + (255 / 4)) + 5);
                    timeUsu[i].stats[5] = Math.floor((2 * timeUsu[i].stats[5].base_stat + 31 + (255 / 4)) + 5);

                    var arrayMoves = [];
                    for (let c = 0; c < 4; c++) {
                        await fetch("https://pokeapi.co/api/v2/move/" + timeUsu[i].moves[c].move.name, {
                            method: 'GET',
                        }).then((res) => res.json())
                            .then((result) => arrayMoves[c] = result);
                    }
                    timeUsu[i].moves = arrayMoves;
                }

                var timeIni = JSON.parse(usuario.times.replaceAll("'", "\""));
                for (let i = 0; i < timeIni.length; i++) {
                    timeIni[i].stats[0] = timeIni[i].currentHP = Math.floor((2 * timeIni[i].stats[0].base_stat + 31 + (255 / 4)) + 100 + 10);
                    timeIni[i].stats[1] = Math.floor((2 * timeIni[i].stats[1].base_stat + 31 + (255 / 4)) + 5);
                    timeIni[i].stats[2] = Math.floor((2 * timeIni[i].stats[2].base_stat + 31 + (255 / 4)) + 5);
                    timeIni[i].stats[3] = Math.floor((2 * timeIni[i].stats[3].base_stat + 31 + (255 / 4)) + 5);
                    timeIni[i].stats[4] = Math.floor((2 * timeIni[i].stats[4].base_stat + 31 + (255 / 4)) + 5);
                    timeIni[i].stats[5] = Math.floor((2 * timeIni[i].stats[5].base_stat + 31 + (255 / 4)) + 5);

                    var arrayMoves = [];
                    for (let c = 0; c < 4; c++) {
                        await fetch("https://pokeapi.co/api/v2/move/" + timeIni[i].moves[c].move.name, {
                            method: 'GET',
                        }).then((res) => res.json())
                            .then((result) => arrayMoves[c] = result);
                    }
                    timeIni[i].moves = arrayMoves;
                }
                setPokemon(timeUsu);
                setPoke1(timeUsu[0]);
                setPoke2(timeIni[0]);
                setPokemon2(timeIni);
            }
        }
    };


    const trocarPokemon = async (poke) => {
        if (poke1.currentHP > 0) turno(null, poke);
        setPoke1(poke);
        setOpen(false);
    };

    const retornaMultiplicador = (move, pokemon) => {
        var tipoMove = retornaIdTipo(move.type.name);
        var tipoPoke1 = retornaIdTipo(pokemon.types[0].type.name);

        var multiplicador = tabelaFraquezas[tipoMove][tipoPoke1];
        if (tipoMove == tipoPoke1) multiplicador *= 1.5;

        if (pokemon.types[1]) {
            var tipoPoke2 = retornaIdTipo(pokemon.types[1].type.name);
            multiplicador *= tabelaFraquezas[tipoMove][tipoPoke2];
            if (tipoMove == tipoPoke2) multiplicador *= 1.5;
        }

        return multiplicador;
    };

    const retornaIdTipo = (tipo) => {
        var idtipo;
        switch (tipo) {
            case "normal": idtipo = 0; break;
            case "fighting": idtipo = 1; break;
            case "flying": idtipo = 2; break;
            case "poison": idtipo = 3; break;
            case "ground": idtipo = 4; break;
            case "rock": idtipo = 5; break;
            case "bug": idtipo = 6; break;
            case "ghost": idtipo = 7; break;
            case "steel": idtipo = 8; break;
            case "fire": idtipo = 9; break;
            case "water": idtipo = 10; break;
            case "grass": idtipo = 11; break;
            case "electric": idtipo = 12; break;
            case "psychic": idtipo = 13; break;
            case "ice": idtipo = 14; break;
            case "dragon": idtipo = 15; break;
            case "dark": idtipo = 16; break;
            case "fairy": idtipo = 17; break;
            default: idtipo = 0;
        }
        return idtipo;
    };

    const turno = (ataque1, poke1) => {
        var random = Math.floor(Math.random() * 4);
        var derrotados = 0;
        var derrotadosIni = 0;
        var ataque2 = poke2.moves[random];

        // Define os multiplicadores de dano

        if (ataque1) var multiplicador1 = retornaMultiplicador(ataque1, poke2);
        if (ataque2) var multiplicador2 = retornaMultiplicador(ataque2, poke1);


        // Checa a velocidade dos pokemon, pra definir quem ataca primeiro

        if (poke1.stats[5] > poke2.stats[5]) {
            poke2.currentHP -= (ataque1) ? Math.floor((((2 * 100 / 5) + 2) * ataque1.power * (poke1.stats[1] / poke2.stats[2]) / 50 + 2) * multiplicador1) : 0;
            if (poke2.currentHP <= 0) {
                poke2.currentHP = 0;
                for (let i = 0; i < pokemon2.length; i++) {
                    if (pokemon2[i].currentHP === 0) {
                        derrotadosIni++;
                    }
                }
                if (derrotadosIni < 6) {
                    setTimeout(() => { setPoke2(pokemon2[derrotadosIni]); }, 400);
                } else {
                    setGanhou(true);
                    setOpenFinal(true);
                }
            } else {
                poke1.currentHP -= (((2 * 100 / 5) + 2) * Math.floor(ataque2.power * (poke2.stats[1] / poke1.stats[2]) / 50 + 2) * multiplicador2);
                if (poke1.currentHP <= 0) {
                    setBloqueado(true);
                    poke1.currentHP = 0;
                    for (let i = 0; i < pokemon.length; i++) {
                        if (pokemon[i].currentHP === 0) {
                            derrotados++;
                        }
                    }
                    if (derrotados < 6) {
                        setOpen(true);
                    } else {
                        setGanhou(false);
                        setOpenFinal(true);
                    }
                }
            }
        } else if (poke1.stats[5].base_stat === poke2.stats[5].base_stat) {
            var randomSpeed = Math.floor(Math.random() * 2);
            if (randomSpeed === 0) {
                poke2.currentHP -= (ataque1) ? Math.floor((((2 * 100 / 5) + 2) * ataque1.power * (poke1.stats[1] / poke2.stats[2]) / 50 + 2) * multiplicador1) : 0;
                if (poke2.currentHP <= 0) {
                    poke2.currentHP = 0;
                    for (let i = 0; i < pokemon2.length; i++) {
                        if (pokemon2[i].currentHP === 0) {
                            derrotadosIni++;
                        }
                    }
                    if (derrotadosIni < 6) {
                        setTimeout(() => { setPoke2(pokemon2[derrotadosIni]); }, 400);
                    } else {
                        setGanhou(true);
                        setOpenFinal(true);
                    }
                } else {
                    poke1.currentHP -= Math.floor((((2 * 100 / 5) + 2) * ataque2.power * (poke2.stats[1] / poke1.stats[2]) / 50 + 2) * multiplicador2);
                    if (poke1.currentHP <= 0) {
                        setBloqueado(true);
                        poke1.currentHP = 0;
                        for (let i = 0; i < pokemon.length; i++) {
                            if (pokemon[i].currentHP === 0) {
                                derrotados++;
                            }
                        }
                        if (derrotados < 6) {
                            setOpen(true);
                        } else {
                            setGanhou(false);
                            setOpenFinal(true);
                        }
                    }
                }
            } else {
                poke1.currentHP -= Math.floor((((2 * 100 / 5) + 2) * ataque2.power * (poke2.stats[1] / poke1.stats[2]) / 50 + 2) * multiplicador2);
                if (poke1.currentHP <= 0) {
                    setBloqueado(true);
                    poke1.currentHP = 0;
                    for (let i = 0; i < pokemon.length; i++) {
                        if (pokemon[i].currentHP === 0) {
                            derrotados++;
                        }
                    }
                    if (derrotados < 6) {
                        setOpen(true);
                    } else {
                        setGanhou(false);
                        setOpenFinal(true);
                    }
                } else {
                    poke2.currentHP -= (ataque1) ? Math.floor((((2 * 100 / 5) + 2) * ataque1.power * (poke1.stats[1] / poke2.stats[2]) / 50 + 2) * multiplicador1) : 0;
                    if (poke2.currentHP <= 0) {
                        poke2.currentHP = 0;
                        for (let i = 0; i < pokemon2.length; i++) {
                            if (pokemon2[i].currentHP === 0) {
                                derrotadosIni++;
                            }
                        }
                        if (derrotadosIni < 6) {
                            setTimeout(() => { setPoke2(pokemon2[derrotadosIni]); }, 400);
                        } else {
                            setGanhou(true);
                            setOpenFinal(true);
                        }
                    }
                }
            }
        } else {
            poke1.currentHP -= Math.floor((((2 * 100 / 5) + 2) * ataque2.power * (poke2.stats[1] / poke1.stats[2]) / 50 + 2) * multiplicador2);
            if (poke1.currentHP <= 0) {
                setBloqueado(true);
                poke1.currentHP = 0;
                for (let i = 0; i < pokemon.length; i++) {
                    if (pokemon[i].currentHP === 0) {
                        derrotados++;
                    }
                }
                if (derrotados < 6) {
                    setOpen(true);
                } else {
                    setGanhou(false);
                    setOpenFinal(true);
                }
            } else {
                poke2.currentHP -= (ataque1) ? Math.floor((((2 * 100 / 5) + 2) * ataque1.power * (poke1.stats[1] / poke2.stats[2]) / 50 + 2) * multiplicador1) : 0;
                if (poke2.currentHP <= 0) {
                    poke2.currentHP = 0;
                    for (let i = 0; i < pokemon2.length; i++) {
                        if (pokemon2[i].currentHP === 0) {
                            derrotadosIni++;
                        }
                    }
                    if (derrotadosIni < 6) {
                        setTimeout(() => { setPoke2(pokemon2[derrotadosIni]); }, 400);
                    } else {
                        setGanhou(true);
                        setOpenFinal(true);
                    }
                }
            }
        }
        setMove1('');
        setMove2('');
    };

    return (
        (poke1) ?
            <>
                <div id='telaBatalha'>
                    <div id='enemyBTL'>
                        <Typography>{(poke2) ? poke2.name : ""}</Typography>
                        <Typography>{(poke2) ? poke2.currentHP + "/" + poke2.stats[0] : ""}</Typography>
                        <LinearProgress variant='determinate' value={(poke2) ? poke2.currentHP / poke2.stats[0] * 100 : 0}></LinearProgress>
                    </div>
                    <div><img loading='lazy' id='pokeIni' alt={(poke2) ? poke2.name : ""} src={(poke2) ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/" + poke2.id + ".gif" : ""}></img></div>
                    <div><img id='imgPokeMain' loading='lazy' alt={(pokemon) ? poke1.name : ""} src={(pokemon) ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/" + poke1.id + ".gif" : ""}></img></div>
                    <div id='self'>
                        <div id='selfBTL'>
                            <Typography>{(pokemon) ? poke1.name : ""}</Typography>
                            <Typography>{(pokemon) ? poke1.currentHP + "/" + poke1.stats[0] : ""}</Typography>
                            <LinearProgress variant='determinate' value={(pokemon) ? poke1.currentHP / poke1.stats[0] * 100 : 0}></LinearProgress>
                        </div>
                        <div id='ataquesBTL'>
                            <div onClick={() => { setMove1(poke1.moves[0]); }} className={((pokemon) ? poke1.moves[0].type.name : "") + ' ATK'}><div className={((pokemon) ? poke1.moves[0].type.name : "")}></div>{(pokemon) ? poke1.moves[0].name.replaceAll("-", " ") : ""}</div>
                            <div onClick={() => { setMove1(poke1.moves[1]); }} className={((pokemon) ? poke1.moves[1].type.name : "") + ' ATK'}><div className={((pokemon) ? poke1.moves[1].type.name : "")}></div>{(pokemon) ? poke1.moves[1].name.replaceAll("-", " ") : ""}</div>
                            <div onClick={() => { setMove1(poke1.moves[2]); }} className={((pokemon) ? poke1.moves[2].type.name : "") + ' ATK'}><div className={((pokemon) ? poke1.moves[2].type.name : "")}></div>{(pokemon) ? poke1.moves[2].name.replaceAll("-", " ") : ""}</div>
                            <div onClick={() => { setMove1(poke1.moves[3]); }} className={((pokemon) ? poke1.moves[3].type.name : "") + ' ATK'}><div className={((pokemon) ? poke1.moves[3].type.name : "")}></div>{(pokemon) ? poke1.moves[3].name.replaceAll("-", " ") : ""}</div>
                            <div onClick={() => { setOpen(true); }} className='trocar ATK'>Trocar de Pokémon</div>
                        </div>
                    </div>
                </div>
                {/* Troca de Pokémon */}
                <Dialog onClose={() => { if (!bloqueado) setOpen(false); }} open={open}>
                    <DialogTitle>Selecione um Pokémon</DialogTitle>
                    <List>
                        {pokemon.map((pokemon) => (
                            (pokemon.currentHP > 0) ?
                                <ListItem button onClick={() => trocarPokemon(pokemon)} key={pokemon.name}>
                                    <ListItemAvatar>
                                        <img height='55px' loading='lazy' alt={(pokemon) ? pokemon.name : ""} src={(pokemon) ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/" + pokemon.id + ".gif" : ""}></img>
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
                            {(ganhou) ? "BOA! ESSE É O MEU MENINO! QUER AMASSAR MAIS UM?" : "Não foi dessa vez, guerreirinho... Deseja tentar novamente?"}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { window.location.href = "/"; }}>Não :(</Button>
                        <Button onClick={() => { window.location.href = "/batalha"; }}>Sim B)</Button>
                    </DialogActions>
                </Dialog>
            </>
            : <CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='100px' color='inherit' />
    );
};

export default Batalha;