// React
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Material UI
import { LinearProgress, Typography, CircularProgress, Button, DialogContent, DialogContentText, DialogActions, List, ListItem, ListItemAvatar, ListItemText, DialogTitle, Dialog } from "@mui/material";

// CSS
import './batalhas.css';

var socket = io("ws://localhost:3000");
var usuario = JSON.parse(localStorage.getItem('usuario'));

const PVP = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioA, setUsuarioA] = useState();
    const [carregando, setCarregando] = useState(false);
    const [ataques, setAtaques] = useState([]);
    const [outroUsuarioId, setOutroUsuarioId] = useState('');

    const login = async () => {
        socket.emit("connection");
        if (usuario) {
            usuario.pokemon = await importaPokemon(usuario);
            setUsuarioA(usuario);
            socket.emit("login", usuario);
        }
        let arrayUsu = usuarios;
        arrayUsu[usuario.id] = usuario;
        setUsuarios(arrayUsu);
    };


    socket.on('ataque', (ataque, idUsuario) => {
        var arrayAtaques = (ataques) ? ataques : [];
        arrayAtaques[idUsuario] = ataque;
        if (arrayAtaques.length == 2) {
            turno(arrayAtaques, usuarios);
            arrayAtaques = [];
        }
        setAtaques(arrayAtaques);
        setCarregando(false);
    });

    const turno = () => {
        console.log('turno');
    };


    // - LOGIN / ATUALIZA LOBBY -
    // Adiciona o usuário que acabou de logar.
    // Se a id do usuário que logou for diferente da id do usuário
    // que já está logado, o sistema vai lançar um evento para 
    // atualizar o lobby, assim o novo usuário também vai ter 
    // as informações do primeiro

    socket.on('loginU', async (user) => {
        var arrayUsers = usuarios;
        user.pokemon = await importaPokemon(user);
        arrayUsers[user.id] = user;
        if (user.id !== usuario.id) {
            setOutroUsuarioId(user.id);
        }
        setUsuarios(arrayUsers);
    });

    socket.on('atualiza-lobbyU', (lobby) => {
        console.log("lobby");
        console.log(lobby);
        setUsuarios(lobby);
    });

    const ataque = (a) => {
        socket.emit('ataque', a, usuario.id);
        setCarregando(true);
    };

    // - IMPORTA POKEMON - 
    // Vai pegar as informações salvas no time do usuário e definir
    // os status e movimentos

    const importaPokemon = async (usuario) => {
        var usuRetorno = {};
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
        usuRetorno.time = timeUsu;
        usuRetorno.atual = timeUsu[0];

        return usuRetorno;
    };

    return (
        <>
            {
                (carregando) ? <div>carregando...</div> : ""
            }
            {
                (usuarios.length > 0) ? (usuarios) ?
                    <div id='telaBatalha'>
                        <>
                            {
                                (outroUsuarioId !== '') ?
                                    <div id='enemyBTL'>
                                        <Typography>{usuarios[outroUsuarioId].pokemon.atual.name}</Typography>
                                        <Typography>{usuarios[outroUsuarioId].pokemon.atual.currentHP} /  {usuarios[outroUsuarioId].pokemon.atual.stats[0]}</Typography>
                                        <LinearProgress variant='determinate' value={usuarios[outroUsuarioId].pokemon.atual.currentHP / usuarios[outroUsuarioId].pokemon.atual.stats[0] * 100}></LinearProgress>
                                        <div><img loading='lazy' id='pokeIni' alt={usuarios[outroUsuarioId].pokemon.atual.name} src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/" + usuarios[outroUsuarioId].pokemon.atual.id + ".gif"}></img></div>
                                    </div>
                                    // <div id='enemyBTL'>
                                    //     <Typography>{(usuarios[outroUsuarioId].pokemon.atual) ? usuarios[outroUsuarioId].pokemon.atual.name : ""}</Typography>
                                    //     <Typography>{(usuarios[outroUsuarioId].pokemon.atual) ? usuarios[outroUsuarioId].pokemon.atual.currentHP + "/" + usuarios[outroUsuarioId].pokemon.atual.stats[0] : ""}</Typography>
                                    //     <LinearProgress variant='determinate' value={(usuarios[outroUsuarioId].pokemon.atual) ? usuarios[outroUsuarioId].pokemon.atual.currentHP / usuarios[outroUsuarioId].pokemon.atual.stats[0] * 100 : 0}></LinearProgress>
                                    //     <div><img loading='lazy' id='pokeIni' alt={(usuarios[outroUsuarioId].pokemon.atual) ? usuarios[outroUsuarioId].pokemon.atual.name : ""} src={(usuarios[outroUsuarioId].pokemon.atual) ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/" + usuarios[outroUsuarioId].pokemon.atual.id + ".gif" : ""}></img></div>
                                    // </div> 
                                    : ""
                            }
                            {(usuarioA) ?
                                <>
                                    <div><img id='imgPokeMain' loading='lazy' alt={(usuarioA) ? usuarioA.pokemon.atual.name : ""} src={(usuarioA) ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/" + usuarioA.pokemon.atual.id + ".gif" : ""}></img></div>
                                    <div id='selfBTL'>
                                        <Typography>{(usuarioA.pokemon.atual) ? usuarioA.pokemon.atual.name : ""}</Typography>
                                        <Typography>{(usuarioA.pokemon.atual) ? usuarioA.pokemon.atual.currentHP + "/" + usuarioA.pokemon.atual.stats[0] : ""}</Typography>
                                        <LinearProgress variant='determinate' value={(usuarioA.pokemon.atual) ? usuarioA.pokemon.atual.currentHP / usuarioA.pokemon.atual.stats[0] * 100 : 0}></LinearProgress>
                                    </div>
                                    <div id='ataquesBTL'>
                                        {(usuarioA.pokemon.atual.moves) ? (usuarioA.pokemon.atual.moves.map(move => (
                                            <div className={move.type.name + ' ATK'}>
                                                <div className={move.type.name}></div>
                                                {move.name.replaceAll("-", " ")}
                                            </div>
                                        ))) : ""}
                                        {/* <div onClick={() => { setOpen(true); }} className='trocar ATK'>Trocar de Pokémon</div> */}
                                    </div>
                                </> : ""
                            }
                        </>
                    </div>

                    : "" : <Button onClick={() => { login(); }}>Oi</Button>
            }

        </>
    );
};

export default PVP;