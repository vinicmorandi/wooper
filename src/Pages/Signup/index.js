// React
import React, { useEffect, useState } from "react";

// Material UI
import { Box } from "@mui/system";
import { TextField, Typography, Button } from "@mui/material";
import { Send } from "@mui/icons-material";
import { gql, useMutation } from "@apollo/client";

// CSS
import "./signup.css"

const Login = () => {

    const cadastro_query = gql`
        mutation CriarUsuario ($nome:String!, $email:String!, $senha:String!){
            criarUsuario(nome:$nome, email:$email, senha:$senha){
                nome:nome
                email:email
                senha:senha
            }
        }      
    `
    const [cadastro] = useMutation(cadastro_query)

    useEffect(() => {
        document.title = 'Cadastro | Wooper'
    })

    const submitForm = async (e) => {
        e.preventDefault()
        await cadastro({ variables: { nome: e.target.form[0].value, email: e.target.form[2].value, senha: e.target.form[4].value } })
        window.location.href = "/login"
    }

    return (
        <Box id='login' component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
            <Typography variant='h2' align='center' sx={{ width: '100% !important' }}>Cadastro</Typography>
            <div id='inputsLogin'>
                <TextField label="Nome" variant="outlined" />
                <TextField label="Email" type='email' variant="outlined" />
                <TextField label="Senha" type='password' variant="outlined" />
            </div>
            <div id='botaoLogin'><Button color="primary" variant="contained" endIcon={<Send />} onClick={e => submitForm(e)}>Crar Conta</Button></div>
        </Box>
    )
}

export default Login