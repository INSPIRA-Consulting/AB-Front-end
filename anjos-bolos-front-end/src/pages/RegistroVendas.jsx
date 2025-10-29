import React from "react";
import { Button } from "../components/Button";
import { Navbar } from "../components/Navbar";
import styles from "../styles/RegistroVendas.module.css";
import { Produto } from "../components/Produto";
import { Modal } from "../components/Modal";
import api from '../provider/api';
import Footer from "../components/Footer";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function RegistroVendas(props) {
  useDocumentTitle(props.titulo);

    // fallback products (used until API responds)
    const initialProdutos = [
      { imagem: 'https://inspira-hml.s3.us-east-1.amazonaws.com/bolo.png', titulo: 'Bolo de Mentira', valor: 25.0, categoria: 'tradicionais' },
      { imagem: 'https://prezunic.vtexassets.com/arquivos/ids/210693/66db573a62edc14e790f8550.jpg?v=638612475473130000', titulo: 'Coca-cola 350ml', valor: 25.0, categoria: 'bebidas' }
    ];

    const [produtos, setProdutos] = React.useState(initialProdutos);
    // receitas para montagem de bolos de festa
    const [massas, setMassas] = React.useState([]);
    const [recheios, setRecheios] = React.useState([]);
    const [coberturas, setCoberturas] = React.useState([]);

    React.useEffect(() => {
      let mounted = true;

      const categoryMap = {
        'Bolo Tradicional': 'tradicionais',
        'Bolo de Festa': 'festa',
        'Bolo de Pote': 'pote',
        'Bebidas': 'bebidas',
        'Bebida': 'bebidas',
        'Massa': 'massa',
        'Recheio': 'recheio',
        'Cobertura': 'cobertura',
        'Salgados': 'salgados',
        'Salgado': 'salgados'
      };

      async function loadProdutos() {
        try {
          const resp = await api.get(`/produtos`);
          const content = resp && resp.data && resp.data.content ? resp.data.content : [];
          const mapped = content.map(p => {
            const imagem = p.nomeImagem ? `https://bucket-raw-anjos-bolos-1.s3.us-east-1.amazonaws.com/${p.nomeImagem}` : '';
            const categoria = categoryMap[p.categoriaProduto] || 'tradicionais';
            return {
                id: p.id,
              imagem,
              titulo: p.nome,
              valor: Number(p.precoFinal) || 0,
              categoria
            };
          });
          if (mounted && mapped.length) setProdutos(mapped);
        } catch (err) {
          console.error('Erro ao carregar produtos:', err);
        }
      }

      loadProdutos();
      return () => { mounted = false };
    }, []);

      // carregar receitas (massa/recheio/cobertura) do backend
      React.useEffect(() => {
        let mounted = true;
        async function loadReceitas() {
          try {
            let resp;
            resp = await api.get(`/receitas`);
            const list = resp && resp.data ? resp.data : [];
            if (!mounted) return;
            const m = list.filter(r => String(r.tipoReceita || '').toLowerCase().startsWith('massa')).map(r => ({ id: r.id, nome: r.nome }));
            const rec = list.filter(r => String(r.tipoReceita || '').toLowerCase().startsWith('recheio')).map(r => ({ id: r.id, nome: r.nome }));
            const c = list.filter(r => String(r.tipoReceita || '').toLowerCase().startsWith('cobertura')).map(r => ({ id: r.id, nome: r.nome }));
            setMassas(m);
            setRecheios(rec);
            setCoberturas(c);
          } catch (err) {
            console.error('Erro ao carregar receitas:', err);
          }
        }
        loadReceitas();
        return () => { mounted = false };
      }, []);

    const limitador = 24;

    const [isButtonActive, setIsButtonActive] = React.useState(false);

    const [categoria, setCategoria] = React.useState("tradicionais");

    // const [tipo, setTipo] = React.useState("item");

    const [vendas, setVendas] = React.useState([]);

    const handleProdutoClick = (produto, tipo) => {
      setIsButtonActive(true);

      console.log("Tipo selecionado:", tipo);

      if (tipo != "item") {
        console.log("Bolo de festa selecionado:", produto.titulo);
        // Aqui você pode adicionar lógica específica para bolos de festa

        if (tipo == "massa") {
          const boloDeFesta = vendas.find((venda) => venda.nome === "Bolo de festa");

          if (!boloDeFesta) {
            setVendas((prevVendas) => [
              ...prevVendas,
              { categoriaEntrega: tipoVenda, nome: "Bolo de festa", massa: produto.titulo, valorFinal: produto.valor, produtoId: produto.id || null },
            ]);
          } else {
            const updatedVendas = vendas.map((venda) => {
              if (venda.nome === "Bolo de festa") {
                return {
                  ...venda,
                  massa: produto.titulo,
                  valorFinal: (venda.valorFinal + produto.valor),
                };
              }
              return venda;
            });
            setVendas(updatedVendas);
            console.log("Todas as vendas:", vendas);
          }
        return;
      }

      if (tipo == "recheio") {
          const boloDeFesta = vendas.find((venda) => venda.nome === "Bolo de festa");

          if (!boloDeFesta) {
            setVendas((prevVendas) => [
              ...prevVendas,
              { categoriaEntrega: tipoVenda, nome: "Bolo de festa", recheio: produto.titulo, valorFinal: produto.valor, produtoId: produto.id || null },
            ]);
            console.log("Todas as vendas:", vendas);
          } else {
            const updatedVendas = vendas.map((venda) => {
                if (venda.nome === "Bolo de festa") {
                return {
                  ...venda,
                  recheio: venda.recheio ? `${venda.recheio} | ${produto.titulo}` : produto.titulo,
                  valorFinal: venda.valorFinal + produto.valor,
                };
                }
              return venda;
            });
            setVendas(updatedVendas);
            console.log("Todas as vendas:", vendas);
          }
        return;
      }

      if (tipo == "cobertura") {
          const boloDeFesta = vendas.find((venda) => venda.nome === "Bolo de festa");

          if (!boloDeFesta) {
            setVendas((prevVendas) => [
              ...prevVendas,
              { categoriaEntrega: tipoVenda, nome: "Bolo de festa", cobertura: produto.titulo, valorFinal: produto.valor, produtoId: produto.id || null },
            ]);
            console.log("Todas as vendas:", vendas);
          } else {
            const updatedVendas = vendas.map((venda) => {
              if (venda.nome === "Bolo de festa") {
                return {
                  ...venda,
                  cobertura: produto.titulo,
                  valorFinal: (venda.valorFinal + produto.valor),
                };
              }
              return venda;
            });
            setVendas(updatedVendas);
            console.log("Todas as vendas:", updatedVendas);
          }
        return;
      }
    }

      setVendas((prevVendas) => {
          const updatedVendas = [
            ...prevVendas,
            { nome: produto.titulo, valorFinal: produto.valor, categoriaEntrega: tipoVenda, produtoId: produto.id || null },
          ];
        console.log("Produto selecionado:", produto.titulo);
  console.log("Todas as vendas:", vendas);
        return updatedVendas;
      });
    };

  // resumoVendas removed (not used)

    const navigateToResumoVendas = () => {
      console.log("Vendas registradas:", vendas);
      // Se há um bolo parcialmente/totalmente montado, exigir montagem completa antes de registrar
      if (festaMontada && ((festaMontada.massa && festaMontada.massa.length) || (festaMontada.recheio && festaMontada.recheio.length) || (festaMontada.cobertura && festaMontada.cobertura.length))) {
        // só permitir abrir o modal se todos os três componentes tiverem ao menos um item
        if ((festaMontada.massa && festaMontada.massa.length > 0) && (festaMontada.recheio && festaMontada.recheio.length > 0) && (festaMontada.cobertura && festaMontada.cobertura.length > 0)) {
          setShowBoloFestaModal(true);
          return;
        }
        alert('Complete a montagem do bolo (massa, recheio e cobertura) antes de registrar.');
        return;
      }
      // Salvar vendas e tipoVenda no localStorage e navegar para resumo
      try {
        const payload = { vendas, tipoVenda };
        // incluir detalhes da encomenda se houver
        if (tipoVenda === 'Encomenda' && orderDetails) {
          payload.orderDetails = orderDetails;
        }
        // se houver bolos já convertidos em vendas, eles já estarão em `vendas` ou serão adicionados pelo modal
        localStorage.setItem('resumoVendas', JSON.stringify(payload));
      } catch (err) {
        console.error('Erro ao salvar no localStorage:', err);
      }
      window.location.href = '/resumo-venda';
    };

    const [tipoVenda, setTipoVenda] = React.useState("Pronta-Entrega");
    const [showEncomendaModal, setShowEncomendaModal] = React.useState(false);
    const [orderDetails, setOrderDetails] = React.useState({
      date: '',
      time: '',
      cpf: '',
      clientName: '',
      phone: '',
      clientId: null
    });
    const [showBoloFestaModal, setShowBoloFestaModal] = React.useState(false);

  // Estados para montar bolo de festa inline (não salva no banco)
  const [selectedMassa, setSelectedMassa] = React.useState('');
  const [selectedRecheio, setSelectedRecheio] = React.useState('');
  const [selectedCobertura, setSelectedCobertura] = React.useState('');
  // montagem temporária de um único bolo de festa (não salva no banco)
  // cada categoria pode conter múltiplos itens (ex: vários recheios)
  const [festaMontada, setFestaMontada] = React.useState({ id: null, massa: [], recheio: [], cobertura: [] });
  // inputs do modal de confirmação (peso/preço/observação) para o único bolo
  const [festaModalInput, setFestaModalInput] = React.useState({ peso: '', preco: '', observacao: '' });

    const cpfDebounceRef = React.useRef(null);

    function normalizeDigits(str = '') {
      return String(str).replace(/\D/g, '');
    }

    async function fetchClientByCpf(cpf) {
      try {
        const resp = await api.get(`/clientes`);
        const list = Array.isArray(resp.data) ? resp.data : [];
        const found = list.find(c => normalizeDigits(c.cpf) === normalizeDigits(cpf));
        if (found) {
          setOrderDetails(prev => ({ ...prev, clientId: found.id, clientName: found.nome, phone: found.telefone }));
        } else {
          
          setOrderDetails(prev => ({ ...prev, clientId: null, clientName: prev.clientName || '', phone: prev.phone || '' }));
        }
      } catch (err) {
        console.error('Erro ao buscar cliente por CPF:', err);
      }
    }

    function handleCpfChange(e) {
      const val = e.target.value;
      setOrderDetails(prev => ({ ...prev, cpf: val, clientId: null }));
      // debounce a chamada à API
      if (cpfDebounceRef.current) clearTimeout(cpfDebounceRef.current);
      cpfDebounceRef.current = setTimeout(() => {
        if (normalizeDigits(val).length >= 11) {
          fetchClientByCpf(val);
        }
      }, 500);
    }

    function generateTimeOptions() {
      const options = [];
      const start = 8 * 60; // minutes
      const end = 20 * 60; // 20:00
      for (let t = start; t <= end; t += 30) {
        const h = Math.floor(t / 60).toString().padStart(2, '0');
        const m = (t % 60).toString().padStart(2, '0');
        options.push(`${h}:${m}`);
      }
      return options;
    }

    const timeOptions = generateTimeOptions();

    const handleTipoVendaChange = (e) => {
      const value = e.target.value;
      setTipoVenda(value);
      if (value === 'Encomenda') {
        // Abrir modal para detalhes da encomenda
        setShowEncomendaModal(true);
      }
    };

    const handleConfirmEncomenda = async () => {
      // simples validação mínima
      if (!orderDetails.date || !orderDetails.time || !orderDetails.clientName) {
        alert('Por favor, preencha data, horário e nome do cliente.');
        return;
      }
      if (!orderDetails.clientId && !orderDetails.cpf) {
        alert('Por favor, informe o CPF do cliente ou selecione um cliente cadastrado.');
        return;
      }

      // se não houver clientId, cadastrar cliente
      if (!orderDetails.clientId) {
        try {
          const payload = {
            nome: orderDetails.clientName,
            cpf: orderDetails.cpf,
            telefone: orderDetails.phone
          };
          const resp = await api.post(`/clientes`, payload);
          // tentar obter id retornado
          const newClient = resp && resp.data ? resp.data : null;
          if (newClient && newClient.id) {
            setOrderDetails(prev => ({ ...prev, clientId: newClient.id }));
          }
        } catch (err) {
          console.error('Erro ao cadastrar cliente:', err);
          alert('Não foi possível cadastrar o cliente. Tente novamente.');
          return;
        }
      }

      setShowEncomendaModal(false);
    };

    const handleCancelEncomenda = () => {
      // volta para Pronta-Entrega se o usuário cancelar
      setShowEncomendaModal(false);
      setTipoVenda('Pronta-Entrega');
      setOrderDetails({ date: '', time: '', cpf: '', clientName: '', phone: '', clientId: null });
    };

    // handleConfirmBoloFesta removed — modal now handles converting listaFesta into vendas and saving

    const handleCancelBoloFesta = () => {
      setShowBoloFestaModal(false);
      // não navegar — usuário pode revisar seleção
    };

    return (
      <div className={styles.containerRegistroVendas}>
      <Navbar logado={true} />
      <h1>Registro de Vendas</h1>
      <div className={styles.labelFiltro}>
      <div>
      <h4>Tipo de venda</h4>
  <select
  name=""
  id=""
  value={tipoVenda}
  onChange={handleTipoVendaChange}
  >
      <option value="Pronta-Entrega">Pronta-Entrega</option>
      <option value="Encomenda">Encomenda</option>
      </select>
      </div>
      <button
      disabled={!isButtonActive}
      className={!isButtonActive ? styles.inactiveButton : ''}
      onClick={navigateToResumoVendas}
      >
      Registrar
      </button>
      </div>
      {/* Modal de detalhes da encomenda */}
      <Modal isOpen={showEncomendaModal} onClose={handleCancelEncomenda}>
        <div style={{ padding: 20, maxWidth: 480 }}>
          <h3>Detalhes da Encomenda</h3>
          <div style={{ marginBottom: 12 }}>
            <label>Data de retirada</label>
            <input
              type="date"
              value={orderDetails.date}
              onChange={e => setOrderDetails(prev => ({ ...prev, date: e.target.value }))}
              style={{ width: '100%', padding: 8, marginTop: 6 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>CPF do cliente</label>
            <input
              type="text"
              value={orderDetails.cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              style={{ width: '100%', padding: 8, marginTop: 6 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Horário previsto</label>
            <select
              value={orderDetails.time}
              onChange={e => setOrderDetails(prev => ({ ...prev, time: e.target.value }))}
              style={{ width: '100%', padding: 8, marginTop: 6 }}
            >
              <option value="">-- selecione --</option>
              {timeOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Nome do cliente</label>
            <input
              type="text"
              value={orderDetails.clientName}
              onChange={e => setOrderDetails(prev => ({ ...prev, clientName: e.target.value }))}
              placeholder="Nome do cliente"
              style={{ width: '100%', padding: 8, marginTop: 6 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Telefone do cliente</label>
            <input
              type="tel"
              value={orderDetails.phone}
              onChange={e => setOrderDetails(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(xx) xxxxx-xxxx"
              style={{ width: '100%', padding: 8, marginTop: 6 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button onClick={handleCancelEncomenda} style={{ padding: '8px 12px' }}>Cancelar</button>
            <button onClick={handleConfirmEncomenda} style={{ padding: '8px 12px' }}>Confirmar</button>
          </div>
        </div>
      </Modal>
      {/* Modal de detalhes do Bolo de Festa */}
      <Modal isOpen={showBoloFestaModal} onClose={handleCancelBoloFesta}>
        <div style={{ padding: 20, maxWidth: 720 }}>
          <h3>Detalhes dos Bolos de Festa</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {!festaMontada || (!((festaMontada.massa && festaMontada.massa.length) || (festaMontada.recheio && festaMontada.recheio.length) || (festaMontada.cobertura && festaMontada.cobertura.length))) ? (
              <div>Nenhum bolo montado. Volte e adicione massa, recheio e cobertura antes de confirmar.</div>
            ) : (
              <div style={{ background: '#fff', border: '1px solid #e8e1d8', padding: 12, borderRadius: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong>Bolo</strong>
                  <span style={{ color: '#6b3200' }}>{(festaMontada.massa && festaMontada.massa.length) ? festaMontada.massa.join(' | ') : '-'} / {(festaMontada.recheio && festaMontada.recheio.length) ? festaMontada.recheio.join(' | ') : '-'} / {(festaMontada.cobertura && festaMontada.cobertura.length) ? festaMontada.cobertura.join(' | ') : '-'}</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label>Peso (kg)</label>
                    <input
                      type="text"
                      value={festaModalInput.peso || ''}
                      onChange={e => setFestaModalInput(prev => ({ ...prev, peso: e.target.value }))}
                      placeholder="Ex: 2.5"
                      style={{ width: '70%', padding: 8, marginTop: 6 }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Preço (R$)</label>
                    <input
                      type="text"
                      value={festaModalInput.preco || ''}
                      onChange={e => setFestaModalInput(prev => ({ ...prev, preco: e.target.value }))}
                      placeholder="Ex: 150.00"
                      style={{ width: '70%', padding: 8, marginTop: 6 }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <label>Observação (Opcional)</label>
                  <textarea
                    value={(festaModalInput.observacao) || ''}
                    onChange={e => setFestaModalInput(prev => ({ ...prev, observacao: e.target.value }))}
                    placeholder="Observações sobre o bolo"
                    style={{ width: '80%', padding: 8, marginTop: 6, minHeight: 60 }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button onClick={handleCancelBoloFesta} style={{ padding: '8px 12px' }}>Cancelar</button>
            <button onClick={() => {
              // validar e transformar o bolo montado em uma venda com os inputs preenchidos
              try {
                if (!festaMontada || !( (festaMontada.massa && festaMontada.massa.length > 0) && (festaMontada.recheio && festaMontada.recheio.length > 0) && (festaMontada.cobertura && festaMontada.cobertura.length > 0) )) {
                  throw new Error('Nenhum bolo completamente montado para confirmar.');
                }
                const pesoNum = parseFloat(String(festaModalInput.peso || '').replace(',', '.'));
                const precoNum = parseFloat(String(festaModalInput.preco || '').replace(',', '.'));
                if (Number.isNaN(pesoNum) || pesoNum <= 0) throw new Error('Informe um peso válido para o bolo.');
                if (Number.isNaN(precoNum) || precoNum <= 0) throw new Error('Informe um preço válido para o bolo.');

                const bolo = {
                  categoriaEntrega: tipoVenda,
                  nome: 'Bolo de festa',
                  massa: (festaMontada.massa || []).join(' | '),
                  recheio: (festaMontada.recheio || []).join(' | '),
                  cobertura: (festaMontada.cobertura || []).join(' | '),
                  peso: pesoNum,
                  valorFinal: precoNum,
                  observacao: festaModalInput.observacao || ''
                };

                // adicionar à lista de vendas e salvar
                const updatedVendas = [...vendas, bolo];
                const payload = { vendas: updatedVendas, tipoVenda };
                if (tipoVenda === 'Encomenda' && orderDetails) payload.orderDetails = orderDetails;
                localStorage.setItem('resumoVendas', JSON.stringify(payload));

                
                setFestaMontada({ id: null, massa: [], recheio: [], cobertura: [] });
                setFestaModalInput({ peso: '', preco: '', observacao: '' });

                // navegar
                window.location.href = '/resumo-venda';
              } catch (err) {
                alert(err.message || 'Erro ao confirmar o bolo. Preencha todos os campos corretamente.');
                console.error(err);
              }
            }} style={{ padding: '8px 12px' }}>Confirmar e Continuar</button>
          </div>
        </div>
      </Modal>
      <div className={styles.filtro}>
      <h4>Filtrar por categorias</h4>
      <div>
      <label>
      <input
      type="radio"
      name="categoria"
      value="tradicionais"
      defaultChecked
      onClick={() => setCategoria("tradicionais")} />
      Bolos Tradicionais
      </label>
      <label>
      <input
      type="radio"
      name="categoria"
      value="bebidas"
      onClick={() => setCategoria("bebidas")} />
      Bebidas
      </label>
      <label>
      <input
      type="radio"
      name="categoria"
      value="salgados"
      onClick={() => setCategoria("salgados")} />
      Salgados
      </label>
      <label>
      <input
      type="radio"
      name="categoria"
      value="pote"
      onClick={() => setCategoria("pote")} />
      Bolos de Pote
      </label>
      <label>
      <input
      type="radio"
      name="categoria"
      value="festa"
      onClick={() => setCategoria("festa")} />
      Bolos de Festa
      </label>
      </div>
      </div>

      {categoria === 'festa' && (
  <div className={styles.festaAssembly} style={{ color: '#6b3200', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h3 style={{ textAlign: 'center' }}>Montar Bolo de Festa</h3>

    <div style={{ display: 'grid', gap: 12, maxWidth: 760, width: '100%' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label>Massa</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={selectedMassa} onChange={e => setSelectedMassa(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }}>
                  <option value="">-- selecione massa --</option>
                  {massas && massas.length ? massas.map(r => (
                    <option key={r.id} value={r.nome}>{r.nome}</option>
                  )) : produtos.filter(p => p.categoria === 'massa').map(p => (
                    <option key={p.titulo} value={p.titulo}>{p.titulo}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label>Recheio</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={selectedRecheio} onChange={e => setSelectedRecheio(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }}>
                  <option value="">-- selecione recheio --</option>
                  {recheios && recheios.length ? recheios.map(r => (
                    <option key={r.id} value={r.nome}>{r.nome}</option>
                  )) : produtos.filter(p => p.categoria === 'recheio').map(p => (
                    <option key={p.titulo} value={p.titulo}>{p.titulo}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label>Cobertura</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select value={selectedCobertura} onChange={e => setSelectedCobertura(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }}>
                  <option value="">-- selecione cobertura --</option>
                  {coberturas && coberturas.length ? coberturas.map(r => (
                    <option key={r.id} value={r.nome}>{r.nome}</option>
                  )) : produtos.filter(p => p.categoria === 'cobertura').map(p => (
                    <option key={p.titulo} value={p.titulo}>{p.titulo}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>



          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => {
              // adicionar o item selecionado à montagem atual: permite múltiplos itens por categoria
              const id = festaMontada.id || (Date.now().toString(36) + Math.random().toString(36).slice(2,8));
              if (selectedMassa) {
                setFestaMontada(prev => ({ ...prev, id, massa: [...(prev.massa || []), selectedMassa] }));
                setIsButtonActive(true);
                setSelectedMassa('');
                return;
              }
              if (selectedRecheio) {
                setFestaMontada(prev => ({ ...prev, id, recheio: [...(prev.recheio || []), selectedRecheio] }));
                setIsButtonActive(true);
                setSelectedRecheio('');
                return;
              }
              if (selectedCobertura) {
                setFestaMontada(prev => ({ ...prev, id, cobertura: [...(prev.cobertura || []), selectedCobertura] }));
                setIsButtonActive(true);
                setSelectedCobertura('');
                return;
              }
              alert('Selecione uma massa, recheio ou cobertura antes de adicionar.');
            }} style={{ padding: '8px 12px' }}>Adicionar item</button>
          </div>

          {/* Exibir resumo da montagem atual (um único bolo) */}
          {(festaMontada && ((festaMontada.massa && festaMontada.massa.length) || (festaMontada.recheio && festaMontada.recheio.length) || (festaMontada.cobertura && festaMontada.cobertura.length))) && (
            <div style={{ marginTop: 12, background: '#fff', border: '2px solid #6b3200', borderRadius: 8, padding: 8 }}>
              <strong>Montagem atual</strong>
              <div style={{ marginTop: 8 }}>
                <div style={{ color: '#6b3200' }}><strong>Massa:</strong> {(festaMontada.massa && festaMontada.massa.length) ? festaMontada.massa.join(' | ') : '-'} </div>
                <div style={{ color: '#6b3200' }}><strong>Recheio:</strong> {(festaMontada.recheio && festaMontada.recheio.length) ? festaMontada.recheio.join(' | ') : '-'} </div>
                <div style={{ color: '#6b3200' }}><strong>Cobertura:</strong> {(festaMontada.cobertura && festaMontada.cobertura.length) ? festaMontada.cobertura.join(' | ') : '-'} </div>
                <div style={{ marginTop: 8 }}>
                  <button type="button" onClick={() => {
                    setFestaMontada({ id: null, massa: [], recheio: [], cobertura: [] });
                    setIsButtonActive(vendas.length > 0);
                  }} className={styles.removerButton}>Remover montagem</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      <div className={styles.produtos}>
      {produtos
      .filter((produto) => produto.categoria === categoria)
      .map((produto) => (
      <Produto
      key={produto.titulo}
      imagem={produto.imagem}
      titulo={produto.titulo}
      valor={produto.valor.toFixed(2).replace('.', ',')}
      onAdd={() => handleProdutoClick(produto, "item")}
      // onClick={() => setTipo("item")}
      onRemove={() => handleProdutoRemove(produto, "item")}
      />
      ))}
      </div>

      <Footer />
      </div>
    );

    function handleProdutoRemove(produto, tipo) {
      setVendas((prevVendas) => {
        let updatedVendas;

        if (tipo !== "item") {
          updatedVendas = prevVendas.map((venda) => {
            if (venda.nome === "Bolo de festa") {
              const updatedVenda = { ...venda };
              delete updatedVenda[tipo];
              updatedVenda.valorFinal -= produto.valor;
              return updatedVenda;
            }
            return venda;
          });
        } else {
          updatedVendas = prevVendas.filter(
            (venda) => venda.nome !== produto.titulo
          );
        }
        console.log("Produto removido:", produto.titulo);
        console.log("Todas as vendas:", updatedVendas);
        setIsButtonActive(updatedVendas.length > 0);
        return updatedVendas;
      });
    }
}
