// React
import React from "react";

// Material UI
import { Button } from "@material-ui/core";
import { Box } from "@mui/system";
import { TextField, Typography } from "@mui/material";
import { Send } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

// CSS
import "./login.css"

const Login = () => {

    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });
    
    const handleClickShowPassword = () => {
      setValues({
        ...values,
        showPassword: !values.showPassword,
      });
    };

    return (
        <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
            <p>Login</p>
            <TextField label="Email" type='email' variant="outlined" />
            <TextField label="Senha" type='password' onClick={handleClickShowPassword} variant="outlined" />
            <Typography>Não possui uma conta? <NavLink to="/signup">Crie uma agora!</NavLink></Typography>
            <div><Button color="primary" variant="contained" endIcon={<Send />}>Login</Button></div>
        </Box>
    )
}

export default Login