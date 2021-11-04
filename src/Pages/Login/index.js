// React
import React, { useEffect } from "react";

// Material UI
import { Button } from "@material-ui/core";
import { Box } from "@mui/system";
import { TextField, Typography, Switch, FormGroup, FormControlLabel, Link as LinkMUI } from "@mui/material";
import { Send } from "@mui/icons-material";

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

    useEffect(()=>{
        document.title = 'Login | Sussy'
    })
    
    const handleClickShowPassword = () => {
      setValues({
        ...values,
        showPassword: !values.showPassword,
      });
    };

    return (
        <Box id='login' component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
        	<Typography variant='h2' align='center' sx={{width:'100% !important'}}>Login</Typography>
            <div id='inputsLogin'>
				<TextField label="Email" type='email' variant="outlined" />
            	<TextField label="Senha" type='password' onClick={handleClickShowPassword} variant="outlined" />
            </div>
            <FormGroup sx={{width:'100% !important', display:'block'}}>
                <FormControlLabel control={<Switch defaultChecked />} label="Lembrar senha" />
            </FormGroup>
			<Typography align='center' sx={{width:'100% !important'}}>Não possui uma conta? <LinkMUI underline='none' color='primary' href='/signup'>Crie uma agora!</LinkMUI></Typography>
            <div id='botaoLogin'><Button color="primary" variant="contained" endIcon={<Send />}>Login</Button></div>
        </Box>
    )
}

export default Login