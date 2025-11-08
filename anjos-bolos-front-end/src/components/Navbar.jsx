import Logo from "../assets/logo.png"
import styles from "../styles/Navbar.module.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HelpModal } from "./HelpModal";

export function Navbar(props) {
    const navigate = useNavigate();
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('usuario');
            if (raw) setUser(JSON.parse(raw));
            else setUser(null);
        } catch (err) {
            setUser(null);
        }
    }, []);

    const handleHelpClick = () => {
        setIsHelpModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsHelpModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    }

    const handleLoginClick = () => {
        navigate('/login');
    }

    return(
        <>
            <nav>
                <div className={ styles.logo }>
                    <img src={ Logo } alt="Logotipo Anjos Bolos" />
                    {user ? <h4>Olá, {user.nome || user.name || user.email || 'Usuário'}</h4> : props.logado && <h4>Olá, Usuário</h4>}
                </div>

                <div className={ styles.links }>
                    {!props.hideMenuButton && <button className={ styles.navlink } onClick={() => navigate('/menu')}>Menu</button>}
                    <button className={ styles.navlink } onClick={handleHelpClick}>Ajuda</button>
                    {user ? (
                        <button className={ styles.navlink } onClick={handleLogout}>Sair</button>
                    ) : (
                        <button className={ styles.navlink } onClick={handleLoginClick}>Entrar</button>
                    )}
                </div>
            </nav>
            
            <HelpModal isOpen={isHelpModalOpen} onClose={handleCloseModal} />
        </>
    )
}