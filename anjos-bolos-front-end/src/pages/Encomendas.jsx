import React, { useRef, useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import styles from "../styles/Encomendas.module.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import api from '../provider/api';
import { ModernToast } from '../components/ModernToast';

export function Encomendas(props) {
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
    const ultimoDia = new Date(ano, mes + 1, 0);
    const dia = String(ultimoDia.getDate()).padStart(2, '0');
    const mesFormatado = String(mes + 1).padStart(2, '0');
    return `${ano}-${mesFormatado}-${dia}`;
  };
  
  // Função para obter a data de hoje no formato yyyy-MM-dd
  const getDataHoje = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const [startDate, setStartDate] = useState(getPrimeiroDiaDoMes());
  const [endDate, setEndDate] = useState(getUltimoDiaDoMes());
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);

  const [filtros, setFiltros] = useState({
    dia: startDate,
    mes: endDate,
    valor: "Todos",
    categoria: 'Todos',
    status: 'Todos'
  });

  const [encomendas, setEncomendas] = useState([]);
  const [pedidosFull, setPedidosFull] = useState([]);
  const [itensFull, setItensFull] = useState([]);
  const [statusEditando, setStatusEditando] = useState({});
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Carregar pedidos onde dataRetirada > dataPedido (encomendas futuras)
  useEffect(() => {
    let mounted = true;

    async function loadEncomendas() {
      try {
        console.log('🔍 Buscando encomendas...');
        console.log('  📅 Período:', startDate, 'até', endDate);

        let pedidosResp = await api.get('/pedidos');
        let itensResp = await api.get('/itens-pedido');

        const pedidos = Array.isArray(pedidosResp.data) ? pedidosResp.data : (pedidosResp.data && pedidosResp.data.content) ? pedidosResp.data.content : [];
        const itens = Array.isArray(itensResp.data) ? itensResp.data : (itensResp.data && itensResp.data.content) ? itensResp.data.content : [];

        console.log('✅ Total de pedidos no sistema:', pedidos.length);

        // Filtrar apenas encomendas: dataRetirada > dataPedido
        let encomendasFiltradas = pedidos.filter(pedido => {
          const dataPedidoStr = pedido.dataPedido || '';
          const dataRetiradaStr = pedido.dataRetirada || '';
          
          if (!dataPedidoStr || !dataRetiradaStr) return false;
          
          const dataPedido = new Date(dataPedidoStr);
          const dataRetirada = new Date(dataRetiradaStr);
          
          return dataRetirada > dataPedido;
        });

        console.log('📦 Encomendas encontradas:', encomendasFiltradas.length);

        // Filtrar por intervalo de datas de retirada
        if (startDate || endDate) {
          encomendasFiltradas = encomendasFiltradas.filter(pedido => {
            const dataStr = pedido.dataRetirada || '';
            if (!dataStr) return false;
            
            const dataRetirada = new Date(dataStr);
            dataRetirada.setHours(0, 0, 0, 0);
            
            const dataInicio = startDate ? new Date(startDate) : null;
            const dataFim = endDate ? new Date(endDate) : null;
            
            if (dataInicio) dataInicio.setHours(0, 0, 0, 0);
            if (dataFim) dataFim.setHours(23, 59, 59, 999);
            
            if (dataInicio && dataRetirada < dataInicio) return false;
            if (dataFim && dataRetirada > dataFim) return false;
            
            return true;
          });
        }

        console.log('📊 Encomendas no período selecionado:', encomendasFiltradas.length);

        const pedidosIdsFiltrados = new Set(encomendasFiltradas.map(p => Number(p.id)));
        const itensFiltrados = itens.filter(it => pedidosIdsFiltrados.has(Number(it.pedidoId)));

        const resultado = aplicarFiltrosEAgregar(encomendasFiltradas, itensFiltrados, filtros);
        
        if (mounted) {
          setEncomendas(resultado);
          setPedidosFull(encomendasFiltradas);
          setItensFull(itensFiltrados);
        }
      } catch (err) {
        console.error('❌ Erro ao carregar encomendas:', err);
      }
    }

    loadEncomendas();
    return () => { mounted = false; };
  }, [startDate, endDate]);

  const aplicarFiltrosEAgregar = (pedidos, itens, filtrosAplicados) => {
    let pedidosFiltrados = [...pedidos];
    let itensFiltrados = [...itens];

    // Filtrar por status
    if (filtrosAplicados.status && filtrosAplicados.status !== 'Todos') {
      pedidosFiltrados = pedidosFiltrados.filter(p => {
        const status = (p.status || '').toString().toUpperCase();
        return status === filtrosAplicados.status;
      });
    }

    const pedidoIds = new Set(pedidosFiltrados.map(p => Number(p.id)));
    itensFiltrados = itensFiltrados.filter(it => pedidoIds.has(Number(it.pedidoId)));

    // Filtrar por categoria
    if (filtrosAplicados.categoria && filtrosAplicados.categoria !== 'Todos') {
      itensFiltrados = itensFiltrados.filter(it => {
        const nome = (it.produto || it.nomeProduto || it.descricao || '').toString();
        const cat = inferCategoryFromProductName(nome);
        return cat === filtrosAplicados.categoria;
      });

      const pedidoIdsComItens = new Set(itensFiltrados.map(it => Number(it.pedidoId)));
      pedidosFiltrados = pedidosFiltrados.filter(p => pedidoIdsComItens.has(Number(p.id)));
    }

    // Preparar dados agregados por pedido
    const resultado = pedidosFiltrados.map(pedido => {
      const itensDoPedido = itensFiltrados.filter(it => Number(it.pedidoId) === Number(pedido.id));
      const valorTotal = itensDoPedido.reduce((s, it) => s + (Number(it.precoUnitario) * (Number(it.quantidade) || 1)), 0);
      const qtdItens = itensDoPedido.reduce((s, it) => s + (Number(it.quantidade) || 0), 0);

      const dataRetiradaStr = pedido.dataRetirada || '';
      const dt = dataRetiradaStr ? new Date(dataRetiradaStr) : null;
      const dia = dt ? String(dt.getDate()).padStart(2, '0') : '??';
      const mes = dt ? String(dt.getMonth() + 1).padStart(2, '0') : '??';
      const ano = dt ? dt.getFullYear() : '????';
      const dataRetiradaFormatada = `${dia}/${mes}/${ano}`;

      return {
        pedidoId: pedido.id,
        valor: valorTotal,
        itens: qtdItens,
        dataRetirada: dataRetiradaFormatada,
        dataRetiradaCompleta: dataRetiradaStr.split(' ')[0],
        status: pedido.status || 'PENDENTE',
        nomeCliente: pedido.Cliente || pedido.nomeCliente || 'Cliente',
        pedidoCompleto: pedido
      };
    });

    // Filtrar por valor
    let resultadoFinal = resultado;
    if (filtrosAplicados.valor && filtrosAplicados.valor !== 'Todos') {
      resultadoFinal = resultado.filter(v => {
        const valor = v.valor;
        if (filtrosAplicados.valor === 'Abaixo de R$ 50') return valor < 50;
        if (filtrosAplicados.valor === 'R$ 50 - R$ 100') return valor >= 50 && valor <= 100;
        if (filtrosAplicados.valor === 'R$ 100 - R$ 200') return valor >= 100 && valor <= 200;
        if (filtrosAplicados.valor === 'Acima de R$ 200') return valor > 200;
        return true;
      });
    }

    resultadoFinal.sort((a, b) => new Date(a.dataRetiradaCompleta) - new Date(b.dataRetiradaCompleta));
    
    return resultadoFinal;
  };

  const handlePesquisar = () => {
    console.log("🔍 Filtros aplicados:", filtros);

    try {
      const resultado = aplicarFiltrosEAgregar(pedidosFull, itensFull, filtros);
      setEncomendas(resultado);
      console.log('✅ Pesquisa aplicada com sucesso. Registros encontrados:', resultado.length);
    } catch (err) {
      console.error('❌ Erro ao aplicar filtros:', err);
    }
  };

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

  const handleStatusChange = (pedidoId, novoStatus) => {
    setStatusEditando(prev => ({
      ...prev,
      [pedidoId]: novoStatus
    }));
  };

  const handleSalvarStatus = async (pedidoId) => {
    const novoStatus = statusEditando[pedidoId];
    if (!novoStatus) return;

    try {
      console.log('💾 Salvando status:', novoStatus);

      // Buscar pedido completo
      const pedidoResp = await api.get(`/pedidos/${pedidoId}`);
      const pedidoAtual = pedidoResp.data;


      // Montar objeto conforme esperado pelo backend

      // Garantir formato ISO para datas
      function toISO(data) {
        if (!data) return '';
        if (typeof data === 'string' && data.includes('T')) return data; // já está ISO
        // Se vier como '2025-11-16 22:10:39', converter para ISO
        return new Date(data.replace(' ', 'T')).toISOString();
      }

      const pedidoAtualizado = {
        dataPedido: toISO(pedidoAtual.dataPedido),
        dataRetirada: toISO(pedidoAtual.dataRetirada),
        dataPagamento: toISO(pedidoAtual.dataPagamento),
        formaPagamento: pedidoAtual.formaPagamento || '',
        status: novoStatus,
        observacao: pedidoAtual.observacao || '',
        usuarioId: pedidoAtual.usuarioId || pedidoAtual.usuario?.id || pedidoAtual.usuario || '',
        clienteId: pedidoAtual.clienteId || pedidoAtual.cliente?.id || pedidoAtual.cliente || '',
      };

      // Validação básica
      for (const campo of [
        'dataPedido','dataRetirada','dataPagamento','formaPagamento','status','observacao','usuarioId','clienteId']) {
        if (!pedidoAtualizado[campo]) {
          showToast(`Campo obrigatório ausente: ${campo}`,'error');
          return;
        }
      }

      console.log('🔼 Enviando para PUT:', pedidoAtualizado);

      await api.put(`/pedidos/${pedidoId}`, pedidoAtualizado);

      showToast('Status atualizado com sucesso!', 'success');

      // Recarregar pedidos do backend para garantir atualização
      try {
        let pedidosResp = await api.get('/pedidos');
        let itensResp = await api.get('/itens-pedido');
        const pedidos = Array.isArray(pedidosResp.data) ? pedidosResp.data : (pedidosResp.data && pedidosResp.data.content) ? pedidosResp.data.content : [];
        const itens = Array.isArray(itensResp.data) ? itensResp.data : (itensResp.data && itensResp.data.content) ? itensResp.data.content : [];
        const encomendasFiltradas = pedidos.filter(pedido => {
          const dataPedidoStr = pedido.dataPedido || '';
          const dataRetiradaStr = pedido.dataRetirada || '';
          if (!dataPedidoStr || !dataRetiradaStr) return false;
          const dataPedido = new Date(dataPedidoStr);
          const dataRetirada = new Date(dataRetiradaStr);
          return dataRetirada > dataPedido;
        });
        const pedidosIdsFiltrados = new Set(encomendasFiltradas.map(p => Number(p.id)));
        const itensFiltrados = itens.filter(it => pedidosIdsFiltrados.has(Number(it.pedidoId)));
        const resultado = aplicarFiltrosEAgregar(encomendasFiltradas, itensFiltrados, filtros);
        setEncomendas(resultado);
        setPedidosFull(encomendasFiltradas);
        setItensFull(itensFiltrados);
      } catch (e) {
        // fallback: não recarregou
      }

      // Limpar status editando
      setStatusEditando(prev => {
        const newState = { ...prev };
        delete newState[pedidoId];
        return newState;
      });

    } catch (err) {
      console.error('❌ Erro ao atualizar status:', err);
      showToast('Erro ao atualizar status', 'error');
    }
  };

  const handleCancelarPedido = async (pedidoId) => {
    const confirmacao = window.confirm('Tem certeza que deseja excluir esta encomenda? Esta ação não pode ser desfeita.');
    
    if (!confirmacao) return;

    try {
      console.log('🗑️ Excluindo pedido:', pedidoId);

      await api.delete(`/pedidos/${pedidoId}`);

      showToast('Encomenda excluída com sucesso!', 'success');

      // Remover da lista local
      setEncomendas(prev => prev.filter(enc => enc.pedidoId !== pedidoId));
      setPedidosFull(prev => prev.filter(p => p.id !== pedidoId));

    } catch (err) {
      console.error('❌ Erro ao excluir pedido:', err);
      showToast('Erro ao excluir encomenda', 'error');
    }
  };

  return (
    <div className={styles.containerEncomendas}>
      <Navbar logado={true} />

      <div className={styles.contentEncomendas}>
        {/* Coluna de pesquisa */}
        <div className={styles.filtros}>
          <h1>Pesquisar</h1>
          
          <div className={styles.filtroItem}>
            <label>Data Início</label>
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
                max={getDataHoje()}
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
          <h1 className={styles.pageTitle}>Encomendas</h1>
          
          <div className={styles.tabelaContainer}>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Valor total</th>
                  <th>Itens</th>
                  <th>Data Retirada</th>
                  <th>Status Pedido</th>
                </tr>
              </thead>
              <tbody>
                {encomendas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={styles.emptyMessage}>
                      Nenhuma encomenda encontrada para o período selecionado
                    </td>
                  </tr>
                ) : (
                  encomendas.map((enc, idx) => (
                    <tr key={idx}>
                      <td>{enc.nomeCliente}</td>
                      <td>R$ {enc.valor.toFixed(2)}</td>
                      <td>{enc.itens}</td>
                      <td>{enc.dataRetirada}</td>
                      <td>
                        <div className={styles.statusCell}>
                          {statusEditando[enc.pedidoId] ? (
                            <>
                              <select
                                value={statusEditando[enc.pedidoId]}
                                onChange={(e) => handleStatusChange(enc.pedidoId, e.target.value)}
                                className={styles.statusSelectInline}
                              >
                                <option value="CONFIRMADO">Confirmado</option>
                                <option value="PENDENTE_PAGAMENTO">Pendente Pag.</option>
                                <option value="FINALIZADO">Finalizado</option>
                                <option value="CANCELADO">Cancelado</option>
                              </select>
                              <button
                                className={styles.btnIconRound}
                                onClick={() => setStatusEditando(prev => { const n = { ...prev }; delete n[enc.pedidoId]; return n; })}
                                title="Cancelar edição"
                              >
                                <span style={{fontSize: 18, lineHeight: 1}}>&#10005;</span>
                              </button>
                              <button
                                className={styles.btnIconRound}
                                onClick={() => handleSalvarStatus(enc.pedidoId)}
                                title="Salvar alteração"
                              >
                                <span style={{fontSize: 18, lineHeight: 1}}>&#10003;</span>
                              </button>
                              <button
                                className={styles.btnIconRound}
                                onClick={() => handleCancelarPedido(enc.pedidoId)}
                                title="Excluir pedido"
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                              </button>
                            </>
                          ) : (
                            <>
                              <select
                                value={enc.status}
                                disabled
                                className={styles.statusSelectInline}
                              >
                                <option value="CONFIRMADO">Confirmado</option>
                                <option value="PENDENTE_PAGAMENTO">Pendente Pag.</option>
                                <option value="FINALIZADO">Finalizado</option>
                                <option value="CANCELADO">Cancelado</option>
                              </select>
                              <button
                                className={styles.btnIconRound}
                                onClick={() => setStatusEditando(prev => ({ ...prev, [enc.pedidoId]: enc.status }))}
                                title="Editar status"
                              >
                                <span style={{fontSize: 18, lineHeight: 1}}>&#9998;</span>
                              </button>
                              <button
                                className={styles.btnIconRound}
                                onClick={() => handleCancelarPedido(enc.pedidoId)}
                                title="Excluir pedido"
                              >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModernToast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );

  function formatDateBR(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }

  function formatStatus(status) {
    const statusMap = {
      'CONFIRMADO': 'Confirmado',
      'PENDENTE_PAGAMENTO': 'Pendente Pagamento',
      'CANCELADO': 'Cancelado',
      'FINALIZADO': 'Finalizado'
    };
    return statusMap[status] || status;
  }
}
