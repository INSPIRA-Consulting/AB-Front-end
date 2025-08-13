import "./App.css"
import { Formulario } from "./components/Formulario"
import { Formulario2 } from "./components/Formulario2"
import { Navbar } from "./components/Navbar"

export function App() {
  return(
    <div className="layout">
      <Navbar />

      <main style={{ display: "none" }}>
        <Formulario titulo="Cadastro de Funcionário"/>
      </main>

      <main style={{ display: "flex" }}>
        <Formulario2 titulo="Login"/>
      </main>
      
    </div>
  )
}