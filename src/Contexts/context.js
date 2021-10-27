import { createContext, useState } from "react";

export const Context = createContext("");

export default function GlobalContext({ children }) {
    return (
        <Context.Provider
            value={{ token }}
        >
            {children}
        </Context.Provider>
    );
}