import styles from '../styles/Home.module.css';
import '../styles/fonts/fonts.css';

export function Home() {
    return (
        <div className={styles.homeContainer}>
            <div className={styles.topButtons}>
                <button className={styles.topButton}>Login</button>
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
