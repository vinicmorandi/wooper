import React from "react";
import Button from "../../Components/Button/button"

const Login = () => {
    return (
        <>
            <form>
                <input type='text' placeholder='Nome'/>
                <input type='password' placeholder='Senha'/>
                <Button Descricao='Entrar'></Button>
            </form>
        </>
    )
}

export default Login