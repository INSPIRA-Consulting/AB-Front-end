import React, { useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/HistoricoVendas.module.css";
import { DateInput } from 'rsuite';
import { FaRegCalendarAlt } from "react-icons/fa";

export function HistoricoVendas() {

  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-12");
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);

  const [filtros, setFiltros] = useState({
    dia: startDate,
    mes: endDate,
    valor: "Todos",
  });

  const [vendas, setVendas] = useState([
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },
    { valor: 150, itens: 2, dia: 12 },  
    // aqui futuramente você pode puxar do backend
  ]);


  const handlePesquisar = () => {
    console.log("Filtros aplicados:", filtros);
    // aqui entraria lógica de filtro no backend ou no estado
  };

  const handleDownload = () => {
    console.log("Download solicitado");
    // aqui você gera o CSV/Excel com base nas vendas filtradas
  };

  return (
    <div className={styles.containerHistoiricoVendas}>
      <Navbar logado={true} />
      <h1>Histórico de Venda</h1>

      <div className={styles.contentHistoiricoVendas}>
        {/* Coluna de pesquisa */}
        <div className={styles.filtros}>
          <h1>Pesquisar</h1>
          <div className={styles.filtroItem}>
            <label>Data Inicio</label>
            {/* <DateInput format="dd/MM/yyyy" className={styles.inputData} onChange={(value) => setDataInicio(value)}/> */}
            <div className={styles.periodoDate}
              onClick={() => startInputRef.current && startInputRef.current.showPicker && startInputRef.current.showPicker()}
              style={{ position: "relative", cursor: "pointer" }}>
              <FaRegCalendarAlt className={styles.calendarIcon} />
              {!startDate && (
                <span className={styles.datePlaceholder}>dd/mm/aaaa</span>
              )}
              <input
                ref={startInputRef}
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className={styles.invisibleDateInput}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                  zIndex: 2
                }}
              />
              {startDate && (
                <span className={styles.dateValue}>{formatDateBR(startDate)}</span>
              )}
            </div>
          </div>

          <div className={styles.filtroItem}>
            <label>Data Final</label>
            {/* <DateInput format="dd/MM/yyyy" className={styles.inputData} onChange={(value) => setDataInicio(value)}/> */}
            <div
              className={styles.periodoDate}
              onClick={() => endInputRef.current && endInputRef.current.showPicker && endInputRef.current.showPicker()}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <FaRegCalendarAlt className={styles.calendarIcon} />
              {!endDate && (
                <span className={styles.datePlaceholder}>dd/mm/aaaa</span>
              )}
              <input
                ref={endInputRef}
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className={styles.invisibleDateInput}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                  zIndex: 2
                }}
              />
              {endDate && (
                <span className={styles.dateValue}>{formatDateBR(endDate)}</span>
              )}
            </div>
          </div>

          <label>Valor:</label>
          <div className={styles.filtroRadio}>
            <label>
              <input
                type="radio"
                name="valor"
                value="Abaixo de R$ 50"
              // onChange={}
              />
              Abaixo de R$ 50
            </label>
            <label>
              <input
                type="radio"
                name="valor"
                value="R$ 50 - R$ 100"
              // onChange={}
              />
              R$ 50 - R$ 100
            </label>
            <label>
              <input
                type="radio"
                name="valor"
                value="R$ 100 - R$ 200"
              // onChange={}
              />
              R$ 100 - R$ 200
            </label>
            <label>
              <input
                type="radio"
                name="valor"
                value="Todos"
              // onChange={}
              />
              Todos
            </label>

          </div>

          <button className={styles.btnPesquisar} onClick={console.log()}>
            Pesquisar
          </button>
        </div>

        <div className={styles.leftContent}>
          {/* Tabela de resultados */}
          <div className={styles.tabelaContainer}>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Valor total</th>
                  <th>Itens</th>
                  <th>Dia</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((v, idx) => (
                  <tr key={idx}>
                    <td>R$ {v.valor.toFixed(2)}</td>
                    <td>{v.itens}</td>
                    <td>{v.dia}</td>
                    <td>
                      <button
                        className={styles.btnDetalhes}
                        onClick={() => alert(`Detalhes da venda do dia ${v.dia}`)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="#56270B" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          {/* <button className={styles.btnDownload} onClick={handleDownload}>
            Fazer Download
          </button> */}
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
