import { RouterProvider } from "react-router-dom"
import "./App.css"
import { Cadastro } from "./components/Cadastro"
import { Login } from "./components/Login"
import { Navbar } from "./components/Navbar"
import { router } from "./router"

export function App() {
  return(
    <RouterProvider router={router}/>
  )
}