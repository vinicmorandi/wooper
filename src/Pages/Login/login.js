import React from "react";
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import "./login.css"

const Login = () => {
    return (
        <>
            <form>
                <p>Login</p>
                <div><input type='text' placeholder='Nome'/></div>
                <div><input type='password' placeholder='Senha'/></div>
                <div><Button color="secondary" variant="contained" endIcon={<SendIcon />}>Login</Button></div>
            </form>
        </>
    )
}

export default Login