// React
import React, { useEffect } from "react";

// Material UI
import { Typography, CircularProgress, TextField, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { SnackbarProvider, useSnackbar } from "notistack";

// CSS
import './times.css'

var todosPokemon = []
var timeArray = []
var timeArrayNomes = []

const Times = () => {
    // Define os states
    const [pokemon, setPokemon] = React.useState("");
    const [time, setTime] = React.useState("");
    const [timeNomes, setTimeNomes] = React.useState("");

    // Snackbar
    const { enqueueSnackbar } = useSnackbar();
    const handleClick = (poke) => {
        if (time.length < 6) {
            if (time.includes(poke)) {
                timeArray = time.filter((value, index, arr) => { return value !== poke })
                timeArrayNomes = timeNomes.filter((value, index, arr) => { return value !== poke.species.name })
                setTime(timeArray)
                setTimeNomes(timeArrayNomes)
                enqueueSnackbar("Pokémon Removido!", { 'variant': 'error', 'autoHideDuration': 600 })
            } else {
                timeArray.push(poke)
                timeArrayNomes.push(poke.species.name)
                setTime(timeArray)
                setTimeNomes(timeArrayNomes)
                enqueueSnackbar("Pokémon Adicionado!", { 'variant': 'success', 'autoHideDuration': 600 })
            }
        }
        else {
            enqueueSnackbar("Limite de Pokémons Atingido!", { 'variant': 'warning', 'autoHideDuration': 1000 })
        }
    }

    // Renderiza os Pokemon Individualmente
    const renderPokeTime = (poke) => {
        return (
            <div key={poke.id}>
                <Accordion className='accordionPokemon'>
                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
                        <div className='pokemonDesc'>
                            <div>#{poke.id}</div>
                            |
                            <div><img height='30px' loading='lazy' alt={poke.species.name} src={"./Assets/Images/pokemons/" + poke.id.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) + poke.species.name + ".png"}></img></div>
                            |
                            <div>{poke.species.name}</div>
                            |
                            <div><img loading="lazy" alt="" className='tipo' src={"./Assets/Images/tipos/" + poke.types[0].type.name + ".svg"}></img></div>
                            |
                            {(poke.types[1]) ? (<div><img loading="lazy" alt="" className='tipo' src={"./Assets/Images/tipos/" + poke.types[1].type.name + ".svg"}></img></div>) : ""}
                            |
                            <Button onClick={() => { handleClick(poke) }}> {(timeNomes.includes(poke.species.name) ? '-' : '+')}</Button>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>
        )
    }

    // Assim que o componente for montado, chama uma API para pegar todos os pokemon e seta o state
    useEffect(() => {
        document.title = 'Pokédex | Wooper'
        if (pokemon === "") {
            carregaPokemonTime()
        }
    })

    const carregaPokemonTime = async () => {
        // Pega os primeiros 150 primeiros pokemon e adiciona no array geral - a API que eu to usando é BEM ineficiente, então eu vou usar isso por enquanto, mas vou mudar dps
        for (let i = 1; i < 150; i++) {
            let url = "https://pokeapi.co/api/v2/pokemon/" + i;
            var resposta = await fetch(url);
            todosPokemon[i] = await resposta.json();
        }
        setPokemon(todosPokemon)
    }

    const pesquisaPokemon = (e) => {
        var pokemonArray = [];
        // Se a pesquisa estiver vazia, pega todos
        if (e === '' && time === '') {
            pokemonArray = todosPokemon
        } else {
            // Senão, vai comparar com os pokemons já cadastrados
            for (let i = 0; i < todosPokemon.length; i++) {
                if (todosPokemon[i]) {
                    // Se o nome incluir o valor da pesquisa, vai adicionar o pokemon ao array
                    if (todosPokemon[i].species.name.includes(e)) {
                        pokemonArray[i] = todosPokemon[i]
                    }
                }
            }
        }
        setPokemon(pokemonArray)
    }

    const salvarTime = () => {
        console.log('')
    }

    return (
        <>
            <>
                <div id='headerPokedex'>
                    <Typography variant='h2' align='center' gutterBottom={true}>Escolha de Time</Typography>
                </div>
                <div id='timesConteudo'>
                    <div id='leftTimes'>
                        <Typography variant='h4' align='center' gutterBottom={true}>Pokédex</Typography>
                        <TextField label="Pesquisar" variant='outlined' id='pesquisaTime' onChange={event => pesquisaPokemon(event.target.value)} />
                        <div id='pokedexTimes'>
                            {/* Se a API ainda estiver carregando, vai aparecer uma gif, senão, os cards dos pokemon vão aparecer */}
                            {(pokemon) ? pokemon.map(renderPokeTime) : (<CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='100px' color='inherit' />)}
                        </div>
                    </div>
                    <div id='pokedexTime'>
                        <Typography variant='h4' align='center' gutterBottom={true}>Time</Typography>
                        {(time.length>0) ? time.map(renderPokeTime) : <div>"Você não tem nenhum pokémon em seu time. Adicione um clicando no botão <span className="destaque">" + "</span></div>}
                        {(time.length>0) ? <Button onClick={salvarTime}>Salvar</Button> : '' }
                    </div>
                </div>
            </>
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