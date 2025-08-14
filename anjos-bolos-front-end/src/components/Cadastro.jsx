import styles from "../styles/Formulario.module.css";
import { useState } from "react";
import axios from "axios";
import { TextBox } from "./TextBox";
import { Button } from "./Button";
import { Modal } from "./Modal";
import sucesso from "../assets/success.svg";
import erro from "../assets/error.svg"
import { Navbar } from "./Navbar";

export function Cadastro(props) {
    const [form, setForm] = useState({
        nome:"",
        email:"",
        senha:"",
        funcao:""
    })

    const [modalAberto, setModalAberto] = useState(false);
    const [modalErroAberto, setModalErroAberto] = useState(false);

    const alterarForm = e => {
        setForm({...form, [e.target.name]:e.target.value})
    }

    const cadastrar = async e => {
        e.preventDefault();

        try{
            const response = await axios.post("http://localhost:8080/usuarios/cadastro", form)
            setModalAberto(true)
        }
        catch(error) {
            console.error(error);
            setModalErroAberto(true)
        }
    }

    return(
        <><Navbar />
        <div className={styles.cadastro}>
        <div className={styles.container}>
            <h1>{props.titulo}</h1>

            <div className={styles["input-grid"]}>
                <div className={styles["input-group"]}>
                    <TextBox name="nome" label="Nome" type="text" value={form.nome} onChange={alterarForm} />
                    <TextBox name="email" label="E-mail" type="text" value={form.email} onChange={alterarForm} />
                </div>

                <div className={styles["input-group"]}>
                    <TextBox name="senha" label="Senha" type="password" value={form.senha} onChange={alterarForm} />
                    <select name="funcao" onChange={alterarForm}>
                        <option value="" selected disabled>Selecione uma opção</option>
                        <option value="ADMINISTRADOR">Administrador</option>
                        <option value="GERENTE">Gerente</option>
                        <option value="ATENDENTE">Atendente</option>
                    </select>
                </div>
            </div>

            <Button function="Cadastrar" onClick={cadastrar} />

            <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
                <h1>Cadastro Concluído</h1>
                <p>Funcionário <b>{form.nome}</b> cadastrado concluído.</p>
                <img src={sucesso} alt="" />
            </Modal>

            <Modal isOpen={modalErroAberto} onClose={() => setModalErroAberto(false)}>
                <h1>Erro ao realizar Cadastro</h1>
                <p>Verifique as informações preenchidas e tente novamente.</p>
                <img src={erro} alt="" />
            </Modal>
        </div>
        </div></>
    )
}