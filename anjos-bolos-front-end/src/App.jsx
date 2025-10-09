import { RouterProvider } from "react-router-dom"
import "./App.css"
import { Cadastro } from "./pages/Cadastro"
import { Login } from "./pages/Login"
import { Navbar } from "./components/Navbar"
import { router } from "./router"

export function App() {
  return(
    <RouterProvider router={router}/>
  )
}