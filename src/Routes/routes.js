import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from "../Pages/Home/home"
import Login from "../Pages/Login/login"
import "../Assets/css/navbar.css"

export default function Routes() {
    return (
        <Router>
            {/* Navbar */}
            <div id='sidebar'>
                <Link to='/'>Home</Link>
                <Link to='/'>Pokedex</Link>
                <Link to='/'>AAA</Link>
                <Link to='/'>BBB</Link>
                <Link to='/login'>Login</Link>
            </div>

            {/* Rotas */}
            <Switch>
                <Route path='/login'>
                    <Login></Login>
                </Route>
                <Route path='/'>
                    <Home></Home>
                </Route>
            </Switch>
        </Router>
    );
}