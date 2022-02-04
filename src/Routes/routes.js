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
import Landing from "../Pages/Landing";
import Login from "../Pages/Login";
import Pokedex from '../Pages/Pokedex';
import Signup from '../Pages/Signup';
import Ranking from '../Pages/Ranking';
import Batalha from '../Pages/Batalhas';
import Times from '../Pages/Times';
import PVP from "../Pages/PVP";

// CSS
import "./navbar.css";

export default function Routes() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [abaAtiva, setAbaAtiva] = React.useState('');
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAbaAtiva('');
        if (localStorage.getItem('usuario')) {
            setAnchorEl(event.currentTarget);
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const logout = () => {
        localStorage.removeItem('usuario');
        handleClose();
    };

    var usuario = JSON.parse(localStorage.getItem('usuario'));

    return (
        <Router>
            {/* Sidebar */}
            <Box>
                <CssBaseline />
                <header>
                    <div id='leftLanding'>
                        <p><NavLink id='tituloLanding' to='/'>Wooper</NavLink></p>
                        <p className={(abaAtiva === 'poke') ? 'ativo' : 'optLanding'}><NavLink to='/pokedex' onClick={() => { setAbaAtiva('poke'); }}>Pokédex</NavLink></p>
                        <p className={(abaAtiva === 'ranking') ? 'ativo' : 'optLanding'}><NavLink to='/ranking' onClick={() => { setAbaAtiva('ranking'); }}>Ranking</NavLink></p>
                        {(usuario) ? (usuario.times) ?
                            <>
                                <p className={(abaAtiva === 'batalhas') ? 'ativo' : 'optLanding'}><NavLink to='/batalha' onClick={() => { setAbaAtiva('batalhas'); }}>PVE</NavLink></p>
                                <p className={(abaAtiva === 'pvp') ? 'ativo' : 'optLanding'}><NavLink to='/pvp' onClick={() => { setAbaAtiva('pvp'); }}>PVP</NavLink></p>
                            </>
                            : "" : ""}
                    </div>
                    <div id='rightLanding'>
                        <p id='botaoMain' onClick={handleClick}>
                            {(usuario) ? <Button size='large' endIcon={<KeyboardArrowDown />}>{usuario.nome.toUpperCase()}</Button> : <><NavLink to='/signup'><Button size="large" variant="outlined" sx={{ marginRight: '10px' }}>Cadastro</Button></NavLink><NavLink to='/login'><Button size="large" variant="contained">Entrar</Button></NavLink></>}
                        </p>
                        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button', }}>
                            <MenuItem onClick={handleClose}><CatchingPokemon sx={{ marginRight: '10px' }} /> <NavLink to='/times'>Meu Time</NavLink></MenuItem>
                            <MenuItem onClick={handleClose}><Settings sx={{ marginRight: '10px' }} /> Configurações</MenuItem>
                            <Divider />
                            <MenuItem onClick={logout}><Logout sx={{ marginRight: '10px' }} /> Sair</MenuItem>
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
                        <Route path='/pvp'>
                            <PVP></PVP>
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