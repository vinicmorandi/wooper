import React from "react"
import reactDom from "react-dom"
import Routes from "./Routes/routes"
import GlobalContext from './Contexts/context'

reactDom.render(
    <GlobalContext>
        <Routes />,
    </GlobalContext>,
    document.getElementById("root")
);