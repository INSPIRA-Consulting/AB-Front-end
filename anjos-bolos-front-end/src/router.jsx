import { createBrowserRouter } from "react-router-dom";
import { Cadastro } from "./pages/Cadastro";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { RegistroVendas } from "./pages/RegistroVendas";
import { RegistroIngredientes } from "./pages/RegistroIngredientes";
import { Menu } from "./pages/Menu";
import { DashVendas } from "./pages/DashVendas";
import { DashProdutos } from "./pages/DashProdutos";
import { DashFinancas } from "./pages/DashFinancas";

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
    },
    {
        path: "/registro-ingredientes",
        element: <RegistroIngredientes titulo="Registro de Ingredientes" />
    },
    {
        path: "/menu",
        element: <Menu titulo="Menu" />
    },
    {
        path: "/DashVendas",
        element: <DashVendas titulo="Dashboard de Vendas" />
    },
    {
        path: "/DashProdutos",
        element: <DashProdutos titulo="Dashboard de Produtos" />
    },
    {
        path: "/DashFinancas",
        element: <DashFinancas titulo="Dashboard de Finanças" />
    }
])