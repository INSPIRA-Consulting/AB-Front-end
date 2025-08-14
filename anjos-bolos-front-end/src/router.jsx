import { createBrowserRouter } from "react-router-dom";
import { Cadastro } from "./components/Cadastro";
import { Login } from "./components/Login";

export const router = createBrowserRouter([
    {
        path: "/cadastro",
        element: <Cadastro titulo="Cadastro de Funcionário" />
    },
    {
        path: "/login",
        element: <Login titulo="Login" />
    }
])