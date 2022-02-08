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
    const [inimigo, setInimigo] = useState();
    const [carregando, setCarregando] = useState(false);
    const [ataques, setAtaques] = useState([]);
    const [procurando, setProcurando] = useState(false);
    var sala = '';

    const [open, setOpen] = useState(false);
    const [openFinal, setOpenFinal] = useState(false);
    const [bloqueado, setBloqueado] = useState('');
    const [ganhou, setGanhou] = useState('');

    const login = async () => {
        setProcurando(true);
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

    socket.on('loginU', async (user, salaAtual) => {
        var arrayUsers = usuarios;
        user.pokemon = await importaPokemon(user);
        arrayUsers[user.id] = user;
        console.log(user);
        if (user.id !== usuario.id) {
            setInimigo(user);
        }
        setUsuarios(arrayUsers);
        if (sala === '') sala = salaAtual;
    });

    socket.on('atualiza-lobbyU', (lobby) => {
        console.log(lobby);
        for (let i = 0; i < lobby.length; i++) {
            if (lobby[i].id !== usuario.id) {
                setInimigo(lobby[i]);
            }
        }
        setUsuarios(lobby);
    });

    const ataque = (a) => {
        socket.emit('ataque', sala, a, usuario.id);
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

    const trocarPokemon = async (poke) => {
        let user = usuarioA;
        let users = usuarios;
        if (usuarioA.pokemon.atual.currentHP > 0) turno(null, poke);
        user.pokemon.atual = poke;
        users[usuarioA.id] = user;
        setUsuarioA(user);
        setUsuarios(usuarios);
        setOpen(false);
    };

    return (
        <>
            {
                (carregando) ? <div>carregando...</div> : ""
            }
            {
                (usuarios.length > 1) ?
                    <div id='telaBatalha'>
                        <>
                            {
                                (inimigo) ?
                                    <div id='enemyBTL'>
                                        <Typography>{inimigo.pokemon.atual.name}</Typography>
                                        <Typography>{inimigo.pokemon.atual.currentHP} /  {inimigo.pokemon.atual.stats[0]}</Typography>
                                        <LinearProgress variant='determinate' value={inimigo.pokemon.atual.currentHP / inimigo.pokemon.atual.stats[0] * 100}></LinearProgress>
                                        <div><img loading='lazy' id='pokeIni' alt={inimigo.pokemon.atual.name} src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/" + inimigo.pokemon.atual.id + ".gif"}></img></div>
                                    </div>
                                    : ""
                            }
                            {(usuarioA.pokemon) ?
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
                                        <div onClick={() => { setOpen(true); }} className='trocar ATK'>Trocar de Pokémon</div>
                                    </div>
                                </> : ""
                            }

                            {/* Troca de Pokémon */}
                            {
                                (usuarioA.pokemon) ? <Dialog onClose={() => { if (!bloqueado) setOpen(false); }} open={open}>
                                    <DialogTitle>Selecione um Pokémon</DialogTitle>
                                    <List>
                                        {usuarioA.pokemon.time.map((pokemon) => (
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
                                </Dialog> : ""
                            }

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
                                    <Button onClick={() => { window.location.href = "/"; }}>Não :(</Button>
                                    <Button onClick={() => { window.location.href = "/batalha"; }}>BORA, PORRA</Button>
                                </DialogActions>
                            </Dialog>
                        </>
                    </div>

                    : (procurando) ? <p>Procurando Adversários...</p> : <Button onClick={() => { login(); }}>Procurar Adversários</Button>
            }

        </>
    );
};

export default PVP;