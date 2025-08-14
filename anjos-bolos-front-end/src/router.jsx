import { createBrowserRouter } from "react-router-dom";
import { Cadastro } from "./pages/Cadastro";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";

export const router = createBrowserRouter([
    {
        path: "/cadastro",
        element: <Cadastro titulo="Cadastro de Funcionário" />
    },
    {
        path: "/",
        element: <Home titulo="Home" />
    },
    {
        path: "/login",
        element: <Login titulo="Login" />
    }
])