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
        if (onlyOnce === 0) carregaPokemon()
    })

    const carregaPokemon = async () => {
        // Pega os primeiros 150 primeiros pokemon e adiciona no array geral - a API que eu to usando é BEM ineficiente, então eu vou usar isso por enquanto, mas vou mudar dps
        for (let i = 1; i < 150; i++) {
            let url = "https://pokeapi.co/api/v2/pokemon/" + i;
            var resposta = await fetch(url);
            todosPokemon[i] = await resposta.json();
        }
        onlyOnce++
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

export default Pokedex