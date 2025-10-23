import React, { useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/ResumoVendas.module.css";
import { DateInput } from 'rsuite';
import { FaRegCalendarAlt } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

export function ResumoVenda() {

  const [searchParams] = useSearchParams();

  const dataParam = searchParams.get("data");
  let vendas = [];

  try {
    if (dataParam) {
      vendas = JSON.parse(decodeURIComponent(dataParam));
      console.log("Vendas recebidas:", vendas);
    }
  } catch (error) {
    console.error("Erro ao converter parâmetro:", error);
  }

  // Agora você pode acessar a propriedade "titulo" de cada item
  console.log(vendas[0].titulo);

  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-12");
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);

  const [filtros, setFiltros] = useState({
    dia: startDate,
    mes: endDate,
    valor: "Todos",
  });


  const handlePesquisar = () => {
    console.log("Filtros aplicados:", filtros);
    // aqui entraria lógica de filtro no backend ou no estado
  };

  const handleDownload = () => {
    console.log("Download solicitado");
    // aqui você gera o CSV/Excel com base nas vendas filtradas
  };

  return (
    <div className={styles.containerResumoVendas}>
      <Navbar logado={true} />
      <h1>Resumo da Venda</h1>

      <div className={styles.contentResumoVendas}>

        <div className={styles.leftContent}>
              <div className={styles.tabelaContainer}>
                    <table className={styles.tabela}>
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Massa</th>
                          <th>Peso</th>
                          <th>Recheio</th>
                          <th>Cobertura</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendas.map((v, idx) => (
                          <tr key={idx}>
                            <td>{v.nome}</td>
                            <td>{v.massa || "Padrão"}</td>
                            <td>{v.peso || "Padrão"}</td>
                            <td>{(v.recheio || "Padrão").replace(/\|/g, "\n")}</td>
                            <td>{v.cobertura || "Padrão"}</td>
                            <td>R$ {v.valorFinal || "Padrão"},00</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
              </div>
                   {/* <button className={styles.btnDownload} onClick={handleDownload}>
                            Fazer Download
                            </button>  */}
          </div>
          <div className={styles.rightContent}>
            <div className={styles.filtros}>
                        <h1>Resumo</h1>
                        <div className={styles.filtroItem}>
                          <div className={styles.qtdVendas}>
                            <label>Itens: </label> <label> {vendas.length} </label> <br />
                          </div>
                          <div className={styles.tipoVenda}>
                            <label>Tipo Venda: </label> <label> {vendas.length > 0 ? vendas[vendas.length - 1].categoriaEntrega : "N/A"}</label> <br />
                          </div>
                          <div className={styles.nomeCliente}>
                            <label>Nome do cliente (Opcional):</label>
                            <input type="text" />
                          </div>
                          <div className={styles.valorTotal}>
                            <label>R$ {vendas.reduce((total, v) => total + (v.valorFinal || 0), 0)},00</label>
                          </div>
                          {/* <label>Nome Cliente (opcional):</label>
                          <input type="text" /> */}
                        </div>
              </div>
          <button className={styles.btnPesquisar} onClick={console.log()}>
            Registrar
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );

  function formatDateBR(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }
}
