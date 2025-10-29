import { RouterProvider } from "react-router-dom"
import "./App.css"
import { Cadastro } from "./pages/Cadastro"
import { Login } from "./pages/Login"
import { Navbar } from "./components/Navbar"
import { router } from "./router"
import { ToastProvider } from "./components/Toast"

export function App() {
  return(
    <ToastProvider>
      <RouterProvider router={router}/>
    </ToastProvider>
  )
}