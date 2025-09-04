import { useState } from "react";
import axios from "axios";
import { Button } from "../components/Button";
import { Navbar } from "../components/Navbar";
import styles from "../styles/CatalogoProdutos.module.css";
import { Produto } from "../components/Produto";


export function CatalogoProdutos() {
    const [isButtonActive, setIsButtonActive] = useState(false);

    return (
        <div className={styles.container}>
            <Navbar logado={true} />
            <h1>Catálogo de Produtos</h1>
            <div className={styles.labelFiltro}>
                <div>
                    <h4>Tipo de venda</h4>
                    <select name="" id="">
                        <option value="">Pronta-Entrega</option>
                        <option value="">Encomenda</option>
                    </select>
                </div>
                <button disabled={!isButtonActive} className={!isButtonActive ? styles.inactiveButton : ''}>
                    Registrar
                </button>
            </div>
            <div className={styles.filtro}>
                <h4>Filtrar por categorias</h4>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="categoria"
                            value="tradicionais"
                            defaultChecked />
                        Bolos Tradicionais
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="categoria"
                            value="bebidas" />
                        Bebidas
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="categoria"
                            value="salgados" />
                        Salgados
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="categoria"
                            value="pote" />
                        Bolos de Pote
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="categoria"
                            value="festa" />
                        Bolos de Festa
                    </label>
                </div>
            </div>

        </div>
    )
}