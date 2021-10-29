import React from "react";
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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
            <TextField id="outlined-basic" label="Email" variant="outlined" />
            <TextField id="outlined-basic" label="Senha" type='password' onClick={handleClickShowPassword} variant="outlined" />
            <FormGroup>
                <FormControlLabel control={<Switch defaultChecked />} label="Lembrar senha" />
            </FormGroup>
            <div><Button color="primary" variant="contained" endIcon={<SendIcon />}>Login</Button></div>
        </Box>
    )
}

export default Login