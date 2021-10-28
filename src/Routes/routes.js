import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Home from "../Pages/Home/home"
import Login from "../Pages/Login/login"
import "../Assets/css/navbar.css"

export default function Routes() {
    return (
        <Router>
            {/* Navbar */}
            <AppBar position="static">
            <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" component="div">
                    <Link to="Login">Login</Link>
                </Typography>
            </Toolbar>
            </AppBar>
            <div className='principal'>
                {/* Rotas */}
                <Switch>
                    <Route path='/login'>
                        <Login></Login>
                    </Route>
                    <Route path='/'>
                        <Home></Home>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}