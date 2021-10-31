// React
import React from "react";

// Material UI
import { Typography, Card, CardContent, CardActions, CardMedia, Button } from "@mui/material";

// CSS
import './home.css'

const Home = () => {
    return (
        <>
            {/* Título */}
            <Typography variant='h2' gutterBottom='true'>Seja Bem-Vindo!</Typography>
            <Typography variant='h6'>Lorem ipsum dolor sit amet</Typography>

            {/* Cards */}
            <div id='divCards'>
                <Card sx={{ maxWidth: 400 }}>
                    <CardMedia component="img" height="200" image="https://i.pinimg.com/originals/89/49/e5/8949e5e697ca5d75b045080343c2c8c1.jpg"/>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">Batalhas</Typography>
                        <Typography variant="body2" color="text.secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus neque ut ipsum luctus facilisis. Quisque in facilisis augue. Morbi quis velit et dolor blandit condimentum.</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Batalhar</Button>
                    </CardActions>
                </Card>
                <Card sx={{ maxWidth: 400 }}>
                    <CardMedia component="img" height="200" image="https://i.pinimg.com/originals/89/49/e5/8949e5e697ca5d75b045080343c2c8c1.jpg"/>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">Batalhas</Typography>
                        <Typography variant="body2" color="text.secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus neque ut ipsum luctus facilisis. Quisque in facilisis augue. Morbi quis velit et dolor blandit condimentum.</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Batalhar</Button>
                    </CardActions>
                </Card>
                <Card sx={{ maxWidth: 400 }}>
                    <CardMedia component="img" height="200" image="https://i.pinimg.com/originals/89/49/e5/8949e5e697ca5d75b045080343c2c8c1.jpg"/>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">Batalhas</Typography>
                        <Typography variant="body2" color="text.secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus neque ut ipsum luctus facilisis. Quisque in facilisis augue. Morbi quis velit et dolor blandit condimentum.</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Batalhar</Button>
                    </CardActions>
                </Card>
                <Card sx={{ maxWidth: 400 }}>
                    <CardMedia component="img" height="200" image="https://i.pinimg.com/originals/89/49/e5/8949e5e697ca5d75b045080343c2c8c1.jpg"/>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">Batalhas</Typography>
                        <Typography variant="body2" color="text.secondary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus neque ut ipsum luctus facilisis. Quisque in facilisis augue. Morbi quis velit et dolor blandit condimentum.</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Batalhar</Button>
                    </CardActions>
                </Card>
            </div>
        </>
    )
}

export default Home