import styles from "../styles/Formulario.module.css";
import { useState } from "react";
import api from "../provider/api";
import { TextBox } from "../components/TextBox";
import { Button } from "../components/Button";
import { ModernToast } from "../components/ModernToast";
import { Navbar } from "../components/Navbar";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function Cadastro(props) {
    useDocumentTitle(props.titulo);
    const [form, setForm] = useState({
        nome: "",
        email: "",
        senha: "",
        funcao: "",
        cpf: "",
        telefone: ""
    })

    const [toastSucesso, setToastSucesso] = useState(false);
    const [toastErro, setToastErro] = useState(false);


    // Máscara para CPF: 000.000.000-00
    function maskCPF(value) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
            .slice(0, 14);
    }

    // Máscara para telefone: (00) 00000-0000
    function maskTelefone(value) {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .slice(0, 15);
    }

    const alterarForm = e => {
        let value = e.target.value;
        if (e.target.name === "cpf") {
            value = maskCPF(value);
        }
        if (e.target.name === "telefone") {
            value = maskTelefone(value);
        }
        setForm({ ...form, [e.target.name]: value });
    }

    const cadastrar = async e => {
        e.preventDefault();

        try{
            const response = await api.post(`/usuarios`, form)
            setToastSucesso(true)
        }
        catch(error) {
            console.error(error);
            setToastErro(true)
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
                    <TextBox name="cpf" label="CPF" type="text" value={form.cpf} onChange={alterarForm} maxLength={14} />
                    <TextBox name="telefone" label="Telefone" type="text" value={form.telefone} onChange={alterarForm} maxLength={15} />
                </div>
                <div className={styles["input-group"]}>
                    <TextBox name="senha" label="Senha" type="password" value={form.senha} onChange={alterarForm} />
                    <select name="funcao" onChange={alterarForm} value={form.funcao}>
                        <option value="" disabled>Selecione uma opção</option>
                        <option value="ADMINISTRADOR">Administrador</option>
                        <option value="GERENTE">Gerente</option>
                        <option value="ATENDENTE">Atendente</option>
                    </select>
                </div>
            </div>

            <Button function="Cadastrar" onClick={cadastrar} />

            <ModernToast 
                isOpen={toastSucesso}
                message={`Funcionário ${form.nome} cadastrado com sucesso!`}
                type="success"
            />

            <ModernToast 
                isOpen={toastErro}
                message="Erro ao realizar cadastro. Verifique as informações e tente novamente."
                type="error"
            />
        </div>
        </div></>
    )
}