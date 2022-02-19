import React from 'react';


import { Button, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Twitter, Groups } from '@mui/icons-material';

import './landing.css';

const Landing = () => {

    return (
        <>
            <div id='main'>
                <div id='leftMain'>
                    <p id='tituloMain'>Batalhe com Qualquer Pessoa, em Qualquer Lugar</p>
                    <p id='textoMain'>O <span className='destaque'>Wooper™</span> é um simulador de batalhas Pokémon em tempo real! Construa seu time, batalhe contra outros jogadores, e alcance o topo do ranking! Acha que está pronto para começar a sua jornada?</p>
                    <p id='botaoMain'><NavLink to='/pvp'><Button size="large" variant="contained">Comece Agora</Button></NavLink></p>
                </div>
                <div id='rightMain'>
                    <img src='Assets/Images/unDraw/prog.svg' alt='' height='700px'></img>
                </div>
            </div>
            <div id='scrollContato'>
                <div id='contato'>
                    <Typography variant='h2' gutterBottom={true}>Contato</Typography>
                    <Typography variant='h6'>Entre em contato com a equipe responsável pelo <span className='destaque'>Wooper™</span></Typography>
                </div>
                <div id='contentContato'>
                    <div id='leftContato'>
                        <img src='Assets/Images/unDraw/time.svg' alt='' id='imgCopyright'></img>
                    </div>
                    <div id='rightContato'>
                        <div>
                            <Twitter color='primary' fontSize='large' />
                            <Typography variant='h4'>Siga-nos!</Typography>
                            <div>Siga <span className='destaque'>@wooperBattles</span> no Twitter e Instragram para receber atualizações, notícias, promoções, e muito mais.</div>
                        </div>
                        <div>
                            <Groups color='primary' fontSize='large' />
                            <Typography variant='h4'>Criado por SussyBaka</Typography>
                            <div>Uma equipe de progradores brasileiros, responsável por sites como <span className='destaque'>Aprenda™</span>, <span className='destaque'>Curriculum™</span>, e <span className='destaque'>NotTwitter™</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Landing;