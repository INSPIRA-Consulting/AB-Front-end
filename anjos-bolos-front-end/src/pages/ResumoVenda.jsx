import React, { useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/ResumoVendas.module.css";
import { DateInput } from 'rsuite';
import { FaRegCalendarAlt } from "react-icons/fa";
import { useEffect } from "react";

export function ResumoVenda() {

  const [vendas, setVendas] = React.useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('resumoVendas');
      if (raw) {
        const parsed = JSON.parse(raw);
        // parsed may contain { vendas, tipoVenda }
        if (Array.isArray(parsed.vendas)) {
          setVendas(parsed.vendas);
          console.log('Vendas carregadas do localStorage:', parsed.vendas);
        } else if (Array.isArray(parsed)) {
          // backward compatibility if only array was saved
          setVendas(parsed);
          console.log('Vendas carregadas do localStorage (array):', parsed);
        }
      }
    } catch (error) {
      console.error('Erro ao ler vendas do localStorage:', error);
    }
  }, []);

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
  };

  const handleDownload = () => {
    console.log("Download solicitado");
  };

  const handleConfirmRegister = () => {
    try {
      localStorage.removeItem('resumoVendas');
      setVendas([]);
      alert('Registro confirmado. Dados temporários removidos do localStorage.');
      window.location.href = '/registro-vendas';
    } catch (err) {
      console.error('Erro ao limpar localStorage:', err);
      alert('Ocorreu um erro ao confirmar. Veja o console para detalhes.');
    }
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
          <button className={styles.btnPesquisar} onClick={handleConfirmRegister}>
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
