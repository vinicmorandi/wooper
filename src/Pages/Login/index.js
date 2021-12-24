// React
import React, { useEffect, useState } from "react";

// Material UI
import { Box } from "@mui/system";
import { TextField, Typography, Switch, FormGroup, FormControlLabel, Link as LinkMUI, Button } from "@mui/material";
import { Send } from "@mui/icons-material";

// CSS
import "./login.css"

// Apollo Client
import { useMutation, gql } from '@apollo/client';

// Query
const usuarios_query = gql`
    mutation LoginUsu ($email : String!, $senha: String!){
        loginUsu(email:$email,senha:$senha){
            id,
            nome,
            times,
        }
    }
    `;

//Login
const Login = () => {
    // Define os estados
    const [email, setEmail] = useState()
    const [senha, setSenha] = useState()
    const [loginGQL, { error, data }] = useMutation(usuarios_query)

    // Função chamada para cuidar do login
    const handleLogin = async e => {
        e.preventDefault()
        var a = await loginGQL({variables: {email: email, senha: senha }})
        if (a.data.loginUsu[0]) {
            console.log(a.data.loginUsu[0])
            const usuario = a.data.loginUsu[0]
            localStorage.setItem('usuario', JSON.stringify(usuario));
            window.location.href = "/home"
        }
    }

    // Definindo o título
    useEffect(() => {
        document.title = 'Login | Wooper'
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