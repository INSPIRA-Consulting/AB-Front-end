import React, { useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/ResumoVendas.module.css";
import { DateInput } from 'rsuite';
import { FaRegCalendarAlt } from "react-icons/fa";
// using localStorage to receive vendas (set by RegistroVendas)

export function ResumoVenda() {

  let vendas = [];
  try {
    const raw = localStorage.getItem('vendas');
    if (raw) {
      vendas = JSON.parse(raw);
      console.log('Vendas recebidas (localStorage):', vendas);
      // remove after reading to avoid stale data
      localStorage.removeItem('vendas');
    }
  } catch (error) {
    console.error('Erro ao ler vendas do localStorage:', error);
  }

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
