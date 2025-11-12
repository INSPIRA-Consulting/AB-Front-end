import React, { useRef, useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import styles from "../styles/HistoricoVendas.module.css";
import { DateInput } from 'rsuite';
import { FaRegCalendarAlt } from "react-icons/fa";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useSearchParams } from "react-router-dom";
import api from '../provider/api';
import { Modal } from '../components/Modal';

export function HistoricoVendas(props) {
  useDocumentTitle(props.titulo);

  // Função para obter o primeiro dia do mês atual no formato yyyy-MM-dd
  const getPrimeiroDiaDoMes = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    return `${ano}-${mes}-01`;
  };
  
  // Função para obter o último dia do mês atual no formato yyyy-MM-dd
  const getUltimoDiaDoMes = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    // Criar data do próximo mês, dia 0 (que é o último dia do mês atual)
    const ultimoDia = new Date(ano, mes + 1, 0);
    const dia = String(ultimoDia.getDate()).padStart(2, '0');
    const mesFormatado = String(mes + 1).padStart(2, '0');
    return `${ano}-${mesFormatado}-${dia}`;
  };

  // Ler parâmetros da URL (vindos da DashProdutos)
  const [searchParams] = useSearchParams();
  
  // Inicializar datas: se vier da URL usa os parâmetros, senão usa primeiro e último dia do mês atual
  const dataInicioParam = searchParams.get('dataInicio') || getPrimeiroDiaDoMes();
  const dataFimParam = searchParams.get('dataFim') || getUltimoDiaDoMes();
  const statusParam = searchParams.get('status') || "Todos"; // Ler status da URL

  const [startDate, setStartDate] = useState(dataInicioParam);
  const [endDate, setEndDate] = useState(dataFimParam);
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);

  const [filtros, setFiltros] = useState({
    dia: startDate,
    mes: endDate,
    valor: "Todos",
    categoria: 'Todos',
    status: statusParam // Inicializar com status da URL
  });

  const [vendas, setVendas] = useState([]);
  const [pedidosFull, setPedidosFull] = useState([]);
  const [itensFull, setItensFull] = useState([]);
  const [pedidosOriginais, setPedidosOriginais] = useState([]); // Guardar pedidos sem filtro
  const [itensOriginais, setItensOriginais] = useState([]); // Guardar itens sem filtro
  const [modalAberto, setModalAberto] = useState(false);
  const [itensDoDia, setItensDoDia] = useState([]);

  // Atualizar filtros quando os parâmetros mudarem
  useEffect(() => {
    if (dataInicioParam || dataFimParam) {
      setFiltros(prev => ({
        ...prev,
        dia: dataInicioParam || startDate,
        mes: dataFimParam || endDate
      }));
      
      console.log('📋 Histórico carregado com filtros da DashProdutos:');
      console.log('  📅 Data Início:', dataInicioParam);
      console.log('  📅 Data Fim:', dataFimParam);
    }
  }, [dataInicioParam, dataFimParam]);

  // carregar pedidos e itens do backend e agregá-los por dia
  useEffect(() => {
    let mounted = true;

    async function loadPedidosEItens() {
      try {
        console.log('🔍 Buscando pedidos e itens-pedido...');
        console.log('  📅 Período:', startDate, 'até', endDate);

        // Backend não tem endpoint de intervalo de datas, então:
        // 1. Buscar todos os pedidos
        let pedidosResp = await api.get('/pedidos');
        let itensResp = await api.get('/itens-pedido');

        const pedidos = Array.isArray(pedidosResp.data) ? pedidosResp.data : (pedidosResp.data && pedidosResp.data.content) ? pedidosResp.data.content : [];
        const itens = Array.isArray(itensResp.data) ? itensResp.data : (itensResp.data && itensResp.data.content) ? itensResp.data.content : [];

        console.log('✅ Total de pedidos no sistema:', pedidos.length);
        console.log('✅ Total de itens no sistema:', itens.length);

        // Guardar dados originais para filtragem
        if (mounted) {
          setPedidosOriginais(pedidos);
          setItensOriginais(itens);
        }

        // 2. Filtrar pedidos por intervalo de datas
        let pedidosFiltrados = pedidos;
        if (startDate || endDate) {
          pedidosFiltrados = pedidos.filter(pedido => {
            const dataStr = pedido.dataPedido || pedido.dataPedidoString || pedido.dataPedidoAt || '';
            if (!dataStr) return false;
            
            // Parse da data (pode vir como "2025-01-15" ou "2025-01-15T10:30:00")
            const dataPedido = new Date(dataStr);
            dataPedido.setHours(0, 0, 0, 0); // Normalizar para início do dia
            
            const dataInicio = startDate ? new Date(startDate) : null;
            const dataFim = endDate ? new Date(endDate) : null;
            
            if (dataInicio) dataInicio.setHours(0, 0, 0, 0);
            if (dataFim) dataFim.setHours(23, 59, 59, 999); // Final do dia
            
            if (dataInicio && dataPedido < dataInicio) return false;
            if (dataFim && dataPedido > dataFim) return false;
            
            return true;
          });
        }

        console.log('📊 Pedidos no período selecionado:', pedidosFiltrados.length);

        // Filtrar itens apenas dos pedidos do período
        const pedidosIdsFiltrados = new Set(pedidosFiltrados.map(p => Number(p.id)));
        const itensFiltrados = itens.filter(it => pedidosIdsFiltrados.has(Number(it.pedidoId)));
        
        console.log('📦 Itens dos pedidos filtrados:', itensFiltrados.length);

        // Aplicar filtros adicionais (status, categoria, valor) se já existirem
        const resultado = aplicarFiltrosEAgregar(pedidosFiltrados, itensFiltrados, filtros);
        
        if (mounted) {
          setVendas(resultado);
          setPedidosFull(pedidosFiltrados);
          setItensFull(itensFiltrados);
        }
      } catch (err) {
        console.error('❌ Erro ao carregar pedidos/itens:', err);
      }
    }

    loadPedidosEItens();
    return () => { mounted = false; };
  }, [startDate, endDate]);

  // Função para aplicar filtros e agregar dados
  const aplicarFiltrosEAgregar = (pedidos, itens, filtrosAplicados) => {
    let pedidosFiltrados = [...pedidos];
    let itensFiltrados = [...itens];

    // Filtrar por status do pedido
    if (filtrosAplicados.status && filtrosAplicados.status !== 'Todos') {
      pedidosFiltrados = pedidosFiltrados.filter(p => {
        const status = (p.status || p.Status || '').toString().toUpperCase();
        return status === filtrosAplicados.status;
      });
    }

    // Atualizar itens após filtro de status
    const pedidoIds = new Set(pedidosFiltrados.map(p => Number(p.id)));
    itensFiltrados = itensFiltrados.filter(it => pedidoIds.has(Number(it.pedidoId)));

    // Filtrar por categoria
    if (filtrosAplicados.categoria && filtrosAplicados.categoria !== 'Todos') {
      itensFiltrados = itensFiltrados.filter(it => {
        const nome = (it.produto || it.nomeProduto || it.descricao || '').toString();
        const cat = inferCategoryFromProductName(nome);
        return cat === filtrosAplicados.categoria;
      });

      // Manter apenas pedidos que tenham itens após filtro de categoria
      const pedidoIdsComItens = new Set(itensFiltrados.map(it => Number(it.pedidoId)));
      pedidosFiltrados = pedidosFiltrados.filter(p => pedidoIdsComItens.has(Number(p.id)));
    }

    // Agregar por dia
    const mapa = {};
    pedidosFiltrados.forEach(pedido => {
      const dataStr = pedido.dataPedido || pedido.dataPedidoString || pedido.dataPedidoAt || '';
      const dt = dataStr ? new Date(dataStr) : null;
      
      if (!dt) return;
      
      const dataCompleta = dataStr.split(' ')[0];
      // Formatar como dd/MM/yyyy
      const dia = String(dt.getDate()).padStart(2, '0');
      const mes = String(dt.getMonth() + 1).padStart(2, '0');
      const ano = dt.getFullYear();
      const diaFormatado = `${dia}/${mes}/${ano}`;

      const itensDoPedido = itensFiltrados.filter(it => Number(it.pedidoId) === Number(pedido.id));
      const valorTotal = itensDoPedido.reduce((s, it) => s + (Number(it.precoUnitario) * (Number(it.quantidade) || 1)), 0);
      const qtdItens = itensDoPedido.reduce((s, it) => s + (Number(it.quantidade) || 0), 0);

      if (!mapa[dataCompleta]) {
        mapa[dataCompleta] = { valor: 0, itens: 0, dia: diaFormatado, dataCompleta };
      }
      mapa[dataCompleta].valor += valorTotal;
      mapa[dataCompleta].itens += qtdItens;
    });

    let resultado = Object.values(mapa);

    // Filtrar por valor (após agregação)
    if (filtrosAplicados.valor && filtrosAplicados.valor !== 'Todos') {
      resultado = resultado.filter(v => {
        const valor = v.valor;
        if (filtrosAplicados.valor === 'Abaixo de R$ 50') return valor < 50;
        if (filtrosAplicados.valor === 'R$ 50 - R$ 100') return valor >= 50 && valor <= 100;
        if (filtrosAplicados.valor === 'R$ 100 - R$ 200') return valor >= 100 && valor <= 200;
        if (filtrosAplicados.valor === 'Acima de R$ 200') return valor > 200;
        return true;
      });
    }

    resultado.sort((a, b) => new Date(b.dataCompleta) - new Date(a.dataCompleta));
    
    return resultado;
  };


  const handlePesquisar = () => {
    console.log("🔍 Filtros aplicados:", filtros);

    try {
      // Começar com pedidos já filtrados por data
      let pedidos = [...pedidosFull];
      let itens = [...itensFull];

      // Aplicar filtros e agregar
      const resultado = aplicarFiltrosEAgregar(pedidos, itens, filtros);

      setVendas(resultado);
      console.log('✅ Pesquisa aplicada com sucesso. Registros encontrados:', resultado.length);
    } catch (err) {
      console.error('❌ Erro ao aplicar filtros:', err);
    }
  };

  // Heurística simples para inferir categoria a partir do nome do produto
  function inferCategoryFromProductName(nome) {
    if (!nome) return 'Outros';
    const n = nome.toLowerCase();
    if (n.includes('coxinha') || n.includes('empada') || n.includes('salgado')) return 'Salgados';
    if (n.includes('pote') || n.includes('bolo de pote')) return 'Bolos de Pote';
    if (n.includes('bolo') && (n.includes('festa') || n.includes('anivers'))) return 'Bolos de Festa';
    if (n.includes('bolo')) return 'Bolos Tradicionais';
    if (n.includes('suco') || n.includes('refrigerante') || n.includes('bebida')) return 'Bebidas';
    return 'Outros';
  }

  const handleDownload = () => {
    console.log("Download solicitado");
    // aqui você gera o CSV/Excel com base nas vendas filtradas
  };

  // abre modal com itens do dia selecionado
  const handleDetalhesDia = (vendaItem) => {
    try {
      console.log('🔍 Abrindo detalhes para:', vendaItem);
      
      // Usar dataCompleta ao invés de só o número do dia
      const dataAlvo = vendaItem.dataCompleta; // "2025-11-01"
      
      const pedidosDoDia = pedidosFull.filter(p => {
        const dataStr = p.dataPedido || p.dataPedidoString || p.dataPedidoAt || '';
        const dataCompleta = dataStr.split(' ')[0]; // "2025-11-01"
        return dataCompleta === dataAlvo;
      });

      console.log('📦 Pedidos do dia', dataAlvo, ':', pedidosDoDia.length);

      const itens = [];
      pedidosDoDia.forEach(p => {
        const itensDoPedido = itensFull.filter(it => Number(it.pedidoId) === Number(p.id));
        itens.push(...itensDoPedido);
      });

      console.log('🛒 Itens encontrados:', itens.length);
      
      setItensDoDia(itens);
      setModalAberto(true);
    } catch (err) {
      console.error('❌ Erro ao buscar itens do dia:', err);
      setItensDoDia([]);
      setModalAberto(true);
    }
  };

  return (
    <div className={styles.containerHistoiricoVendas}>
      <Navbar logado={true} />

      <div className={styles.contentHistoiricoVendas}>
        {/* Coluna de pesquisa */}
        <div className={styles.filtros}>
          <h1>Pesquisar</h1>
          
          <div className={styles.filtroItem}>
            <label>Data Inicio</label>
            <div className={styles.periodoDate}
              onClick={() => startInputRef.current && startInputRef.current.showPicker && startInputRef.current.showPicker()}>
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
              />
              {startDate && (
                <span className={styles.dateValue}>{formatDateBR(startDate)}</span>
              )}
            </div>
          </div>

          <div className={styles.filtroItem}>
            <label>Data Final</label>
            <div
              className={styles.periodoDate}
              onClick={() => endInputRef.current && endInputRef.current.showPicker && endInputRef.current.showPicker()}
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
              />
              {endDate && (
                <span className={styles.dateValue}>{formatDateBR(endDate)}</span>
              )}
            </div>
          </div>

          <div className={styles.filterCompactRow}>
            <div className={styles.filtroCompactItem}>
              <label>Categoria</label>
              <select
                value={filtros.categoria || 'Todos'}
                onChange={e => setFiltros(prev => ({ ...prev, categoria: e.target.value }))}
                className={styles.compactSelect}
              >
                <option value="Todos">Todos</option>
                <option value="Bolos Tradicionais">Bolos Tradicionais</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Salgados">Salgados</option>
                <option value="Bolos de Pote">Bolos de Pote</option>
                <option value="Bolos de Festa">Bolos de Festa</option>
              </select>
            </div>

            <div className={styles.filtroCompactItem}>
              <label>Status</label>
              <select
                value={filtros.status || 'Todos'}
                onChange={e => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                className={styles.compactSelect}
              >
                <option value="Todos">Todos</option>
                <option value="CONFIRMADO">Confirmado</option>
                <option value="PENDENTE_PAGAMENTO">Pendente Pag.</option>
                <option value="CANCELADO">Cancelado</option>
                <option value="FINALIZADO">Finalizado</option>
              </select>
            </div>

            <div className={styles.filtroCompactItem}>
              <label>Valor</label>
              <select
                value={filtros.valor || 'Todos'}
                onChange={e => setFiltros(prev => ({ ...prev, valor: e.target.value }))}
                className={styles.compactSelect}
              >
                <option value="Todos">Todos</option>
                <option value="Abaixo de R$ 50">Abaixo de R$ 50</option>
                <option value="R$ 50 - R$ 100">R$ 50 - R$ 100</option>
                <option value="R$ 100 - R$ 200">R$ 100 - R$ 200</option>
                <option value="Acima de R$ 200">Acima de R$ 200</option>
              </select>
            </div>

            <button className={styles.btnPesquisar} onClick={handlePesquisar}>
              Pesquisar
            </button>
          </div>
        </div>

        <div className={styles.leftContent}>
          <h1 className={styles.pageTitle}>Histórico de Venda</h1>
          
          {/* Tabela de resultados */}
          <div className={styles.tabelaContainer}>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Valor total</th>
                  <th>Itens</th>
                  <th>Data</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {vendas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className={styles.emptyMessage}>
                      Nenhum registro encontrado para o período selecionado
                    </td>
                  </tr>
                ) : (
                  vendas.map((v, idx) => (
                    <tr key={idx}>
                      <td>R$ {v.valor.toFixed(2)}</td>
                      <td>{v.itens}</td>
                      <td>{v.dia}</td>
                      <td>
                        <button
                          className={styles.btnDetalhes}
                          onClick={() => handleDetalhesDia(v)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="#56270B" d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>Itens Vendidos do Dia</h2>
          </div>
          
          {itensDoDia.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum item encontrado para este dia.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.modalTable}>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd.</th>
                    <th>Valor unit.</th>
                    <th>Valor total</th>
                  </tr>
                </thead>
                <tbody>
                  {itensDoDia.map((it, i) => {
                    const precoUnitario = Number(it.precoUnitario || 1);
                    const valorTotal = Number(it.precoUnitario || 0) * (Number(it.quantidade) || 1);
                    
                    return (
                      <tr key={i}>
                        <td className={styles.productName}>
                          {it.produto || it.nomeProduto || it.descricao || 'Item'}
                        </td>
                        <td className={styles.centered}>{it.quantidade || 0}</td>
                        <td className={styles.currency}>
                          R$ {precoUnitario.toFixed(2)}
                        </td>
                        <td className={styles.currencyBold}>
                          R$ {valorTotal.toFixed(2)} 
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className={styles.totalRow}>
                    <td colSpan="3">Total</td>
                    <td className={styles.totalValue}>
                      R$ {itensDoDia.reduce((sum, it) => sum + (Number(it.precoUnitario || 0) * (Number(it.quantidade) || 1)), 0).toFixed(2)};
                    </td>
                  </tr>
                </tfoot>
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
