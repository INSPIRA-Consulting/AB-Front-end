import styles from "../styles/CatalogoProdutos.module.css";

export function DataTable({ headers, data, renderRow }) {
    return (
        <div className={styles.tableSection}>
            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    {headers.map((header, index) => (
                        <div key={index} className={styles.tableHeaderCell}>{header}</div>
                    ))}
                </div>
                <div className={styles.tableBody}>
                    {data.map((item, index) => (
                        <div key={index} className={styles.tableRow}>
                            {renderRow(item)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
