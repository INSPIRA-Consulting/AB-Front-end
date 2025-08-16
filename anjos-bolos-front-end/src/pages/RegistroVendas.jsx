import { Button } from "../components/Button";
import { Navbar } from "../components/Navbar";
import styles from "../styles/RegistroVendas.module.css";

export function RegistroVendas() {
    return (
        <div className={styles.container}>
            <Navbar logado={true} />
            <h1>Registro de Vendas</h1>
            <div className={styles.labelFiltro}>
                <div>
                    <h4>Tipo de venda</h4>
                    <select name="" id="">
                        <option value="">Pronta-Entrega</option>
                        <option value="">Encomenda</option>
                    </select>
                </div>
                <button disabled>Registrar</button>
            </div>
        </div>
    )
}
