// React
import React, { useEffect } from "react";

// Material UI
import { Button } from "@material-ui/core";
import { Box } from "@mui/system";
import { TextField, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";

// CSS
import "./signup.css"

const Login = () => {

    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    useEffect(()=>{
        document.title = 'Cadastro | Sussy'
    })
    
    const handleClickShowPassword = () => {
      setValues({
        ...values,
        showPassword: !values.showPassword,
      });
    };

    return (
        <Box id='login' component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
        	<Typography variant='h2' align='center' sx={{width:'100% !important'}}>Cadastro</Typography>
            <div id='inputsLogin'>
				<TextField label="Nome" variant="outlined" />
				<TextField label="Email" type='email' variant="outlined" />
            	<TextField label="Senha" type='password' onClick={handleClickShowPassword} variant="outlined" />
            </div>
            <div id='botaoLogin'><Button color="primary" variant="contained" endIcon={<Send />}>Login</Button></div>
        </Box>
    )
}

export default Login