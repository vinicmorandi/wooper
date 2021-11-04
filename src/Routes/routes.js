// React
import React from "react";

// Router
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom';

// Material UI
import { styled } from '@mui/material/styles';
import { Box } from "@mui/system";
import { CssBaseline } from "@material-ui/core";
import { IconButton, Drawer, Divider, List, ListItem, ListItemText, ListItemIcon, Tooltip } from "@mui/material";
import { AccountCircle, Home as HomeIcon, Menu, ChevronLeft, AllOut, ListAlt, Settings, HeadsetMic } from "@material-ui/icons";
import { AlignHorizontalLeft } from "@mui/icons-material";
import CatchingPokemonTwoToneIcon from '@mui/icons-material/CatchingPokemonTwoTone';

// Páginas
import Home from "../Pages/Home"
import Login from "../Pages/Login"
import Pokedex from '../Pages/Pokedex'
import Signup from '../Pages/Signup'

// CSS
import "./navbar.css"

// Tamanho da Sidebar
const drawerWidth = 240;

// Sidebar Aberta
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

// Sidebar Fechada
const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

// Header da Sidebar
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

// Definindo a Sidebar
const Drawer2 = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

// Exportando a Sidebar
export default function Routes() {

    // Seta o state da Sidebar - Aberta ou Fechada
    const [open, setOpen] = React.useState(false);
    const handleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Router>
            {/* Sidebar */}
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Drawer2 className="drawer" variant="permanent" open={open}>
                    <DrawerHeader id='iconeMenu'>
                        <IconButton onClick={handleDrawer}>
                            {/* Se a Sidebar estiver fechada, aparecerá o ícone de Menu, senão, aparecerá uma flecha para a esquerda */}
                            {open === true ? <ChevronLeft /> : <Menu />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider sx={{ 'borderColor': "rgba(255, 255, 255, 0.3)" }} />
                    <List>
                        <NavLink className='iconesSidebar' to="/">
                            <ListItem button className={open === true ? "a" : "iconesSidebarAtivos"} key="Home">
                                <ListItemIcon>
                                    <Tooltip title="Home" placement="right-start">
                                        <HomeIcon />
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItem>
                        </NavLink>
                        <NavLink className='iconesSidebar' to="/pokedex">
                            <ListItem button className={open === true ? "a" : "iconesSidebarAtivos"} key="Pokedex">
                                <ListItemIcon>
                                    <Tooltip title="Pokédex" placement="right-start">
                                        <CatchingPokemonTwoToneIcon />
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText primary="Pokédex" />
                            </ListItem>
                        </NavLink>
                        <div className='iconesSidebar'>
                            <ListItem button className={open === true ? "a" : "iconesSidebarAtivos"} key="Batalhas">
                                <ListItemIcon>
                                    <Tooltip title="Batalhas" placement="right-start">
                                        <AllOut />
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText primary="Batalhas" />
                            </ListItem>
                        </div>
                        <NavLink className='iconesSidebar' to="/ranking">
                            <ListItem button className={open === true ? "a" : "iconesSidebarAtivos"} key="Pokedex">
                                <ListItemIcon>
                                    <Tooltip title="Ranking" placement="right-start">
                                        <AlignHorizontalLeft />
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText primary="Ranking" />
                            </ListItem>
                        </NavLink>
                    </List>
                    <Divider sx={{ 'borderColor': "rgba(255, 255, 255, 0.3)" }} />
                    <List>
                        <NavLink className='iconesSidebar' to="/configuracoes">
                            <ListItem button className={open === true ? "a" : "iconesSidebarAtivos"} key="Login">
                                <ListItemIcon>
                                    <Tooltip title="Configurações" placement="right-start">
                                        <Settings />
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText primary="Configurações" />
                            </ListItem>
                        </NavLink>
                        <NavLink className='iconesSidebar' to="/contato">
                            <ListItem button className={open === true ? "a" : "iconesSidebarAtivos"} key="Login">
                                <ListItemIcon>
                                    <Tooltip title="SAC" placement="right-start">
                                        <HeadsetMic />
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText primary="SAC" />
                            </ListItem>
                        </NavLink>
                    </List>
                    <Divider sx={{ 'borderColor': "rgba(255, 255, 255, 0.3)" }} />
                    <List>
                        <NavLink className='iconesSidebar' to="/times">
                            <ListItem button className={open === true ? "a" : "iconesSidebarAtivos"} key="Login">
                                <ListItemIcon>
                                    <Tooltip title="Times" placement="right-start">
                                        <ListAlt />
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText primary="Times" />
                            </ListItem>
                        </NavLink>
                        <NavLink className='iconesSidebar' to="/Login">
                            <ListItem button className={open === true ? "a" : "iconesSidebarAtivos"} key="Login">
                                <ListItemIcon>
                                    <Tooltip title="Login" placement="right-start">
                                        <AccountCircle />
                                    </Tooltip>
                                </ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItem>
                        </NavLink>
                    </List>
                </Drawer2>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    {/* Rotas - Dependendo do link, será retornado um componente diferente */}
                    <Switch>
                        <Route path='/signup'>
                            <Signup></Signup>
                        </Route>
                        <Route path='/login'>
                            <Login></Login>
                        </Route>
                        <Route path='/pokedex'>
                            <Pokedex></Pokedex>
                        </Route>
                        <Route path='/'>
                            <Home></Home>
                        </Route>
                    </Switch>
                </Box>
            </Box>
        </Router>
    );

}