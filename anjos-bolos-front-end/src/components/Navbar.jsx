import Logo from "../assets/logo.png"
import styles from "../styles/Navbar.module.css"
import { useNavigate } from "react-router-dom";

export function Navbar(props) {
    const navigate = useNavigate();
    return(
        <nav>
            <div className={ styles.logo }>
                <img src={ Logo } alt="Logotipo Anjos Bolos" />
                {props.logado && <h4>Olá, Usuário</h4>}
            </div>

            <div className={ styles.links }>
                <button className={ styles.navlink } onClick={() => navigate('/menu')}>Menu</button>
                <button className={ styles.navlink }>Ajuda</button>
                {props.logado && <button className={ styles.navlink } onClick={() => navigate('/')}>Sair</button>}
            </div>
        </nav>
    )
}