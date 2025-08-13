import Logo from "../assets/logo.png"
import styles from "../styles/Navbar.module.css"

export function Navbar(props) {
    return(
        <nav>
            <img src={ Logo } alt="Logotipo Anjos Bolos" />

            <div className={ styles.links}>
                <div className={ styles.navlink }>Menu</div>
                <div className={ styles.navlink }>Ajuda</div>
                <div className={ styles.navlink }>Sair</div>
            </div>
        </nav>
    )
}