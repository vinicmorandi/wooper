// React
import React from "react";

// Router
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';

// Material UI
import { Box } from "@mui/system";
import { CssBaseline } from "@material-ui/core";
import { Button, Menu, MenuItem, Divider } from "@mui/material";
import { KeyboardArrowDown, Logout, CatchingPokemon, Settings } from "@mui/icons-material";

// Páginas
import Landing from "../Pages/Landing"
import Login from "../Pages/Login"
import Pokedex from '../Pages/Pokedex'
import Signup from '../Pages/Signup'
import Ranking from '../Pages/Ranking'
import Batalha from '../Pages/Batalhas'
import Times from '../Pages/Times'

// CSS
import "./navbar.css"

export default function Routes() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        if(localStorage.getItem('token')){ 
            setAnchorEl(event.currentTarget);
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const logout = () => {
        localStorage.removeItem('token');
        handleClose()
    }

    return (
        <Router>
            {/* Sidebar */}
            <Box>
                <CssBaseline />
                <header>
                    <div id='leftLanding'>
                        <p id='tituloLanding'><NavLink to='/'>Wooper</NavLink></p>
                        <p className='optLanding'><NavLink to='/pokedex'>Pokédex</NavLink></p>
                        <p className='optLanding'><NavLink to='/rankin'>Ranking</NavLink></p>
                        <p className='optLanding'><NavLink to='/'>Sussy</NavLink></p>
                        <p className='optLanding'><NavLink to='/'>Baka</NavLink></p>
                    </div>
                    <div id='rightLanding'>
                        <p id='botaoMain' onClick={handleClick}>
                            {(localStorage.getItem('token')) ? <Button size='large' endIcon={<KeyboardArrowDown/>}>{localStorage.getItem('token').replace(/"/g, '').toUpperCase()}</Button> : <NavLink to='/login'><Button size="large" variant="outlined">Entrar</Button></NavLink>}
                        </p>
                        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button', }}>
                            <MenuItem onClick={handleClose}><CatchingPokemon sx={{marginRight:'10px'}}/> <NavLink to='/times'>Meu Time</NavLink></MenuItem>
                            <MenuItem onClick={handleClose}><Settings sx={{marginRight:'10px'}}/> Configurações</MenuItem>
                            <Divider />
                            <MenuItem onClick={logout}><Logout sx={{marginRight:'10px'}}/> Sair</MenuItem>
                        </Menu>
                    </div>
                </header>
                <Box component="main">
                    {/* Rotas - Dependendo do link, será retornado um componente diferente */}
                    <Switch>
                        <Route path='/signup'>
                            <Signup></Signup>
                        </Route>
                        <Route path='/login'>
                            <Login></Login>
                        </Route>
                        <Route path='/ranking'>
                            <Ranking></Ranking>
                        </Route>
                        <Route path='/batalha'>
                            <Batalha></Batalha>
                        </Route>
                        <Route path='/pokedex'>
                            <Pokedex></Pokedex>
                        </Route>
                        <Route path='/times'>
                            <Times></Times>
                        </Route>
                        <Route path='/'>
                            <Landing></Landing>
                        </Route>
                    </Switch>
                </Box>
            </Box>
        </Router>
    );

}