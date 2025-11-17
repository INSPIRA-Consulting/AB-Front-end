import React, { useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import styles from "../styles/ResumoVendas.module.css";
import { DateInput } from 'rsuite';
import { FaRegCalendarAlt } from "react-icons/fa";
import { useEffect } from "react";
import api from '../provider/api';

export function ResumoVenda() {

  const [vendas, setVendas] = React.useState([]);

  const handleVoltar = () => {
    window.location.href = '/registro-vendas';
  };

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
    // registrar pedido e itens no backend
    (async () => {
      try {
        const raw = localStorage.getItem('resumoVendas');
        if (!raw) {
          alert('Nenhuma venda encontrada no resumo.');
          return;
        }

        const parsed = JSON.parse(raw);
        const vendasPayload = Array.isArray(parsed.vendas) ? parsed.vendas : (Array.isArray(parsed) ? parsed : []);

        // montar payload do pedido
        const now = new Date();
        const formatDateTime = (dt) => {
          const yyyy = dt.getFullYear();
          const mm = String(dt.getMonth() + 1).padStart(2, '0');
          const dd = String(dt.getDate()).padStart(2, '0');
          const hh = String(dt.getHours()).padStart(2, '0');
          const min = String(dt.getMinutes()).padStart(2, '0');
          const ss = String(dt.getSeconds()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
        };

        const clienteId = parsed.orderDetails?.clientId || parsed.clienteId || null;

        const pedidoPayload = {
          dataPedido: formatDateTime(now),
          dataRetirada: formatDateTime(now),
          dataPagamento: formatDateTime(now),
          formaPagamento: parsed.formaPagamento || 'VOUCHER',
          status: 'CONFIRMADO',
          observacao: parsed.observacao || 'Sem observação',
          usuarioId: parsed.usuarioId || 1,
          clienteId: clienteId || 1
        };

        let respPedido;
        try {
          respPedido = await api.post('/pedidos', pedidoPayload);
        } catch (errPost) {
          console.error('Erro ao criar pedido:', errPost);
          alert('Erro ao criar pedido. Veja o console para mais detalhes.');
          return;
        }

        let pedidoId = true;

        // se o POST não retornou id, buscar o pedido mais recente via GET /api/pedidos (fallback /pedidos)
        if (pedidoId) {
          try {
            let listaResp;
            listaResp = await api.get('/pedidos');

            const lista = Array.isArray(listaResp.data)
              ? listaResp.data
              : (listaResp.data && listaResp.data.content) ? listaResp.data.content : [];

              console.log('Lista de pedidos obtida para busca do mais recente:', lista);
            if (lista.length > 0) {
              // escolher o pedido mais recente: prefere maior id numérico, senão pela data mais recente
              const hasNumericId = lista.every(p => p && p.id !== undefined && !isNaN(Number(p.id)));
              let maisRecente = null;
              if (hasNumericId) {
                maisRecente = lista.reduce((a, b) => (Number(a.id) > Number(b.id) ? a : b));
              } else {
                maisRecente = lista.reduce((a, b) => {
                  const da = new Date(a.dataPedido || a.dataPedidoString || a.dataPedidoAt || 0);
                  const db = new Date(b.dataPedido || b.dataPedidoString || b.dataPedidoAt || 0);
                  return da > db ? a : b;
                });
              }

              pedidoId = maisRecente.id || maisRecente.pedidoId || maisRecente.idPedido;
            }
          } catch (errBusca) {
            console.error('Erro ao buscar pedidos para obter id mais recente:', errBusca);
          }
        }

        if (!pedidoId) {
          console.error('Não foi possível determinar o id do pedido (nem pelo POST, nem pelo GET).', respPedido);
          alert('Pedido criado, mas não foi possível obter o id do pedido. Confira o console.');
          return;
        }

        // obter receitas para mapear nomes -> ids (usado para detalhamentos de bolos de festa)
        let receitasList = [];
        try {
          const respReceitas = await api.get('/receitas');
          receitasList = Array.isArray(respReceitas.data) ? respReceitas.data : (respReceitas.data && respReceitas.data.content) ? respReceitas.data.content : [];
        } catch (errReceitas) {
          console.warn('Não foi possível carregar receitas para detalhamentos:', errReceitas);
          receitasList = [];
        }

        const receitaMap = new Map();
        receitasList.forEach(r => {
          if (r && r.nome) receitaMap.set(String(r.nome).toLowerCase(), r.id);
        });

        // postar itens do pedido
        // tentativa de mapear produtoId quando disponível em cada venda
        for (const v of vendasPayload) {
          const isBolo = v.nome && String(v.nome).toLowerCase().includes('festa');
          const itemPayload = {
            pedidoId: pedidoId,
            // para bolos de festa, o fkProduto deve ser 1 conforme solicitado
            produtoId: isBolo ? 1 : (v.produtoId || v.produto?.id || null),
            quantidade: Number(v.quantidade || 1),
            peso: isBolo ? (Number(v.peso) || 0) : (Number(v.peso) || 1000.0)
          };

          // para bolo de festa, passar o preço informado pelo usuário como precoUnitario
          if (isBolo) {
            itemPayload.precoUnitario = Number(v.valorFinal || 0);
          }

          // enviar item (usa /api/itens-pedido) e capturar id retornado para detalhamentos
          let itemId = null;
          try {
            const itemResp = await api.post('/itens-pedido', itemPayload);
            // tentar extrair id conforme diferentes formatos de API
            itemId = itemResp?.data?.id || itemResp?.data?.itemId || itemResp?.data?.idItem || null;
          } catch (err) {
            console.error('Erro ao criar item do pedido:', err, 'payload:', itemPayload);
            // continuar com os próximos itens mesmo se um falhar
            itemId = null;
          }

          // se for bolo de festa, inserir detalhamentos (massa, recheio, cobertura)
          if (isBolo && itemId) {
            // assumimos que os campos v.massa, v.recheio e v.cobertura podem vir como strings separadas por ' | '
            const pickFirst = (s) => {
              if (!s) return null;
              if (Array.isArray(s)) return String(s[0] || '').trim();
              return String(s).split('|')[0].trim();
            };

            const massaName = pickFirst(v.massa);
            const recheioName = pickFirst(v.recheio);
            const coberturaName = pickFirst(v.cobertura);

            const findReceitaId = (name) => {
              if (!name) return null;
              const key = name.toLowerCase();
              if (receitaMap.has(key)) return receitaMap.get(key);
              // tentativa mais flexível: procurar por inclusão
              const found = receitasList.find(r => String(r.nome || '').toLowerCase().includes(key) || key.includes(String(r.nome || '').toLowerCase()));
              return found?.id || null;
            };

            const detalhar = async (fkReceita, observacao) => {
              if (!fkReceita) return;
              const detalhePayload = {
                fkItemPedido: itemId,
                fkReceita: fkReceita,
                observacao: observacao
              };
              try {
                await api.post('/detalhamentos-pedidos', detalhePayload);
              } catch (errDetal) {
                console.error('Erro ao criar detalhamento do pedido:', errDetal, 'payload:', detalhePayload);
                // não interrompe o fluxo
              }
            };

            const massaId = findReceitaId(massaName);
            const recheioId = findReceitaId(recheioName);
            const coberturaId = findReceitaId(coberturaName);

            // Criar um detalhamento para cada categoria (quando disponível)
            if (massaId) await detalhar(massaId, 'Massa');
            if (recheioId) await detalhar(recheioId, 'Recheio');
            if (coberturaId) await detalhar(coberturaId, 'Cobertura');
          }
        }

        // sucesso
        localStorage.removeItem('resumoVendas');
        setVendas([]);
        alert('Pedido e itens registrados com sucesso.');
        window.location.href = '/registro-vendas';
      } catch (err) {
        console.error('Erro ao registrar pedido:', err);
        alert('Ocorreu um erro ao registrar o pedido. Veja o console para detalhes.');
      }
    })();
  };

  return (
    <div className={styles.containerResumoVendas}>
      <Navbar logado={true} />
      
      <div className={styles.headerContainer}>
        <button 
          className={styles.voltarButton}
          onClick={handleVoltar}
        >
          {'< Voltar'}
        </button>
      </div>
      
      <h1 className={styles.pageTitle}>Resumo da Venda</h1>

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
    </div>
  );

  function formatDateBR(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }
}
