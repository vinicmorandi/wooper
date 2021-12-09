// React
import React, { useEffect } from "react";

// Material UI
import { Typography } from "@mui/material";

// CSS
import './home.css'

// Componentes
import Card from "../../Components/Card"

const Home = () => {
    useEffect(() => {
        document.title = 'Home | Sussy'
    })

    return (
        <>
            {/* Título */}
            <div id='headerHome'>
                <Typography variant='h2' gutterBottom={true}>Seja Bem-Vindo!</Typography>
                <Typography variant='h6'>Lorem ipsum dolor sit amet</Typography>
            </div>
            {/* Cards */}
            <div className='cards'>
                <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
                <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
                <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
                <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
                <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
                <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
            </div>
        </>
    )
}

export default Home