// React
import React, { useEffect } from "react";

// Material UI
import { Typography, CircularProgress, TextField } from "@mui/material";

// CSS
import './pokedex.css'

var todosPokemon = []

const Pokedex = () => {
    // Define os states
    const [pokemon, setPokemon] = React.useState("");

    // Renderiza os Pokemon Individualmente
    const renderPoke = (poke) => {
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
        if (pokemon === "") carregaPokemon()
    })

    const carregaPokemon = async () => {
        var pokemonResult = []
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
        }).then((res) => res.json()).then((result) => pokemonResult = (result.data.pokemons.results));

        var arrayPoke = pokemonResult
        for (let i = 0; i < pokemonResult.length; i++) {
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
                        name: pokemonResult[i].name
                    }
                }),
            }).then((res) => res.json()).then((result) => arrayPoke[i].types = result.data.pokemon.types);
        }
        setPokemon(arrayPoke)
    }

    return (
        <>
            <>
                <div id='headerPokedex'>
                    <Typography variant='h2' align='center' gutterBottom={true}>Pokédex</Typography>
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