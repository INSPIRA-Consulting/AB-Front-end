import styles from "../styles/Formulario.module.css";
import { useState } from "react";
import axios from "axios";
import { TextBox } from "../components/TextBox";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import sucesso from "../assets/success.svg";
import erro from "../assets/error.svg"
import { Navbar } from "../components/Navbar";

export function Login(props) {
    const [form, setForm] = useState({
        email:"",
        senha:""
    })

    const [modalAberto, setModalAberto] = useState(false);
    const [modalErroAberto, setModalErroAberto] = useState(false);

    const alterarForm = e => {
        setForm({...form, [e.target.name]:e.target.value})
    }

    const acessar = async e => {
        e.preventDefault();

        try{
            const response = await axios.post("http://localhost:8080/usuarios/login", form)
            setModalAberto(true)
        }
        catch(error) {
            console.error(error);
            setModalErroAberto(true)
        }
    }
    return(
        <><Navbar />
        <div className={styles.login}>
        <div className={styles.container} style={{ width: "580px" }}>
            <h1>{props.titulo}</h1>

            <div className={styles["input-grid"]}>
                <div className={styles["input-group"]}>
                    <TextBox name="email" label="E-mail" type="text" value={form.email} onChange={alterarForm} />
                </div>

                <div className={styles["input-group"]}>
                    <TextBox name="senha" label="Senha" type="password" value={form.senha} onChange={alterarForm} />
                </div>
            </div>

            <Button function="Entrar" onClick={acessar} />

            <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
                <h1>Autenticação bem-sucedida!</h1>
                <p>Usuário auntenticado com sucesso.</p>
                <img src={sucesso} alt="" />
            </Modal>

            <Modal isOpen={modalErroAberto} onClose={() => setModalErroAberto(false)}>
                <h1>Erro ao acessar o Sistema</h1>
                <p>Verifique as informações preenchidas e tente novamente.</p>
                <img src={erro} alt="" />
            </Modal>
            </div>
        </div></>
    )
}