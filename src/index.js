// React
import React from "react"
import reactDom from "react-dom"

// Rotas
import Routes from "./Routes/routes"

// Context
import GlobalContext from './Contexts/context'

// Apollo Client
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider
} from "@apollo/client";

// Conexão com o Apollo
const client = new ApolloClient({
    uri: 'http://127.0.0.1:3001/api',
    cache: new InMemoryCache()
});

// Renderização do documento
reactDom.render(
    <ApolloProvider client={client}>
        <GlobalContext>
            <Routes />
        </GlobalContext>
    </ApolloProvider>,
    document.getElementById("root")
);