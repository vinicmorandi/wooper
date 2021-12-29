// React
import React, { useEffect } from "react";

// Material UI
import { Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { SnackbarProvider, useSnackbar } from "notistack";

// CSS
import './times.css'
import { useMutation, gql } from "@apollo/client";

var timeArray = []
var timeArrayNomes = []

var salvar_query = gql`
    mutation salvarTime($id : String!, $time : String!){
        salvarTime(id:$id, time:$time){
            id:id
            nome:nome
        }
    }

`

const Times = () => {

    document.title = 'Pokédex | Wooper'

    // Define os states
    const [pokemon, setPokemon] = React.useState("");
    const [time, setTime] = React.useState("");
    const [timeNomes, setTimeNomes] = React.useState("");
    const [carregando, setCarregando] = React.useState(true)
    const [salvarTimes] = useMutation(salvar_query)
    var usuario = JSON.parse(localStorage.getItem('usuario'))

    // Snackbar
    const { enqueueSnackbar } = useSnackbar();


    // Assim que o componente for montado, chama uma API para pegar todos os pokemon e seta o state
    useEffect(() => {
        if (pokemon === "") {
            carregaPokemonTime()
        }
    })

    const carregaPokemonTime = async () => {
        // Pega os primeiros 150 primeiros pokemon e adiciona no array geral - a API que eu to usando é BEM ineficiente, então eu vou usar isso por enquanto, mas vou mudar dps
        for (let i = 1; i < 150; i++) {
            await fetch('https://graphql-pokeapi.graphcdn.app/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query pokemon($name: String!){
                            pokemon(name:$name){
                                id,
                                name,
                                moves{
                                move{
                                    name
                                }
                                },
                                stats{
                                    base_stat
                                },
                                sprites{
                                    front_default
                                }
                            }
                        }
                    `,
                    variables: { name: String(i) }
                }),
            }).then((res) => res.json())
                .then((result) => setPokemon((pokemon) => [...pokemon, result.data.pokemon]));
        }
        if (usuario.times && time === "") {
            var timeUsu = JSON.parse(usuario.times.replaceAll("'", "\""))
            setTime(timeUsu)
            var timeUsuNomes = timeUsu.map((a) => { return a.name })
            setTimeNomes(timeUsuNomes)
        }
        setCarregando(false)
    }

    const handleClick = (poke) => {
        if (timeNomes.includes(poke.name)) {
            timeArray = time.filter((value, index, arr) => { return value.name !== poke.name })
            timeArrayNomes = timeNomes.filter((value, index, arr) => { return value !== poke.name })
            setTime(timeArray)
            setTimeNomes(timeArrayNomes)
            enqueueSnackbar("Pokémon Removido!", { 'variant': 'error', 'autoHideDuration': 1000 })
        } else {
            if (timeNomes.length < 6) {
                timeArray = (time !== "") ? time.filter((value, index, arr) => { return true }) : []
                timeArray.push(poke)
                timeArrayNomes.push(poke.name)
                setTime(timeArray)
                setTimeNomes(timeArrayNomes)
                enqueueSnackbar("Pokémon Adicionado!", { 'variant': 'success', 'autoHideDuration': 1000 })
            }
            else {
                enqueueSnackbar("Limite de Pokémons Atingido!", { 'variant': 'warning', 'autoHideDuration': 1000 })
            }
        }

    }

    // Renderiza os Pokemon Individualmente
    const renderPokeTime = (poke, renderTime) => {
        return (
            <TableRow key={poke.id}>
                <TableCell align='center'>#{poke.id}</TableCell >
                <TableCell align='center'><img height='30px' loading='lazy' alt={poke.name} src={poke.sprites.front_default}></img></TableCell >
                <TableCell align='center'>{(poke.name.charAt(0).toUpperCase() + poke.name.slice(1)).replace('-', ' ')}</TableCell>
                {(renderTime)
                    ? <>
                        <TableCell align='center'>{(poke.moves[0].move.name.charAt(0).toUpperCase() + poke.moves[0].move.name.slice(1)).replace('-', ' ')}</TableCell>
                        <TableCell align='center'>{(poke.moves[1].move.name.charAt(0).toUpperCase() + poke.moves[1].move.name.slice(1)).replace('-', ' ')}</TableCell>
                        <TableCell align='center'>{(poke.moves[2].move.name.charAt(0).toUpperCase() + poke.moves[2].move.name.slice(1)).replace('-', ' ')}</TableCell>
                        <TableCell align='center'>{(poke.moves[3].move.name.charAt(0).toUpperCase() + poke.moves[3].move.name.slice(1)).replace('-', ' ')}</TableCell>
                    </>
                    : <>
                        <TableCell align='center'>{poke.stats[0].base_stat}</TableCell>
                        <TableCell align='center'>{poke.stats[1].base_stat}</TableCell>
                        <TableCell align='center'>{poke.stats[2].base_stat}</TableCell>
                        <TableCell align='center'>{poke.stats[3].base_stat}</TableCell>
                        <TableCell align='center'>{poke.stats[4].base_stat}</TableCell>
                        <TableCell align='center'>{poke.stats[5].base_stat}</TableCell>
                    </>
                }
                <TableCell align='center'><Button onClick={() => { handleClick(poke) }}> {(timeNomes.includes(poke.name) ? '-' : '+')}</Button></TableCell>
            </TableRow>
        )
    }

    const salvarTime = () => {
        for (let i = 0; i < time.length; i++) {
            time[i].moves = [time[i].moves[0], time[i].moves[1], time[i].moves[2], time[i].moves[3]]
        }
        if (time !== '') {
            var timeString = JSON.stringify(time)
            timeString = timeString.replaceAll("\"", "'")
            salvarTimes({
                variables: {
                    id: String(usuario.id),
                    time: timeString
                }
            })
            usuario.times = timeString
            localStorage.setItem('usuario', JSON.stringify(usuario));
        }
        window.location.href = "/times"
    }

    return (
        <>
            <div id='headerPokedex'>
                <Typography variant='h2' align='center' gutterBottom={true}>Escolha de Time</Typography>
            </div>
            {(carregando) ? <CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='100px' color='inherit' /> :
                <div id='timesConteudo'>
                    <div id='leftTimes'>
                        <Typography variant='h4' align='center' gutterBottom={true}>Pokédex</Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: "600px" }}>
                            <Table stickyHeader sx={{ minWidth: 785 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">ID</TableCell>
                                        <TableCell align="center">Imagem</TableCell>
                                        <TableCell align="center">Nome</TableCell>
                                        <TableCell align="center">HP</TableCell>
                                        <TableCell align="center">ATK</TableCell>
                                        <TableCell align="center">DEF</TableCell>
                                        <TableCell align="center">SPA</TableCell>
                                        <TableCell align="center">SPD</TableCell>
                                        <TableCell align="center">SPE</TableCell>
                                        <TableCell align="center">Operações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(pokemon) ? pokemon.map((poke) => { return renderPokeTime(poke, false) }) : (<TableRow><TableCell colSpan={10}><CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='20px' color='inherit' /></TableCell></TableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </div>
                    <div id='pokedexTime'>
                        <Typography variant='h4' align='center' gutterBottom={true}>Time</Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 785 }} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">ID</TableCell>
                                        <TableCell align="center">Imagem</TableCell>
                                        <TableCell align="center">Nome</TableCell>
                                        <TableCell align="center">Move 1</TableCell>
                                        <TableCell align="center">Move 2</TableCell>
                                        <TableCell align="center">Move 3</TableCell>
                                        <TableCell align="center">Move 4</TableCell>
                                        <TableCell align="center">Operações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(time) ? time.map((poke) => { return renderPokeTime(poke, true) }) : <TableRow><TableCell sx={{ padding: "10px" }} colSpan={5}>"Você não tem nenhum pokémon em seu time. Adicione um clicando no botão <span className="destaque">" + "</span></TableCell></TableRow>}
                                    <TableRow><TableCell align="center" colSpan={10}><Button onClick={salvarTime}>Salvar</Button></TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            }
        </>
    )
}

const TimesSnack = () => {
    return (
        <SnackbarProvider maxSnack={6}>
            <Times />
        </SnackbarProvider>
    );
}

export default TimesSnack