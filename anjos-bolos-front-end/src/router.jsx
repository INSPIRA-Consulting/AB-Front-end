import { createBrowserRouter } from "react-router-dom";
import { Cadastro } from "./pages/Cadastro";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { RegistroVendas } from "./pages/RegistroVendas";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home titulo="Home" />
    },
    {
        path: "/cadastro",
        element: <Cadastro titulo="Cadastro de Funcionário" />
    },
    {
        path: "/registro-vendas",
        element: <RegistroVendas titulo="Registro de vendas" />
    },
    {
        path: "/login",
        element: <Login titulo="Login" />
    }
])