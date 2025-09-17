import Logo from "../assets/logo.png"
import styles from "../styles/Navbar.module.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpModal } from "./HelpModal";

export function Navbar(props) {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    const handleHelpClick = () => {
        setIsHelpModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsHelpModalOpen(false);
    };
    return(
        <>
            <nav>
                <div className={ styles.logo }>
                    <img src={ Logo } alt="Logotipo Anjos Bolos" />
                    {props.logado && <h4>Olá, Usuário</h4>}
                </div>

                <div className={ styles.links }>
                    <button className={ styles.navlink } onClick={() => navigate('/menu')}>Menu</button>
                    <button className={ styles.navlink } onClick={handleHelpClick}>Ajuda</button>
                    {props.logado && <button className={ styles.navlink } onClick={() => navigate('/')}>Sair</button>}
                </div>
            </nav>
            
            <HelpModal isOpen={isHelpModalOpen} onClose={handleCloseModal} />
        </>
    )
}