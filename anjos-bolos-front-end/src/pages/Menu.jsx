import styles from '../styles/Menu.module.css';
import '../styles/fonts/fonts.css';
import {Navbar} from '../components/Navbar';
import caixa from '../assets/caixa-registradora.png';
import historico from '../assets/historico-de-pedidos.png';
import booking from '../assets/booking.png';
import ganhar from '../assets/ganhar-dinheiro.png';
import catalogo from '../assets/catalogo.png';
import addIcon from '../assets/add.png';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useState, useEffect } from 'react';

export function Menu(props) {
    useDocumentTitle(props.titulo);
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        // Mostrar notificação após 500ms
        const timer = setTimeout(() => {
            setShowNotification(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={styles.MenuContainer}>
            <Navbar logado={true} />
            
            {/* Card de Notificações Fixo */}
            <div 
                className={`${styles.notificationCard} ${showNotification ? styles.notificationShow : ''}`}
                onClick={() => navigate('/historico-vendas')}
            >
                <div className={styles.notificationHeader}>
                    <div className={styles.bellIconContainer}>
                        <svg className={styles.bellIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className={styles.notificationBadge}>3</span>
                    </div>
                    <h3 className={styles.notificationTitle}>Notificações</h3>
                </div>
                
                <div className={styles.notificationBody}>
                    <div className={styles.notificationItem}>
                        <div className={styles.notificationDotRed}></div>
                        <div className={styles.notificationText}>
                            <strong>1 encomenda</strong> pendente para hoje
                        </div>
                    </div>
                    
                    <div className={styles.notificationItem}>
                        <div className={styles.notificationDotOrange}></div>
                        <div className={styles.notificationText}>
                            <strong>2 encomendas</strong> pendentes
                        </div>
                    </div>

                    <div className={styles.notificationItem}>
                        <div className={styles.notificationDotOrange}></div>
                        <div className={styles.notificationText}>
                            <strong>1 pedido</strong> pendente de pagamento
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.centerContentMenu}>
                <h1 className={styles.title}>Gigante pela própria natureza!</h1>
                <div className={styles.cardGrid}>
                    <div className={styles.modernCard} onClick={() => navigate('/registro-vendas')}>
                        <img src={caixa} alt="Registrar Vendas" className={styles.cardIcon} />
                        <div className={styles.cardLabel}>Registrar Vendas</div>
                    </div>
                    <div className={styles.modernCard} onClick={() => navigate('/historico-vendas')}>
                        <img src={historico} alt="Histórico de Vendas" className={styles.cardIcon} />
                        <div className={styles.cardLabel}>Histórico de Vendas</div>
                    </div>
                    <div className={styles.modernCard} onClick={() => navigate('/encomendas')}>
                        <img src={booking} alt="Encomendas" className={styles.cardIcon} />
                        <div className={styles.cardLabel}>Encomendas</div>
                    </div>
                    <div className={styles.modernCard} onClick={() => navigate('/dash-vendas')}>
                        <img src={ganhar} alt="Painel de Métricas" className={styles.cardIcon} />
                        <div className={styles.cardLabel}>Painel de Métricas</div>
                    </div>
                    <div className={styles.modernCard} onClick={() => navigate('/catalogo-produtos')}>
                        <img src={catalogo} alt="Catálogo" className={styles.cardIcon} />
                        <div className={styles.cardLabel}>Catálogo</div>
                    </div>
                    <div className={styles.modernCard} onClick={() => navigate('/cadastro')}>
                        <img src={addIcon} alt="Cadastro de Funcionário" className={styles.cardIcon} />
                        <div className={styles.cardLabel}>Cadastro de Funcionário</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
