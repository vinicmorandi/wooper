import React from "react";
import { Component } from "react";
import "./button.css"

class Button extends Component{
    render(){
        return(
            <button class='botao'>{this.props.Descricao}</button>
        )
    }
}

export default Button