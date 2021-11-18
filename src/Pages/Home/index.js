// React
import React, { useEffect } from "react";

// Material UI
import { Typography, Card, CardContent, CardActions, CardMedia, Button, CardActionArea } from "@mui/material";

// CSS
import './home.css'

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
            <div className='divCards'>
                <Card sx={{ maxWidth: 520 }}>
                    <CardActionArea>
                        <CardMedia component="img" height="550" image="https://i.pinimg.com/736x/f2/c6/3f/f2c63f9746f7b3dec71fce0235226ac7.jpg" alt="green iguana" />
                        <CardContent>
                            <Typography gutterBottom={true} variant="h5" component="div">Lizard</Typography>
                            <Typography variant="body2" color="text.secondary">Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">Share</Button>
                    </CardActions>
                </Card>
                <Card sx={{ maxWidth: 520 }}>
                    <CardActionArea>
                        <CardMedia component="img" height="550" image="https://www.teahub.io/photos/full/95-957599_fanart-pokemon-sun-and-moon-and-mimikyu-image.gif" alt="green iguana" />
                        <CardContent>
                            <Typography gutterBottom={true} variant="h5" component="div">
                                Lizard
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">Share</Button>
                    </CardActions>
                </Card>
                <Card sx={{ maxWidth: 500 }}>
                    <CardActionArea>
                        <CardMedia component="img" height="550" image="https://i.pinimg.com/originals/ac/3c/04/ac3c048f9761eae7c58cb83800562af9.gif" alt="green iguana" />
                        <CardContent>
                            <Typography gutterBottom={true} variant="h5" component="div">
                                Lizard
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">Share</Button>
                    </CardActions>
                </Card>
            </div>
        </>
    )
}

export default Home