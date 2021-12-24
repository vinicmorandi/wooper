import { createContext } from "react";

export const Usuario = createContext("");

export default function GlobalContext({ children }) {
    return (
        <Usuario.Provider
            value="sus"
        >
            {children}
        </Usuario.Provider>
    );
}