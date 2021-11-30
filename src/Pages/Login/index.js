// React
import React, { useEffect, useState } from "react";

// Material UI
import { Box } from "@mui/system";
import { TextField, Typography, Switch, FormGroup, FormControlLabel, Link as LinkMUI, Button } from "@mui/material";
import { Send } from "@mui/icons-material";

// CSS
import "./login.css"

// Apollo Client
import { useQuery, gql } from '@apollo/client';

const usuarios_query = gql`
    query usuariosEmail ($email: String!, $senha: String!){
        usuariosEmail (email: $email, senha: $senha) {
            id
            nome
        }
    }
`;

//Login
const Login = ({ setToken }) => {
    const [email,setEmail] = useState()
    const [senha,setSenha] = useState()
    var usuarios = useQuery(usuarios_query,{variables:{email,senha}})

    const handleLogin = async e => {
        e.preventDefault()
        if(usuarios.data.usuariosEmail[0].id){
            const token = usuarios.data.usuariosEmail[0].id
            setToken(token)
            console.log(token)
            sessionStorage.setItem('token', JSON.stringify(token));
        }
    }

    useEffect(() => {
        document.title = 'Login | Sussy'
    })

    return (
        <Box id='login' component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
            <Typography variant='h2' align='center' sx={{ width: '100% !important' }}>Login</Typography>
            <div id='inputsLogin'>
                <TextField label="Email" onChange={e => setEmail(e.target.value)} type='email' variant="outlined" />
                <TextField label="Senha" onChange={e => setSenha(e.target.value)} type='password' variant="outlined" />
            </div>
            <FormGroup sx={{ width: '100% !important', display: 'block' }}>
                <FormControlLabel control={<Switch defaultChecked />} label="Lembrar senha" />
            </FormGroup>
            <Typography align='center' sx={{ width: '100% !important' }}>Não possui uma conta? <LinkMUI underline='none' color='primary' href='/signup'>Crie uma agora!</LinkMUI></Typography>
            <div id='botaoLogin'><Button color="primary" variant="contained" onClick={e => handleLogin(e)} endIcon={<Send />}>Login</Button></div>
        </Box>
    )
}

export default Login