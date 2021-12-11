import React from 'react'


import { Button, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { Twitter, Groups } from '@mui/icons-material'

// Componentes
import Card from "../../Components/Card"

import './landing.css'

const Landing = () => {

    return (
        <>
            <div id='main'>
                <div id='leftMain'>
                    <p id='tituloMain'>LOREM IPSUM</p>
                    <p id='textoMain'>O Wooper™ é um simulador de batalhas Pokémon em tempo real! Construa seu time, batalhe contra outros jogadores, e alcance o topo do ranking! Acha que está pronto para começar a sua jornada?</p>
                    <p id='botaoMain'><NavLink to='/login'><Button size="large" variant="outlined">Comece Agora</Button></NavLink></p>
                </div>
                <div id='rightMain'>
                    <img src='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4ecb4801-6a83-443b-a903-f37be19272fc/dbwkse0-e763dcb4-ef17-4b85-bd3f-713e63ebe5f0.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzRlY2I0ODAxLTZhODMtNDQzYi1hOTAzLWYzN2JlMTkyNzJmY1wvZGJ3a3NlMC1lNzYzZGNiNC1lZjE3LTRiODUtYmQzZi03MTNlNjNlYmU1ZjAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.0inbr6tjeCYQM9MQ97xZBdPOLPDWrJPHDTSPjK2_qjs'></img>
                </div>
            </div>
            <div id='scrollCards'>
                <div id='headerHome'>
                    <Typography variant='h2' gutterBottom={true}>Seja Bem-Vindo!</Typography>
                    <Typography variant='h6'>Lorem ipsum dolor sit amet</Typography>
                </div>
                <div className='cards'>
                    <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
                    <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
                    <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
                    <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
                    <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
                    <Card img='' titulo='Teste' texto='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ligula purus' botao='Sussy'></Card>
                </div>
            </div>
            <div id='scrollContato'>
                <div id='contato'>
                    <Typography variant='h2' gutterBottom={true}>Contato</Typography>
                    <Typography variant='h6'>Entre em contato com a equipe responsável pelo Wooper™</Typography>
                </div>
                <div id='contentContato'>
                    <div id='leftContato'>
                        <img src='https://mymodernmet.com/wp/wp-content/uploads/2019/09/100k-ai-faces-5.jpg' id='imgCopyright'></img>
                    </div>
                    <div id='rightContato'>
                        <div>
                            <Twitter color='primary' fontSize='large'/>
                            <Typography variant='h4'>Siga-nos!</Typography>
                            <div>Siga @wooperBattles no Twitter e Instragram para receber atualizações, notícias, promoções, e muito mais.</div>
                        </div>
                        <div>
                            <Groups color='primary' fontSize='large'/>
                            <Typography variant='h4'>Criado por SussyBaka</Typography>
                            <div>Uma equipe de progradores brasileiros, responsável por sites como Aprenda™, Curriculum™, e NotTwitter™</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Landing