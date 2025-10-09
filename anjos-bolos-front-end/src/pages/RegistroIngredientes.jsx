import styles from "../styles/RegistroIngredientes.module.css";
import { useState } from "react";
import axios from "axios";
import { TextBox } from "../components/TextBox";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import sucesso from "../assets/success.svg";
import erro from "../assets/error.svg"
import { Navbar } from "../components/Navbar";

export function RegistroIngredientes(props) {
    //  Teste
    const [nome, setNome] = useState("");
    const [medida, setMedida] = useState("");
    const [valor, setValor] = useState("");
    const [quantidade, setQuantidade] = useState("");


    const salvar = async e => {
        e.preventDefault();

        let quantidadeConvertida = quantidade;

        if (medida === "quilograma" || medida === "mililitro") {
            quantidadeConvertida = quantidade * 1000;
        }
        
        axios.post(`${import.meta.env.VITE_API_URL}/ingredientes`, {
            nome: nome,
            valorEmbalagem: valor,
            quantidadeEmbalagem: quantidadeConvertida
        })
        .then((response)=>{
            console.log(response.data);
            setNome("");
            setMedida("");
            setValor("");
            quantidade("");
            alert("Ingrediente cadastrado com sucesso!");
        })        
    }

   
    return(
        <><Navbar logado={true} />
        <div className={styles.registroIngredientes}>
        <h1>{props.titulo}</h1>
        
        <div className={styles.container} style={{ width: "640px" }}>

            <div className={styles["input-grid"]}>
                <div className={styles["input-group"]}>
                    <TextBox name="Nome" label="Nome do Ingrediente" type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>

                <div>
                    <div className={styles["input-group"]}>
                        <select
                            value={medida}
                            onChange={(e) => setMedida(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Selecione a medida</option>
                            {/* <option value="unidade">Unidade</option> */}
                            <option value="grama">Grama</option>
                            <option value="quilograma">Quilograma</option>
                            <option value="litro">Litro</option>
                            <option value="mililitro">Mililitro</option>
                        </select>
                    </div>

                    <div className={styles["input-group"]}>
                        <TextBox name="Quantidade" label="Quantidade" type="text" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                    </div>

                    <div className={styles["input-group"]}>
                        <TextBox name="Valor" label="Valor" type="text" value={valor} onChange={(e) => setValor(e.target.value)} />
                    </div>


                </div>
            </div>

            <Button function="Cadastrar" onClick={salvar} />

            {/* <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
                <h1>Autenticação bem-sucedida!</h1>
                <p>Usuário autenticado com sucesso.</p>
                <img src={sucesso} alt="" />
            </Modal>

            <Modal isOpen={modalErroAberto} onClose={() => setModalErroAberto(false)}>
                <h1>Erro ao acessar o Sistema</h1>
                <p>Verifique as informações preenchidas e tente novamente.</p>
                <img src={erro} alt="" />
            </Modal> */}
            </div>
        </div></>
    )
}