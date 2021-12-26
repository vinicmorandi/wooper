// React
import React, { useEffect } from "react";

// Material UI
import { Typography, CircularProgress, TextField } from "@mui/material";

// CSS
import './pokedex.css'

var todosPokemon = []
var onlyOnce = 0;

const Pokedex = () => {
    // Define os states
    const [pokemon, setPokemon] = React.useState("");

    // Renderiza os Pokemon Individualmente
    const renderPoke = (poke) => {
        console.log(poke)
        return (
            // Retorna uma div com a classe do primeiro elemento do pokemon, pra mudar o background
            <div className={"pokemon " + poke.types[0].type.name} key={poke.id}>
                <div>
                    {/* Id e Nome do pokemon */}
                    <p>#{poke.id}</p>
                    <p className='nomePoke'>{poke.name}</p>

                    {/* Elementos */}
                    <p>
                        <img loading="lazy" alt="" className='tipo' src={"./Assets/Images/tipos/" + poke.types[0].type.name + ".svg"}></img>
                        {/* Se o segundo elemento existir, ele também vai ser exibido */}
                        {(poke.types[1]) ? (<img loading="lazy" alt="" className='tipo' src={"./Assets/Images/tipos/" + poke.types[1].type.name + ".svg"}></img>) : ""}
                    </p>
                </div>
                {/* Imagem do pokemon */}
                <div><img loading='lazy' alt={poke.name} src={poke.artwork}></img></div>
            </div>
        )
    }

    // Assim que o componente for montado, chama uma API para pegar todos os pokemon e seta o state
    useEffect(() => {
        document.title = 'Pokédex | Wooper'
        if (onlyOnce === 0) carregaPokemon()
    })

    const carregaPokemon = async () => {
        var pokemonArrayA = []
        await fetch('https://graphql-pokeapi.graphcdn.app/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query pokemons{
                        pokemons(limit:897,offset:0){
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
            .then((result) => pokemonArrayA = (result.data.pokemons.results));

        for (let i = 0; i < pokemonArrayA.length; i++) {
            await fetch('https://graphql-pokeapi.graphcdn.app/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                    query pokemon($name: String!){
                        pokemon(name:$name){
                                types{
                                    type{
                                        name
                                    }
                                }
                        }
                    }
            `, variables: {
                        name: pokemonArrayA[i].name
                    }
                }),
            }).then((res) => res.json())
                .then((result) => pokemonArrayA[i].types = result.data.pokemon.types);
        }
        setPokemon(pokemonArrayA)
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

export default Pokedex