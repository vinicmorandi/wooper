// React
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Material UI
import { LinearProgress, Typography, CircularProgress, Button, DialogContent, DialogContentText, DialogActions, List, ListItem, ListItemAvatar, ListItemText, DialogTitle, Dialog, useTabContext } from "@mui/material";

// GraphQL
import { useMutation, gql } from "@apollo/client";
import { CodeOutlined } from "@mui/icons-material";

// Setup
var socket = io("ws://localhost:3000");
var usuario = JSON.parse(localStorage.getItem('usuario'));
var sala = '';
document.title = 'Batalha | Wooper';

var salvar_query = gql`
    mutation salvarElo($id : String!, $elo : Int!){
        salvarElo(id:$id, elo:$elo){
            id:id
            nome:nome
        }
    }

`;

const PVP = () => {
    // Dados dos combatentes
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioA, setUsuarioA] = useState();
    const [moveUsuario, setMoveUsuario] = useState('');
    const [inimigo, setInimigo] = useState();
    const [moveInimigo, setMoveInimigo] = useState('');

    const [atual, setAtual] = useState(0);
    const [atualIni, setAtualIni] = useState(0);

    const [salvarElo] = useMutation(salvar_query);

    // Modais e estados de jogo
    const [open, setOpen] = useState(false);
    const [openFinal, setOpenFinal] = useState(false);

    // Estados de jogo
    const [carregando, setCarregando] = useState(false);
    const [procurando, setProcurando] = useState(false);
    const [bloqueado, setBloqueado] = useState('');
    const [ganhou, setGanhou] = useState('');

    // Linhas - Tipo do ataque
    // Coluna - Tipo do alvo
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

    // Índice é a id do tipo
    var arrayTipos = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];

    // Quando os 2 moves estiverem definidos, o turno começa
    useEffect(() => {
        if (moveUsuario != '' && moveInimigo != '') {
            setTimeout(turno, 1000);
        }
    });

    // Conecta ao socketIO
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

    // Retorna o multiplicador de dano com base no tipo do ataque e dos 2 tipos do alvo
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

    // Retorna a id do tipo passado
    const retornaIdTipo = (tipo) => {
        for (let i = 0; i < arrayTipos.length; i++) {
            if (arrayTipos[i] === tipo) return i;
        }
        return 0;
    };

    // Quando os 2 ataques estiverem definidos, vai começar o turno
    // Primeiro, ele checa para ver se nenhum dos usuários trocou de pokémon
    // Depois, ele dá as ordens de ataque com base na velocidade dos pokémon
    // Se os 2 pokémon tiverem a mesma velocidade
    const turno = async () => {
        if (usuarioA.pokemon.time[atual].stats[5] > inimigo.pokemon.time[atualIni].stats[5]) {
            orderAtaques('usuario');
        } else if (usuarioA.pokemon.time[atual].stats[5] === inimigo.pokemon.time[atualIni].stats[5]) {
            var randomSpeed = Math.floor(Math.random() * 2);
            if (randomSpeed > 1) {
                orderAtaques('usuario');
            } else {
                orderAtaques('inimigo');
            }
        } else {
            orderAtaques('inimigo');
        }
        setMoveUsuario('');
        setMoveInimigo('');
        setCarregando(false);
    };

    // Pega a ordem dos ataques
    const orderAtaques = (primeiro) => {
        if (primeiro == "usuario") {
            ataqueUsuario();
            ataqueInimigo();
        } else {
            ataqueInimigo();
            ataqueUsuario();
        }
    };

    const ataqueUsuario = () => {
        if (moveUsuario !== '' && moveUsuario.name !== 'switch') {
            let multiplicador = retornaMultiplicador(moveUsuario, inimigo.pokemon.time[atualIni]);
            let derrotadosIni = 0;

            inimigo.pokemon.time[atualIni].currentHP -= Math.floor((((2 * 100 / 5) + 2) * moveUsuario.power * (usuario.pokemon.time[atual].stats[1] / inimigo.pokemon.time[atualIni].stats[2]) / 50 + 2) * multiplicador);
            if (inimigo.pokemon.time[atualIni].currentHP <= 0) {
                inimigo.pokemon.time[atualIni].currentHP = 0;
                for (let i = 0; i < inimigo.pokemon.time.length; i++) {
                    if (inimigo.pokemon.time[i].currentHP === 0) {
                        derrotadosIni++;
                    }
                }
                if (derrotadosIni === 6) {
                    setGanhou(true);
                    setOpenFinal(true);
                    salvarElo({
                        variables: {
                            id: String(usuario.id),
                            elo: usuario.elo + 100 * (1 / (1 + 10 ^ ((usuario.elo - inimigo.elo) / 400)))
                        }
                    });
                }
            }
        }
    };

    const ataqueInimigo = () => {
        if (moveInimigo !== '' && moveInimigo.name !== 'switch') {

            let multiplicador = retornaMultiplicador(moveInimigo, usuarioA.pokemon.time[atual]);
            let derrotados = 0;

            usuarioA.pokemon.time[atual].currentHP -= Math.floor((((2 * 100 / 5) + 2) * moveInimigo.power * (inimigo.pokemon.time[atualIni].stats[1] / usuarioA.pokemon.time[atual].stats[2]) / 50 + 2) * multiplicador);

            if (usuarioA.pokemon.time[atual].currentHP <= 0) {
                setBloqueado(true);
                usuarioA.pokemon.time[atual].currentHP = 0;
                for (let i = 0; i < usuarioA.pokemon.time.length; i++) {
                    if (usuarioA.pokemon.time[i].currentHP === 0) {
                        derrotados++;
                    }
                }
                if (derrotados < 6) {
                    setOpen(true);
                } else {
                    setGanhou(false);
                    setOpenFinal(true);
                    salvarElo({
                        variables: {
                            id: String(usuario.id),
                            elo: usuario.elo - 100 * (1 / (1 + 10 ^ ((usuario.elo - inimigo.elo) / 400)))
                        }
                    });
                }
            }
        }
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
        if (user.id !== usuario.id) {
            setInimigo(user);
        }
        setUsuarios(arrayUsers);
        if (sala === '') sala = salaAtual;
    });

    socket.on('atualiza-lobbyU', (lobby) => {
        for (let i = 0; i < lobby.length; i++) {
            if (lobby[i].id !== usuario.id) {
                setInimigo(lobby[i]);
            }
        }
        setUsuarios(lobby);
    });

    socket.on('troca', (posicao) => {
        setAtualIni(posicao);
    });

    const ataque = (atk) => {
        socket.emit('ataque', sala, atk, usuario.id);
        setCarregando(true);
    };

    const trocarPokemon = (poke) => {
        socket.emit("troca", sala, poke.posicao);
        setAtual(poke.posicao);
        setOpen(false);
    };


    socket.on('retorno', (ataque, idUser) => {
        if (idUser == usuario.id) {
            setMoveUsuario(ataque);
        } else {
            setMoveInimigo(ataque);
        }
    });

    // - IMPORTA POKEMON - 
    // Vai pegar as informações salvas no time do usuário e definir
    // os status e movimentos

    const importaPokemon = async (user) => {
        let usuRetorno = {};
        let time = JSON.parse(user.times.replaceAll("'", "\""));
        let timeRetorno = [];
        for (let i = 0; i < time.length; i++) {
            timeRetorno[i] = await definePokemon(time[i]);
            timeRetorno[i].posicao = i;
        }
        usuRetorno.time = timeRetorno;

        return usuRetorno;
    };

    const definePokemon = async (poke) => {
        poke.stats = await defineStatus(poke);
        poke.currentHP = poke.stats[0];
        poke.moves = await defineMoves(poke);
        return poke;
    };

    const defineStatus = async (poke) => {
        let arrayStats = [];
        arrayStats[0] = Math.floor((2 * poke.stats[0].base_stat + 31 + (255 / 4)) + 100 + 10);
        for (let c = 1; c < 6; c++) {
            arrayStats[c] = Math.floor((2 * poke.stats[c].base_stat + 31 + (255 / 4)) + 5);
        }
        return arrayStats;
    };

    const defineMoves = async (poke) => {
        var arrayMoves = [];
        for (let c = 0; c < 4; c++) {
            await fetch("https://pokeapi.co/api/v2/move/" + poke.moves[c].move.name, {
                method: 'GET',
            }).then((res) => res.json())
                .then((result) => arrayMoves[c] = result);
        }
        return arrayMoves;
    };

    return (
        <>{(usuarios.length > 1)
            ? <div id='telaBatalha'><>
                {(inimigo)
                    ? <div id='enemyBTL'>
                        <Typography>{inimigo.pokemon.time[atualIni].name}</Typography>
                        <Typography>{inimigo.pokemon.time[atualIni].currentHP} /  {inimigo.pokemon.time[atualIni].stats[0]}</Typography>
                        <LinearProgress variant='determinate' value={inimigo.pokemon.time[atualIni].currentHP / inimigo.pokemon.time[atualIni].stats[0] * 100}></LinearProgress>
                        <div><img loading='lazy' id='pokeIni' alt={inimigo.pokemon.time[atualIni].name} src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/" + inimigo.pokemon.time[atualIni].id + ".gif"}></img></div>
                    </div>

                    : ""
                }
                {(usuarioA.pokemon.time[atual])
                    ? <>
                        <div><img id='imgPokeMain' loading='lazy' alt={(usuarioA) ? usuarioA.pokemon.time[atual].name : ""} src={(usuarioA) ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/" + usuarioA.pokemon.time[atual].id + ".gif" : ""}></img></div>
                        <div id='self'>
                            <div id='selfBTL'>
                                <Typography>{(usuarioA.pokemon.time[atual]) ? usuarioA.pokemon.time[atual].name : ""}</Typography>
                                <Typography>{(usuarioA.pokemon.time[atual]) ? usuarioA.pokemon.time[atual].currentHP + "/" + usuarioA.pokemon.time[atual].stats[0] : ""}</Typography>
                                <LinearProgress variant='determinate' value={(usuarioA.pokemon.time[atual]) ? usuarioA.pokemon.time[atual].currentHP / usuarioA.pokemon.time[atual].stats[0] * 100 : 0}></LinearProgress>
                            </div>
                            <div id='ataquesBTL'>
                                {(carregando)
                                    ? <div>Oi</div>

                                    : <> {
                                        (usuarioA.pokemon.time[atual].moves)
                                            ? (usuarioA.pokemon.time[atual].moves.map(move => (
                                                <div onClick={() => { ataque(move); }} className={move.type.name + ' ATK'}>
                                                    <div className={move.type.name}></div>
                                                    {move.name.replaceAll("-", " ")}
                                                </div>
                                            )))

                                            : ""
                                    }</>
                                }
                            </div>
                        </div>
                    </>

                    : ""
                }

                {/* Troca de Pokémon */}
                {(usuarioA.pokemon.time[atual])
                    ? <Dialog onClose={() => { if (!bloqueado) setOpen(false); }} open={open}>
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
                    </Dialog>

                    : ""
                }

                {/* Vitória / Derrota */}
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
            </></div>

            : (procurando)
                ? <p>Procurando Adversários...</p>
                : <Button onClick={() => { login(); }}>Procurar Adversários</Button>
        }</>
    );
};

export default PVP;