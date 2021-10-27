import React from "react"
import reactDom from "react-dom"
import Routes from "./Routes/routes"

reactDom.render(
    //<GlobalContext>
      <Routes />,
    //</GlobalContext>,
    document.getElementById("root")
);