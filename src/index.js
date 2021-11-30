import React from "react"
import reactDom from "react-dom"

import Routes from "./Routes/routes"

import GlobalContext from './Contexts/context'

// Apollo Client
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
} from "@apollo/client";

const client = new ApolloClient({
    uri: 'http://127.0.0.1:3001/api',
    cache: new InMemoryCache()
});

reactDom.render(
    <ApolloProvider client = {client}>
        <GlobalContext>
            <Routes />
        </GlobalContext>
    </ApolloProvider>,
    document.getElementById("root")
);