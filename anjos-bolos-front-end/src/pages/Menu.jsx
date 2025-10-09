import styles from '../styles/Menu.module.css';
import '../styles/fonts/fonts.css';
import {Navbar} from '../components/Navbar';
import caixa from '../assets/caixa-registradora.png';
import historico from '../assets/historico-de-pedidos.png';
import ganhar from '../assets/ganhar-dinheiro.png';
import catalogo from '../assets/catalogo.png';
import { useNavigate } from 'react-router-dom';

export function Menu() {
    const navigate = useNavigate();
    return (
        <div className={styles.MenuContainer}>
            <Navbar logado={true} />
            <div className={styles.centerContentMenu}>
                <h1 className={styles.title}>Gigante pela própria natureza!</h1>
                <div className={styles.cardGrid}>
                    <div className={styles.card1} onClick={() => navigate('/registro-vendas')} style={{cursor:'pointer'}}>
                        <img src={caixa} alt="Registrar Vendas" className={styles.cardIcon} />
                        <div className={styles.cardLabel1}>Registrar Vendas</div>
                    </div>
                    <div className={styles.card2} onClick={() => navigate('/historico-vendas')} style={{cursor:'pointer'}}>
                        <img src={historico} alt="Histórico de Vendas" className={styles.cardIcon} />
                        <div className={styles.cardLabel2}>Histórico de Vendas</div>
                    </div>
                    <div className={styles.card3} onClick={() => navigate('/dash-vendas')} style={{cursor:'pointer'}}>
                        <img src={ganhar} alt="Painel de Métricas" className={styles.cardIcon} />
                        <div className={styles.cardLabel3}>Painel de Métricas</div>
                    </div>
                    <div className={styles.card4} onClick={() => navigate('/catalogo-produtos')} style={{cursor:'pointer'}}>
                        <img src={catalogo} alt="Catálogo" className={styles.cardIcon} />
                        <div className={styles.cardLabel4}>Catálogo</div>
                    </div>
                </div>
                <div className={styles.buttonGrid}>
                    <button 
                        className={styles.menuButton + ' ' + styles.fullButton}
                        onClick={() => navigate('/cadastro')}
                        style={{cursor:'pointer'}}
                    >
                        Cadastro de Funcionário
                    </button>
                </div>
            </div>
        </div>
    );
}
