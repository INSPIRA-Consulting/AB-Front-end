import styles from '../styles/Home.module.css';
import '../styles/fonts/fonts.css';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();
    return (
        <div className={styles.homeContainer}>
            <div className={styles.topButtons}>
                <button className={styles.topButton} onClick={() => navigate('/login')}>Login</button>
                <button className={styles.topButton}>Ajuda</button>
            </div>
            <div className={styles.centerContent}>
                <h1 className={styles.title}>Boas Vindas!</h1>
                <div className={styles.subtitle}>O bolo da anjos bolos é...</div>
                <div className={styles.subtitle}>Uma delícia!</div>
            </div>
        </div>
    );
}
