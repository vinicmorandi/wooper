// React
import React from "react";

// Material UI
import { Typography, CircularProgress } from "@mui/material";

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
        return <div>{poke.name}</div>
    }

    // Assim que o componente for montado, chama uma API para pegar todos os pokemon e seta o state
    async componentDidMount() {
        const url = "https://pokeapi.co/api/v2/pokemon?limit=1000"
        var resposta = await fetch(url)
        var pokemon = await resposta.json()
        this.setState({ pokemon: pokemon.results, carregando: false })
    }


    render() {
        return (
            <>
                {/* Se a API ainda estiver carregando, vai aparecer uma gif, senão, os cards dos pokemon vão aparecer */}
                {this.state.carregando ? (<CircularProgress sx={{margin:'auto',display:'block'}} size='100px' color='inherit'/>) : (
                    <div>
                        <Typography variant='h2' gutterBottom='true'>Pokédex</Typography>
                        <div>{this.state.pokemon.map(this.renderPoke)}</div>
                    </div>
                )}
            </>
        )
    }
}