import { Button } from '@mui/material'
import React from 'react'

const Card = (props) => {
    return (
        <div className='cardHome'>
            <div className='cardTop'>
                <div className='cardImg'>
                    <img alt='' src={props.img} class='imgCard'></img>
                </div>
                <div className='cardTitle'>
                    {props.titulo}
                </div>
            </div>
            <div className='cardContent'>
                <div className='cardText'>
                    {props.texto}
                </div>
                <div className='cardButton'>
                    <Button variant="outlined">{props.botao}</Button>
                </div>
            </div>
        </div>
    )
}

export default Card