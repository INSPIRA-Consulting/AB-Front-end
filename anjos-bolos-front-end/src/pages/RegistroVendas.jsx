import React from "react";
import { Button } from "../components/Button";
import { Navbar } from "../components/Navbar";
import styles from "../styles/RegistroVendas.module.css";
import { Produto } from "../components/Produto";
import { Modal } from "../components/Modal";
import axios from 'axios';
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
          const resp = await axios.get(`/api/produtos`);
          const content = resp && resp.data && resp.data.content ? resp.data.content : [];
          const mapped = content.map(p => {
            const imagem = p.nomeImagem ? `https://bucket-raw-anjos-bolos-1.s3.us-east-1.amazonaws.com/bolos/${p.nomeImagem}` : '';
            const categoria = categoryMap[p.categoriaProduto] || 'tradicionais';
            return {
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
              { categoriaEntrega: tipoVenda, nome: "Bolo de festa", massa: produto.titulo, valorFinal: produto.valor },
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
            console.log("Todas as vendas:", updatedVendas);
          }
        return;
      }

      if (tipo == "recheio") {
          const boloDeFesta = vendas.find((venda) => venda.nome === "Bolo de festa");

          if (!boloDeFesta) {
            setVendas((prevVendas) => [
              ...prevVendas,
              { categoriaEntrega: tipoVenda, nome: "Bolo de festa", recheio: produto.titulo, valorFinal: produto.valor },
            ]);
            console.log("Todas as vendas:", updatedVendas);
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
            console.log("Todas as vendas:", updatedVendas);
          }
        return;
      }

      if (tipo == "cobertura") {
          const boloDeFesta = vendas.find((venda) => venda.nome === "Bolo de festa");

          if (!boloDeFesta) {
            setVendas((prevVendas) => [
              ...prevVendas,
              { categoriaEntrega: tipoVenda, nome: "Bolo de festa", cobertura: produto.titulo, valorFinal: produto.valor },
            ]);
            console.log("Todas as vendas:", updatedVendas);
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
          { nome: produto.titulo, valorFinal: produto.valor, categoriaEntrega: tipoVenda },
        ];
        console.log("Produto selecionado:", produto.titulo);
        console.log("Todas as vendas:", updatedVendas);
        return updatedVendas;
      });
    };

    const resumoVendas = async e => {
        console.log("Vendas registradas:", vendas);
    }

    const navigateToResumoVendas = () => {
      console.log("Vendas registradas:", vendas);
      // Se tiver bolo de festa selecionado, abrir modal de detalhes do bolo
      const hasBoloFesta = vendas.find(v => v.nome === 'Bolo de festa');
      if (hasBoloFesta) {
        setShowBoloFestaModal(true);
        return;
      }

      // Salvar vendas e tipoVenda no localStorage e navegar para resumo
      try {
        const payload = { vendas, tipoVenda };
        // incluir detalhes da encomenda se houver
        if (tipoVenda === 'Encomenda' && orderDetails) {
          payload.orderDetails = orderDetails;
        }
        // incluir detalhes do bolo de festa se preenchidos
        if (festaDetails && (festaDetails.peso || festaDetails.preco || festaDetails.observacao)) {
          payload.festaDetails = festaDetails;
        }
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
    const [festaDetails, setFestaDetails] = React.useState({
      peso: '',
      preco: '',
      observacao: ''
    });

    const cpfDebounceRef = React.useRef(null);

    function normalizeDigits(str = '') {
      return String(str).replace(/\D/g, '');
    }

    async function fetchClientByCpf(cpf) {
      try {
        const resp = await axios.get(`/api/clientes`);
        const list = Array.isArray(resp.data) ? resp.data : [];
        const found = list.find(c => normalizeDigits(c.cpf) === normalizeDigits(cpf));
        if (found) {
          setOrderDetails(prev => ({ ...prev, clientId: found.id, clientName: found.nome, phone: found.telefone }));
        } else {
          // não encontrado: limpar id, manter cpf for user to fill name/phone
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
          const resp = await axios.post(`/api/clientes`, payload);
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

    const handleConfirmBoloFesta = () => {
      // validações simples
      const pesoNum = parseFloat(String(festaDetails.peso).replace(',', '.'));
      const precoNum = parseFloat(String(festaDetails.preco).replace(',', '.'));
      if (Number.isNaN(pesoNum) || pesoNum <= 0) {
        alert('Informe um peso válido para o bolo (kg).');
        return;
      }
      if (Number.isNaN(precoNum) || precoNum <= 0) {
        alert('Informe um preço válido para o bolo.');
        return;
      }

      // salvar junto ao payload e navegar
      try {
        const payload = { vendas, tipoVenda };
        if (tipoVenda === 'Encomenda' && orderDetails) payload.orderDetails = orderDetails;
        payload.festaDetails = { peso: pesoNum, preco: precoNum, observacao: festaDetails.observacao };
        localStorage.setItem('resumoVendas', JSON.stringify(payload));
      } catch (err) {
        console.error('Erro ao salvar festaDetails no localStorage:', err);
      }
      setShowBoloFestaModal(false);
      window.location.href = '/resumo-venda';
    };

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
        <div style={{ padding: 20, maxWidth: 480 }}>
          <h3>Detalhes do Bolo de Festa</h3>
          <div style={{ marginBottom: 12 }}>
            <label>Peso do Bolo (kg)</label>
            <input
              type="text"
              value={festaDetails.peso}
              onChange={e => setFestaDetails(prev => ({ ...prev, peso: e.target.value }))}
              placeholder="Ex: 2.5"
              style={{ width: '100%', padding: 8, marginTop: 6 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Preço (R$)</label>
            <input
              type="text"
              value={festaDetails.preco}
              onChange={e => setFestaDetails(prev => ({ ...prev, preco: e.target.value }))}
              placeholder="Ex: 150.00"
              style={{ width: '100%', padding: 8, marginTop: 6 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Observação (Opcional)</label>
            <textarea
              value={festaDetails.observacao}
              onChange={e => setFestaDetails(prev => ({ ...prev, observacao: e.target.value }))}
              placeholder="Observações sobre o bolo"
              style={{ width: '100%', padding: 8, marginTop: 6, minHeight: 80 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button onClick={handleCancelBoloFesta} style={{ padding: '8px 12px' }}>Cancelar</button>
            <button onClick={handleConfirmBoloFesta} style={{ padding: '8px 12px' }}>Confirmar</button>
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
      <div>
       <div className={styles.selecao}>
      <h4>Escolha a Massa</h4>
      <div className={styles.produtos}>
      {produtos
      .filter((produto) => produto.categoria === "massa")
      .map((produto) => (
      <Produto
      key={produto.titulo}
      imagem={produto.imagem}
      titulo={produto.titulo}
      tipo="festa"
      valor={produto.valor.toFixed(2).replace('.', ',')}
      onAdd={() => handleProdutoClick(produto, "massa")}
      onRemove={() => handleProdutoRemove(produto, "massa")}
      />
      ))}
      </div>
      </div>


      <div className={styles.selecao}>
      <h4>Escolha o Recheio</h4>

      {vendas.find((venda) => venda.massa) && (
        
        <div className={styles.produtos}>
      
        {produtos
        .filter((produto) => produto.categoria === "recheio")
        .map((produto) => (
        <Produto
        key={produto.titulo}
        imagem={produto.imagem}
        titulo={produto.titulo}
        tipo="festa"
        valor={produto.valor.toFixed(2).replace('.', ',')}
        onAdd={() => handleProdutoClick(produto, "recheio")}
        onRemove={() => handleProdutoRemove(produto, "recheio")}
        />
        ))}
      
        </div>

      )}
      </div>
      

      <div className={styles.selecao}>
      <h4>Escolha a cobertura</h4>

      {vendas.find((venda) => venda.recheio) && (
        <div className={styles.produtos}>
        {produtos
        .filter((produto) => produto.categoria === "cobertura")
        .map((produto) => (
        <Produto
        key={produto.titulo}
        imagem={produto.imagem}
        titulo={produto.titulo}
        tipo="festa"
        valor={produto.valor.toFixed(2).replace('.', ',')}
        onAdd={() => handleProdutoClick(produto, "cobertura")}
        onRemove={() => handleProdutoRemove(produto, "cobertura")}
        />
        ))}
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
