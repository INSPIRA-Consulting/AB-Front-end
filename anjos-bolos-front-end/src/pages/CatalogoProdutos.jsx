import styles from "../styles/Formulario.module.css";
import { useState } from "react";
import axios from "axios";
import { TextBox } from "../components/TextBox";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import sucesso from "../assets/success.svg";
import erro from "../assets/error.svg"
import { Navbar } from "../components/Navbar";

export function CatalogoProdutos(props) {
    return (
        <>
            <Navbar />
            <div className={styles.cadastro}>
                <div className={styles.container}>
                    <h1>{props.titulo}</h1>


                </div>
            </div>
        </>
    )
}