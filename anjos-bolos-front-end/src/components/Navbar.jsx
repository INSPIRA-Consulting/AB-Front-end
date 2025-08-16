import Logo from "../assets/logo.png"
import styles from "../styles/Navbar.module.css"

export function Navbar(props) {
    return(
        <nav>
            <div className={ styles.logo }>
                <img src={ Logo } alt="Logotipo Anjos Bolos" />
                {props.logado && <h3>Olá, Usuário</h3>}
            </div>

            <div className={ styles.links }>
                <div className={ styles.navlink }>Menu</div>
                <div className={ styles.navlink }>Ajuda</div>
                {props.logado && <div className={ styles.navlink }>Sair</div>}
            </div>
        </nav>
    )
}