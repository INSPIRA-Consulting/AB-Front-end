import styles from '../styles/DashSidebar.module.css';
import { PiChefHatThin } from "react-icons/pi";
import { GiPieSlice } from "react-icons/gi";
import { FaCalculator } from "react-icons/fa6";
import { FaMoneyBillWave } from "react-icons/fa";

export function DashSidebar({ activeItem = 'vendas' }) {
    return (
        <aside className={styles.dashSidebar}>
            <div className={styles.sidebarLogo}>
                <span><PiChefHatThin color="#8B5C2A" size={55} /></span>
            </div>
            <ul className={styles.sidebarMenu}>
                <li className={activeItem === 'vendas' ? styles.active : ''}>
                    {/* Ícone vendas */}
                    <span className={styles.sidebarIcon + ' ' + styles.vendasIcon}><FaMoneyBillWave color="#4d2c0c" size={30} /></span>
                    <span>Vendas</span>
                </li>
                <li className={activeItem === 'produto' ? styles.active : ''}>
                    {/* Ícone produto */}
                    <span className={styles.sidebarIcon}><GiPieSlice color="#4d2c0c" size={35} /></span>
                    <span>Produto</span>
                </li>
                <li className={activeItem === 'financas' ? styles.active : ''}>
                    {/* Ícone finanças */}
                    <span className={styles.sidebarIcon}><FaCalculator color="#4d2c0c" size={30} /></span>
                    <span>Finanças</span>
                </li>
            </ul>
        </aside>
    );
}
