// React
import React, { useEffect } from "react";

// Material UI
import { Typography, CircularProgress, TextField, Fab } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { SnackbarProvider, useSnackbar } from "notistack";

// CSS
import './times.css'

var todosPokemon = []
var timeArray = []

const Times = () => {
    // Define os states
    const [pokemon, setPokemon] = React.useState("");
    const [operacao, setOperacao] = React.useState("");
    const [time, setTime] = React.useState("");

    // Snackbar
    const { enqueueSnackbar } = useSnackbar();
    const handleClick = (nome) => {
        console.log(time)
        if(time.length<6){
            if (time.includes(nome)) {
                timeArray = time.filter((value, index, arr) => { return value !== nome })
                setTime(timeArray)
                setOperacao("rem")
                enqueueSnackbar("Pokémon Removido!", {'variant':'error', 'autoHideDuration':1000})
            } else {
                timeArray.push(nome)
                setTime(timeArray)
                setOperacao("add")
                enqueueSnackbar("Pokémon Adicionado!", {'variant':'success', 'autoHideDuration':1000})
            }
        }
        else{
            enqueueSnackbar("Limite de Pokémons Atingido!", {'variant':'warning', 'autoHideDuration':1000})
        }
    }

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') { return }
    };

    // Renderiza os Pokemon Individualmente
    const renderPoke = (poke) => {
        return (
            // Retorna uma div com a classe do primeiro elemento do pokemon, pra mudar o background
            <div className={"pokemon " + poke.types[0].type.name} key={poke.id}>
                <div>
                    {/* Id e Nome do pokemon */}
                    <p>#{poke.id}</p>
                    <p className='nomePoke'>{poke.species.name}</p>

                    {/* Elementos */}
                    <p>
                        <img loading="lazy" alt="" className='tipo' src={"./Assets/Images/tipos/" + poke.types[0].type.name + ".svg"}></img>
                        {/* Se o segundo elemento existir, ele também vai ser exibido */}
                        {(poke.types[1]) ? (<img loading="lazy" alt="" className='tipo' src={"./Assets/Images/tipos/" + poke.types[1].type.name + ".svg"}></img>) : ""}
                        <Fab onClick={() => handleClick(poke.species.name)} size="small" aria-label="add">
                            {(timeArray.includes(poke.species.name)) ? <Remove /> : <Add />}
                        </Fab>
                    </p>
                </div>
                {/* Imagem do pokemon */}
                <div><img loading='lazy' alt={poke.species.name} src={"./Assets/Images/pokemons/" + poke.id.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) + poke.species.name + ".png"}></img></div>
            </div>
        )
    }

    // Assim que o componente for montado, chama uma API para pegar todos os pokemon e seta o state
    useEffect(() => {
        document.title = 'Pokédex | Wooper'
        if (pokemon === "") {
            carregaPokemon()
        }
    })

    const carregaPokemon = async () => {
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
        if (e === '') {
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

    return (
        <>
            <>
                <div id='headerPokedex'>
                    <Typography variant='h2' align='center' gutterBottom={true}>Pokédex</Typography>
                    <TextField label="Pesquisar" variant='outlined' onChange={event => pesquisaPokemon(event.target.value)} />
                </div>
                <div id='pokedex'>
                    {/* Se a API ainda estiver carregando, vai aparecer uma gif, senão, os cards dos pokemon vão aparecer */}
                    {(pokemon) ? pokemon.map(renderPoke) : (<CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='100px' color='inherit' />)}
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