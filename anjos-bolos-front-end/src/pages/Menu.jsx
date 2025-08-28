import styles from '../styles/Menu.module.css';
import '../styles/fonts/fonts.css';
import {Navbar} from '../components/Navbar';
import caixa from '../assets/caixa-registradora.png';
import historico from '../assets/historico-de-pedidos.png';
import ganhar from '../assets/ganhar-dinheiro.png';
import catalogo from '../assets/catalogo.png';

export function Menu() {
    return (
        <div className={styles.MenuContainer}>
            <Navbar logado={true} />
            <div className={styles.centerContentMenu}>
                <h1 className={styles.title}>Gigante pela própria natureza!</h1>
                <div className={styles.cardGrid}>
                    <div className={styles.card1}>
                        <img src={caixa} alt="Registrar Vendas" className={styles.cardIcon} />
                        <div className={styles.cardLabel1}>Registrar Vendas</div>
                    </div>
                    <div className={styles.card2}>
                        <img src={historico} alt="Histórico de Vendas" className={styles.cardIcon} />
                        <div className={styles.cardLabel2}>Histórico de Vendas</div>
                    </div>
                    <div className={styles.card3}>
                        <img src={ganhar} alt="Painel de Métricas" className={styles.cardIcon} />
                        <div className={styles.cardLabel3}>Painel de Métricas</div>
                    </div>
                    <div className={styles.card4}>
                        <img src={catalogo} alt="Catálogo" className={styles.cardIcon} />
                        <div className={styles.cardLabel4}>Catálogo</div>
                    </div>
                </div>
                <div className={styles.buttonGrid}>
                    <button className={styles.menuButton + ' ' + styles.fullButton}>Cadastro de Funcionário</button>
                </div>
            </div>
        </div>
    );
}
