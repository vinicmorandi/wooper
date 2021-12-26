// React
import React, { useEffect } from "react";

// Material UI
import { Typography, CircularProgress, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableFooter } from "@mui/material";
import { SnackbarProvider, useSnackbar } from "notistack";

// CSS
import './times.css'
import { useMutation, gql } from "@apollo/client";

var todosPokemon = []
var timeArray = []
var timeArrayNomes = []


var salvar_query = gql`
    mutation salvarTime($id : String!, $Time : String!){
        salvarTime(id:$id, time:$time){
            id,
        }
    }

`

const Times = () => {

    document.title = 'Pokédex | Wooper'

    // Define os states
    const [pokemon, setPokemon] = React.useState("");
    const [time, setTime] = React.useState("");
    const [timeNomes, setTimeNomes] = React.useState("");
    const [salvarTimes] = useMutation(salvar_query)

    // Snackbar
    const { enqueueSnackbar } = useSnackbar();
    const handleClick = (poke) => {
        if (timeNomes.includes(poke.name)) {
            timeArray = time.filter((value, index, arr) => { return value.name !== poke.name })
            timeArrayNomes = timeNomes.filter((value, index, arr) => { return value !== poke.name })
            setTime(timeArray)
            setTimeNomes(timeArrayNomes)
            enqueueSnackbar("Pokémon Removido!", { 'variant': 'error', 'autoHideDuration': 600 })
        } else {
            if (timeNomes.length < 6) {

                // Fetch para os movimentos

                //


                timeArray = (time !== "") ? time.filter((value, index, arr) => { return true }) : []
                timeArray.push(poke)
                timeArrayNomes.push(poke.name)
                setTime(timeArray)
                setTimeNomes(timeArrayNomes)
                enqueueSnackbar("Pokémon Adicionado!", { 'variant': 'success', 'autoHideDuration': 600 })
            }
            else {
                enqueueSnackbar("Limite de Pokémons Atingido!", { 'variant': 'warning', 'autoHideDuration': 1000 })
            }
        }

    }

    // Renderiza os Pokemon Individualmente
    const renderPokeTime = (poke) => {
        return (
            <TableRow>
                <TableCell align='center'>#{poke.id}</TableCell >
                <TableCell align='center'><img height='30px' loading='lazy' alt={poke.name} src={poke.artwork}></img></TableCell >
                <TableCell align='center'>{poke.name.toUpperCase()}</TableCell>
                <TableCell align='center'>{690}</TableCell>
                <TableCell align='center'>{690}</TableCell>
                <TableCell align='center'>{690}</TableCell>
                <TableCell align='center'>{690}</TableCell>
                <TableCell align='center'>{690}</TableCell>
                <TableCell align='center'>{690}</TableCell>
                <TableCell align='center'><Button onClick={() => { handleClick(poke) }}> {(timeNomes.includes(poke.name) ? '-' : '+')}</Button></TableCell >
            </TableRow>
        )
    }

    // Assim que o componente for montado, chama uma API para pegar todos os pokemon e seta o state
    useEffect(() => {
        if (pokemon === "") {
            carregaPokemonTime()
        }

        console.log(time)
    })

    const carregaPokemonTime = async () => {
        // Pega os primeiros 150 primeiros pokemon e adiciona no array geral - a API que eu to usando é BEM ineficiente, então eu vou usar isso por enquanto, mas vou mudar dps
        await fetch('https://graphql-pokeapi.graphcdn.app/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query pokemons{
                        pokemons(limit:898,offset:0){
                            results{
                                id,
                                name,
                                artwork
                            }
                        }
                    }
            `
            }),
        }).then((res) => res.json())
            .then((result) => setPokemon(result.data.pokemons.results));
    }

    const salvarTime = () => {
        var usuario = JSON.parse(localStorage.getItem('usuario'))
        console.log(usuario.id)
        if (time != '') {
            var timeString = JSON.stringify(time)
            salvarTimes({
                variables: {
                    id: String(usuario.id),
                    time: timeString
                }
            })
        }
    }

    return (
        <>
            <div id='headerPokedex'>
                <Typography variant='h2' align='center' gutterBottom={true}>Escolha de Time</Typography>
            </div>
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
                                    <TableCell align="center">HP</TableCell>
                                    <TableCell align="center">HP</TableCell>
                                    <TableCell align="center">HP</TableCell>
                                    <TableCell align="center">HP</TableCell>
                                    <TableCell align="center">HP</TableCell>
                                    <TableCell align="center">Operações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {/* Se a API ainda estiver carregando, vai aparecer uma gif, senão, os cards dos pokemon vão aparecer */}
                                {(pokemon) ? pokemon.map(renderPokeTime) : (<TableCell colSpan={10}><CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='40px' color='inherit' /></TableCell>)}
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
                                    <TableCell align="center">HP</TableCell>
                                    <TableCell align="center">HP</TableCell>
                                    <TableCell align="center">HP</TableCell>
                                    <TableCell align="center">HP</TableCell>
                                    <TableCell align="center">HP</TableCell>
                                    <TableCell align="center">HP</TableCell>
                                    <TableCell align="center">Operações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(time) ? time.map(renderPokeTime) : <TableCell sx={{ padding: "10px" }} colSpan={5}>"Você não tem nenhum pokémon em seu time. Adicione um clicando no botão <span className="destaque">" + "</span></TableCell>}
                                {(time) ? <TableCell align="center" colSpan={10}><Button onClick={salvarTime}>Salvar</Button></TableCell> : ''}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
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