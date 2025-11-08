import React, { useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import styles from "../styles/HistoricoVendas.module.css";
import { DateInput } from 'rsuite';
import { FaRegCalendarAlt } from "react-icons/fa";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import api from '../provider/api';
import { Modal } from '../components/Modal';

export function HistoricoVendas(props) {
  useDocumentTitle(props.titulo);

  const [startDate, setStartDate] = useState("2025-06-01");
  const [endDate, setEndDate] = useState("2025-06-12");
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);

  const [filtros, setFiltros] = useState({
    dia: startDate,
    mes: endDate,
    valor: "Todos",
  });

  const [vendas, setVendas] = useState([]);
  const [pedidosFull, setPedidosFull] = useState([]);
  const [itensFull, setItensFull] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [itensDoDia, setItensDoDia] = useState([]);

  // carregar pedidos e itens do backend e agregá-los por dia
  React.useEffect(() => {
    let mounted = true;

    async function loadPedidosEItens() {
      try {
        let pedidosResp;
        pedidosResp = await api.get('/pedidos');

        let itensResp;
        itensResp = await api.get('/itens-pedido');

        const pedidos = Array.isArray(pedidosResp.data) ? pedidosResp.data : (pedidosResp.data && pedidosResp.data.content) ? pedidosResp.data.content : [];
        const itens = Array.isArray(itensResp.data) ? itensResp.data : (itensResp.data && itensResp.data.content) ? itensResp.data.content : [];

        // agregar por dia (usando dataPedido)
        const mapa = {};
        pedidos.forEach(pedido => {
          const dataStr = pedido.dataPedido || pedido.dataPedidoString || pedido.dataPedidoAt || '';
          const dt = dataStr ? new Date(dataStr) : null;
          const dia = dt ? dt.getDate() : null;

          // somar itens vinculados a esse pedido
          const itensDoPedido = itens.filter(it => Number(it.pedidoId) === Number(pedido.id));
          const valorTotal = itensDoPedido.reduce((s, it) => s + (Number(it.valorFinal) || 0), 0);
          const qtdItens = itensDoPedido.reduce((s, it) => s + (Number(it.quantidade) || 0), 0);

          if (dia == null) return;

          if (!mapa[dia]) mapa[dia] = { valor: 0, itens: 0, dia };
          mapa[dia].valor += valorTotal;
          mapa[dia].itens += qtdItens;
        });

        const resultado = Object.values(mapa).sort((a, b) => b.dia - a.dia);
        if (mounted) {
          setVendas(resultado);
          setPedidosFull(pedidos);
          setItensFull(itens);
        }
      } catch (err) {
        console.error('Erro ao carregar pedidos/itens:', err);
      }
    }

    loadPedidosEItens();
    return () => { mounted = false; };
  }, []);


  const handlePesquisar = () => {
    console.log("Filtros aplicados:", filtros);
  };


  const handleDetalhesDia = (dia) => {
    try {
      const pedidosDoDia = pedidosFull.filter(p => {
        const dataStr = p.dataPedido || p.dataPedidoString || p.dataPedidoAt || '';
        const dt = dataStr ? new Date(dataStr) : null;
        const d = dt ? dt.getDate() : null;
        return d === dia;
      });

      const itens = [];
      pedidosDoDia.forEach(p => {
        const itensDoPedido = itensFull.filter(it => Number(it.pedidoId) === Number(p.id));
        itens.push(...itensDoPedido);
      });

      setItensDoDia(itens);
      setModalAberto(true);
    } catch (err) {
      console.error('Erro ao buscar itens do dia:', err);
      setItensDoDia([]);
      setModalAberto(true);
    }
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

          <button className={styles.btnPesquisar} onClick={handlePesquisar}>
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
                        onClick={() => handleDetalhesDia(v.dia)}
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

  {/* Modal de detalhes do dia - usar Modal reutilizável */}
      <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)}>
        <div style={{ padding: 12, width: 720 }}>
          <h2 style={{ marginTop: 6, marginBottom: 12 }}>Itens vendidos no dia</h2>
          {itensDoDia.length === 0 ? (
            <p>Nenhum item encontrado para este dia.</p>
          ) : (
            <div style={{ maxHeight: 360, overflowY: 'auto', background: '#fff', border: '2px solid #6b3200', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f7f4' }}>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5ded8', color: '#6b3200' }}>Produto</th>
                    <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #e5ded8', color: '#6b3200', width: 120 }}>Quantidade</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #e5ded8', color: '#6b3200', width: 140 }}>Valor unit.</th>
                    <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #e5ded8', color: '#6b3200', width: 140 }}>Valor total</th>
                  </tr>
                </thead>
                <tbody>
                  {itensDoDia.map((it, i) => (
                    <tr key={i}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #f0ece8', color: '#6b3200' }}>{it.produto || it.nomeProduto || it.descricao || 'Item'}</td>
                      <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0ece8', color: '#6b3200' }}>{it.quantidade || 0}</td>
                      <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #f0ece8', color: '#6b3200' }}>R$ {(Number(it.valorFinal || 0) / it.quantidade).toFixed(2)}</td>
                      <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #f0ece8', color: '#6b3200' }}>R$ {Number((it.valorFinal || 0)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );

  function formatDateBR(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }
}
