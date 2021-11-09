// React
import React, { useEffect } from "react";

// CSS
import './batalhas.css'
import Button from '@mui/material/Button'
import { LinearProgress, Typography } from "@mui/material";

const Batalha = () => {
    useEffect(() => {
        document.title = 'Batalha | Sussy'
    })

    return (
        <div id='batalhaMaster'>
            <div id='telaBatalha'>
                <div id='self'>
                    <Typography>Nome</Typography>
                    <Typography>99/100</Typography>
                    <LinearProgress variant='determinate' value = {99}></LinearProgress>
                </div>
                <div id='enemy'>
                
                </div>
            </div>
            <div id='ataquesBTL'>
                <Button className='normal ATK' variant="text">Ataque 1</Button>
                <Button className='fighting ATK' variant="text">Ataque 2</Button>
                <Button className='flying ATK' variant="text">Ataque 3</Button>
                <Button className='poison ATK' variant="text">Ataque 4</Button>
            </div>
            <div id='opcoesBTL'>
                <Button variant="text">Desistir</Button>
                <Button variant="text">Lorem</Button>
            </div>
        </div>
    );
}

export default Batalha