// React
import React from "react";

// Material UI
import { Typography, CircularProgress, TextField } from "@mui/material";

// CSS
import './pokedex.css'

export default class Pokedex extends React.Component {
    // Define os states
    state = {
        carregando: true,
        pokemon: null,
    }

    // Renderiza os Pokemon Individualmente
    renderPoke = (poke) => {
        let url = "./Assets/Images/pokemons/" + poke.id.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false }) + poke.species.name + ".png";
        let classes = "pokemon " + poke.types[0].type.name
        let urlTipo1 = "./Assets/Images/tipos/"+poke.types[0].type.name+".svg"
        let elementoTipo2 = "";
        if(poke.types[1]){
            let urlTipo2 = "./Assets/Images/tipos/"+poke.types[1].type.name+".svg"
            elementoTipo2 = <img loading="lazy" alt="" className='tipo' src={urlTipo2}></img>
        }
        return (
            <div className={classes} key={poke.id}>
                <div>
                    <p>#{poke.id}</p>
                    <p className='nomePoke'>{poke.species.name}</p>
                    <p>
                        <img loading="lazy" alt="" className='tipo' src={urlTipo1}></img>
                        {elementoTipo2}
                    </p>
                </div>
                <div><img loading='lazy' alt={poke.species.name} src={url}></img></div>
            </div>
        )
    }

    // Assim que o componente for montado, chama uma API para pegar todos os pokemon e seta o state
    async componentDidMount() {
        var pokemon = [];
        for (let i = 1; i < 810; i++) {
            let url = "https://pokeapi.co/api/v2/pokemon/" + i;
            var resposta = await fetch(url);
            pokemon[i] = await resposta.json();
        }
        this.setState({ pokemon: pokemon, carregando: false })
    }


    render() {
        return (
            <>
                {/* Se a API ainda estiver carregando, vai aparecer uma gif, senão, os cards dos pokemon vão aparecer */}
                {this.state.carregando ? (<CircularProgress sx={{ margin: 'auto', display: 'block' }} thickness={1} size='100px' color='inherit' />) : (
                    <>
                        <div id='headerPokedex'>
                            <Typography variant='h2' align='center' gutterBottom={true}>Pokédex</Typography>
                            <TextField label="Pesquisar" variant='outlined'/>
                        </div>
                        <div id='pokedex'>
                            {this.state.pokemon.map(this.renderPoke)}
                        </div>
                    </>
                )}
            </>
        )
    }
}