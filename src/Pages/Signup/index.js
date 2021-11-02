// React
import React from "react";

// Material UI
import { Button } from "@material-ui/core";
import { Box } from "@mui/system";
import { TextField, FormGroup, FormControlLabel, Switch } from "@mui/material";
import { Send } from "@mui/icons-material";

// CSS
import "./signup.css"

const Signup = () => {

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
        <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">
            <p>Cadastro</p>
            <FormGroup>
                <TextField id="outlined-basic" label="Nome" variant="outlined" />
                <TextField id="outlined-basic" label="Email" type='email' variant="outlined" />
                <TextField id="outlined-basic" label="Senha" type='password' onClick={handleClickShowPassword} variant="outlined" />
            </FormGroup>
            <FormGroup>
                <FormControlLabel control={<Switch defaultChecked />} label="Lembrar senha" />
            </FormGroup>
            <div><Button color="primary" variant="contained" endIcon={<Send />}>Login</Button></div>
        </Box>
    )
}

export default Signup