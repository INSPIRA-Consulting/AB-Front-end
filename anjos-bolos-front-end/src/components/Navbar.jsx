import Logo from "../assets/logo.png"
import styles from "../styles/Navbar.module.css"

export function Navbar(props) {
    return(
        <nav>
            <div className={ styles.logo }>
                <img src={ Logo } alt="Logotipo Anjos Bolos" />
                {props.logado && <h4>Olá, Usuário</h4>}
            </div>

            <div className={ styles.links }>
                <button className={ styles.navlink }>Menu</button>
                <button className={ styles.navlink }>Ajuda</button>
                {props.logado && <button className={ styles.navlink }>Sair</button>}
            </div>
        </nav>
    )
}