import React from 'react';


export default async function Pokemon(){
    var pokemon = [];
    for (let i = 1; i < 10; i++) {
        let url = "https://pokeapi.co/api/v2/pokemon/" + i;
        var resposta = await fetch(url);
        pokemon[i] = await resposta.json();
    }
    if(pokemon){
        return pokemon
    }
}