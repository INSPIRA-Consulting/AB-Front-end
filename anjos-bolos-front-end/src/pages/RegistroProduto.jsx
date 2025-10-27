import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashCan } from "react-icons/fa6";
import { Navbar } from '../components/Navbar';
import { Modal } from '../components/Modal';
import styles from '../styles/RegistroProduto.module.css';

export function RegistroProduto() {
  const [receita, setreceita] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('g');
  const [listareceitas, setListareceitas] = useState([]);
  // Banco de receitas existentes
  const [receitasBanco, setReceitasBanco] = useState([]);
  const [carregandoReceitas, setCarregandoReceitas] = useState(false);
  const [erroReceitas, setErroReceitas] = useState('');
  const [receitaSelecionadaId, setReceitaSelecionadaId] = useState('');
  const [nomeProduto, setNomeProduto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [imagem, setImagem] = useState('/src/assets/bolinho15.png');

  // Estado do modal de criação de receita
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeReceita, setNomeReceita] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredienteSelecionado, setIngredienteSelecionado] = useState('');
  const [quantidadeIngrediente, setQuantidadeIngrediente] = useState('');
  const [tipoReceita, setTipoReceita] = useState('');
  const [carregandoIngredientes, setCarregandoIngredientes] = useState(false);
  const [erroIngredientes, setErroIngredientes] = useState('');
  const [ingredientesReceita, setIngredientesReceita] = useState([]);
  // Detalhes da receita
  const [detalheAberto, setDetalheAberto] = useState(false);
  const [receitaDetalhe, setReceitaDetalhe] = useState(null);

  // Mapeia a medida da API para uma unidade curta para exibição
  function getUnidadeFromMedida(medidaApi) {
    const s = String(medidaApi || '').toLowerCase();
    if (s.startsWith('gram')) return 'g'; // grama, gramas
    if (s.startsWith('quilo')) return 'kg'; // quilograma
    if (s.startsWith('mili')) return 'ml'; // mililitro, mililitros
    if (s.startsWith('litro')) return 'l'; // litro, litros
    if (s.startsWith('un')) return 'un'; // unidade, unidades
    return '';
  }

  // Converte unidade da API de receitas para sufixo curto
  function mapUnidadeFromApi(unidadeApi) {
    const u = String(unidadeApi || '').toUpperCase();
    if (u === 'GRAMA') return 'g';
    if (u === 'QUILOGRAMA') return 'kg';
    if (u === 'MILILITRO') return 'ml';
    if (u === 'LITRO') return 'l';
    if (u === 'UNIDADE') return 'un';
    return '';
  }

  // Converte a unidade curta para o formato esperado pela API de receitas
  function mapUnidadeToApi(unidadeCurta) {
    const u = String(unidadeCurta || '').toLowerCase();
    if (u === 'g') return 'GRAMA';
    if (u === 'kg') return 'QUILOGRAMA';
    if (u === 'ml') return 'MILILITRO';
    if (u === 'l') return 'LITRO';
    if (u === 'un') return 'UNIDADE';
    return 'UNIDADE';
  }

  const salvarReceita = async e => {
        e.preventDefault();

        let quantidadeConvertida = quantidade;

        if (medida === "quilograma" || medida === "mililitro") {
            quantidadeConvertida = quantidade * 1000;
        }
        
        axios.post(`${import.meta.env.IP_API}/receitas`, {
            nome: nomeProduto,
            receitas: listareceitas,
            quantidadeEmbalagem: quantidadeConvertida
        })
        .then((response)=>{
            console.log(response.data);
            setNome("");
            setMedida("");
            setValor("");
            quantidade("");
            alert("receita cadastrado com sucesso!");
        })        
    }

  // Abrir modal de criação de receita
  function criarreceita() {
    setModalAberto(true);
  }

  // Buscar ingredientes quando o modal abrir
  useEffect(() => {
    if (!modalAberto) return;
    const fetchIngredientes = async () => {
      setCarregandoIngredientes(true);
      setErroIngredientes('');
      try {
        const resp = await axios.get('https://682cf6724fae188947546f88.mockapi.io/inspira/ingredientes');
        const dados = Array.isArray(resp.data) ? resp.data : [];
        setIngredientes(dados);

      } catch (err) {
        console.error('Erro ao buscar ingredientes:', err);
        setErroIngredientes('Não foi possível carregar os ingredientes.');
        setIngredientes([]);
      } finally {
        setCarregandoIngredientes(false);
      }
    };
    fetchIngredientes();
  }, [modalAberto]);

  // Carregar receitas existentes (banco) ao montar a página
  useEffect(() => {
    const fetchReceitas = async () => {
      setCarregandoReceitas(true);
      setErroReceitas('');
      try {
        const resp = await axios.get('https://682cf6724fae188947546f88.mockapi.io/inspira/receitas');
        const dados = Array.isArray(resp.data) ? resp.data : [];
        setReceitasBanco(dados);
      } catch (err) {
        console.error('Erro ao buscar receitas:', err);
        setErroReceitas('Não foi possível carregar as receitas.');
        setReceitasBanco([]);
      } finally {
        setCarregandoReceitas(false);
      }
    };
    fetchReceitas();
  }, []);

  // Salvar dados do modal (apenas adiciona na lista por enquanto)
  function confirmarCriacaoReceita(e) {
    e.preventDefault();
    if (!nomeReceita || !tipoReceita) {
      alert('Preencha o nome e o tipo da receita.');
      return;
    }
    if (ingredientesReceita.length === 0) {
      alert('Adicione pelo menos um ingrediente à receita.');
      return;
    }

    const novaReceita = {
      nome: nomeReceita,
      tipo: tipoReceita,
      ingredientes: ingredientesReceita.map(ing => ({
        ingredienteId: ing.ingredienteId,
        ingredienteNome: ing.ingredienteNome,
        quantidade: ing.quantidade,
        unidade: ing.unidade || ''
      }))
    };

    // POST para a API de receitas conforme o modelo informado
    const payloadApi = {
      nome: nomeReceita,
      ingredientes: ingredientesReceita.map(ing => ({
        ingredienteId: isNaN(Number(ing.ingredienteId)) ? ing.ingredienteId : Number(ing.ingredienteId),
        quantidade: Number(ing.quantidade),
        unidadeMedida: mapUnidadeToApi(ing.unidade)
      }))
    };

    axios.post('https://682cf6724fae188947546f88.mockapi.io/inspira/receitas', payloadApi)
      .then(() => {
        alert('Receita registrada com sucesso!');
      })
      .catch((err) => {
        console.error('Erro ao registrar receita:', err);
        alert('Não foi possível registrar a receita. Tente novamente.');
      });

    setListareceitas(prev => [...prev, novaReceita]);
    // Resetar e fechar modal
    setNomeReceita('');
    setIngredienteSelecionado('');
    setQuantidadeIngrediente('');
    setTipoReceita('');
    setIngredientesReceita([]);
    setModalAberto(false);
  }

  // Adicionar ingrediente na lista temporária do modal
  function adicionarIngredienteModal() {
    if (!ingredienteSelecionado || !quantidadeIngrediente) {
      alert('Selecione um ingrediente e informe a quantidade.');
      return;
    }
    const ingrediente = ingredientes.find(i => String(i.id) === String(ingredienteSelecionado)) ||
                        ingredientes.find(i => String(i._id) === String(ingredienteSelecionado));
    const novo = {
      ingredienteId: ingrediente?.id || ingrediente?._id || ingredienteSelecionado,
      ingredienteNome: ingrediente?.nome || '',
      quantidade: Number(quantidadeIngrediente),
      unidade: getUnidadeFromMedida(ingrediente?.medida)
    };
    setIngredientesReceita(prev => [...prev, novo]);
    setIngredienteSelecionado('');
    setQuantidadeIngrediente('');
  }

  function removerIngredienteModal(index) {
    setIngredientesReceita(prev => prev.filter((_, i) => i !== index));
  }

  // Confirmação ao cancelar o modal de criação de receita
  function handleCancelarModal() {
    const hasDados =
      (nomeReceita && nomeReceita.trim() !== '') ||
      (tipoReceita && tipoReceita.trim() !== '') ||
      ingredientesReceita.length > 0 ||
      (ingredienteSelecionado && String(ingredienteSelecionado).trim() !== '') ||
      (quantidadeIngrediente && String(quantidadeIngrediente).trim() !== '');

    if (!hasDados) {
      setModalAberto(false);
      return;
    }

    const confirmar = window.confirm('Deseja cancelar a criação desta receita? As informações preenchidas serão perdidas.');
    if (confirmar) {
      setNomeReceita('');
      setIngredienteSelecionado('');
      setQuantidadeIngrediente('');
      setTipoReceita('');
      setIngredientesReceita([]);
      setModalAberto(false);
    }
  }

  function adicionarreceita() {
    if (!receitaSelecionadaId) {
      alert('Selecione uma receita.');
      return;
    }
    const qtd = quantidade === '' ? 1 : Number(quantidade);
    if (!Number.isFinite(qtd) || qtd < 1) {
      alert('Informe a quantidade de receitas (mínimo 1).');
      return;
    }
    const selecionada = receitasBanco.find(r => String(r.id) === String(receitaSelecionadaId));
    if (!selecionada) {
      alert('Receita não encontrada.');
      return;
    }

    // Normaliza para o formato usado na lista local
    const entrada = {
      nome: selecionada.nome,
      // tipo pode não existir no modelo da API; manter undefined
      ingredientes: Array.isArray(selecionada.ingredientes)
        ? selecionada.ingredientes.map((ing) => ({
            ingredienteId: ing.ingredienteId,
            ingredienteNome: ing.ingredienteNome || '', // pode vir vazio
            quantidade: ing.quantidade,
            unidade: mapUnidadeFromApi(ing.unidadeMedida)
          }))
        : []
    };

    // Adiciona a quantidade solicitada de receitas
    const entradas = Array.from({ length: qtd }, () => ({
      ...entrada
    }));

    setListareceitas(prev => [...prev, ...entradas]);
    setReceitaSelecionadaId('');
    setQuantidade('');
  }

  function removerreceita(index) {
    setListareceitas(listareceitas.filter((_, i) => i !== index));
  }

  function abrirDetalhes(item) {
    setReceitaDetalhe(item);
    setDetalheAberto(true);
  }

  function handleImagem(e) {
    if (e.target.files[0]) {
      setImagem(URL.createObjectURL(e.target.files[0]));
    }
  }

  function incrementarQuantidade() {
    setQuantidade(q => {
      const current = q === '' ? 0 : Number(q);
      return current + 1;
    });
  }

  function decrementarQuantidade() {
    setQuantidade(q => {
      const current = q === '' ? 1 : Number(q);
      return Math.max(1, current - 1);
    });
  }

  function handleVoltar() {
    window.location.href = '/catalogo-produtos';
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar logado={true} activePage="produtos" />
      
      <div className={styles.headerContainer}>
        <button 
          className={styles.voltarButton}
          onClick={handleVoltar}
        >
          {'< Voltar'}
        </button>
      </div>
      
      <h1 className={styles.pageTitle}>Registro de Produto</h1>
      
      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          {/* Seção de Adição de receita */}
          <div className={styles.receitaSection}>
            <h2 className={styles.sectionTitle}>Adição de Receita</h2>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Receita:</label>
              <select
                className={styles.select}
                value={receitaSelecionadaId}
                onChange={(e) => setReceitaSelecionadaId(e.target.value)}
              >
                <option value="" disabled>{carregandoReceitas ? 'Carregando...' : 'Selecione uma receita'}</option>
                {erroReceitas && <option value="" disabled>{erroReceitas}</option>}
                {!carregandoReceitas && !erroReceitas && receitasBanco.map((r) => (
                  <option key={r.id} value={r.id}>{r.nome}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Quantidade:</label>
              <div className={styles.quantidadeContainer}>
                  <input
                    type="number"
                    min={1}
                    value={quantidade}
                    onChange={e => {
                      const value = e.target.value;
                      if (value === '' || value === '0') {
                        setQuantidade('');
                      } else {
                        setQuantidade(Number(value));
                      }
                    }}
                    className={styles.input}
                    style={{ width: '100px' }}
                    placeholder="Valor"
                  />
              </div>
            </div>
            
            <button 
              onClick={adicionarreceita}
              className={styles.adicionarButton}
              type="button"
            >
              Adicionar
            </button>
            <button 
              onClick={criarreceita}
              className={styles.adicionarButton}
              type="button"
            >
              Criar receita
            </button>
          </div>
          
          {/* Seção de Dados do Produto */}
          <div className={styles.produtoSection}>
            <div className={styles.produtoTop}>
              <div className={styles.produtoInputs}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome do Produto:</label>
                  <input
                    type="text"
                    value={nomeProduto}
                    onChange={e => setNomeProduto(e.target.value)}
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Categoria:</label>
                    <select
                      value={categoria}
                      onChange={e => setCategoria(e.target.value)}
                      className={styles.select}
                    >
                      <option value="Recheio">Recheio</option>
                      <option value="Massa">Massa</option>
                      <option value="Cobertura">Cobertura</option>
                      <option value="Decoração">Decoração</option>
                    </select>
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Valor:</label>
                    <input
                      type="text"
                      value={valor}
                      onChange={e => setValor(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>
              
              <div className={styles.imagemSection}>
                <label className={styles.label}>Imagem (opcional):</label>
                <div className={styles.imagemContainer}>
                  <div className={styles.imagemPreview}>
                    {imagem ? (
                      <img src={imagem} alt="Produto" className={styles.imagemDisplay} />
                    ) : (
                      <div className={styles.imagemPlaceholder}></div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagem}
                    id="imagem-produto"
                    className={styles.imagemInput}
                  />
                  <label htmlFor="imagem-produto" className={styles.escolherButton}>
                    Escolher
                  </label>
                </div>
              </div>
            </div>
            
            <div className={styles.receitasLista}>
              <label className={styles.label}>Lista de receitas:</label>
              <div className={styles.receitasTable}>
                {listareceitas.map((item, idx) => {
                  const isRecipe = Array.isArray(item.ingredientes);
                  return (
                    <div key={idx} className={styles.receitaItem} onClick={() => abrirDetalhes(item)} style={{ cursor: 'pointer' }}>
                      <span className={styles.receitaNome}>
                        • {item.nome} {isRecipe && item.tipo ? `(${String(item.tipo).charAt(0).toUpperCase() + String(item.tipo).slice(1)})` : ''}
                      </span>
                      <span className={styles.receitaQuantidade}>
                        {isRecipe ? `${item.ingredientes?.length || 0} ${((item.ingredientes?.length || 0) === 1) ? 'item' : 'itens'}` : `${item.quantidade} ${item.unidade}`}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removerreceita(idx); }}
                        className={styles.removerButton}
                        type="button"
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className={styles.buttonContainer}>
              <button className={styles.cadastrarButton} onClick={salvarReceita} type="button">
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de criação de receita */}
  <Modal isOpen={modalAberto} onClose={handleCancelarModal}>
        <div style={{ padding: '8px 8px 16px 8px', width: 720 }}>
          <h2 className={styles.sectionTitle} style={{ marginTop: 6, marginBottom: 12 }}>Criar Receita</h2>
          <form onSubmit={confirmarCriacaoReceita}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nome da receita</label>
              <input
                type="text"
                value={nomeReceita}
                onChange={(e) => setNomeReceita(e.target.value)}
                className={styles.input}
                placeholder="Ex: Massa de chocolate"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Adicionar ingrediente à receita</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  className={styles.select}
                  value={ingredienteSelecionado}
                  onChange={(e) => setIngredienteSelecionado(e.target.value)}
                  style={{ flex: 1 }}
                >
                  <option value="" disabled>{carregandoIngredientes ? 'Carregando...' : 'Selecione um ingrediente'}</option>
                  {erroIngredientes && <option value="" disabled>{erroIngredientes}</option>}
                  {!carregandoIngredientes && !erroIngredientes && ingredientes.map((ing) => (
                    <option key={ing.id || ing._id} value={ing.id || ing._id}>{ing.nome}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  className={styles.input}
                  value={quantidadeIngrediente}
                  onChange={(e) => setQuantidadeIngrediente(e.target.value)}
                  placeholder="Qtd"
                  style={{ width: '140px' }}
                />
              </div>
              <div style={{ marginTop: 8 }}>
                <button type="button" className={styles.adicionarButton} onClick={adicionarIngredienteModal}>
                  Adicionar ingrediente
                </button>
              </div>
            </div>

            {/* Tabela dos ingredientes adicionados */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Ingredientes adicionados</label>
              <div style={{
                background: '#fff',
                border: '2px solid #6b3200',
                borderRadius: 8,
                maxHeight: 180,
                overflowY: 'auto'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9f7f4' }}>
                      <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5ded8', color: '#6b3200' }}>Ingrediente</th>
                      <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #e5ded8', color: '#6b3200', width: 160 }}>Quantidade</th>
                      <th style={{ width: 80 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredientesReceita.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ padding: '10px', textAlign: 'center', color: '#6b3200' }}>Nenhum ingrediente adicionado</td>
                      </tr>
                    ) : (
                      ingredientesReceita.map((ing, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '8px', borderBottom: '1px solid #f0ece8', color: '#6b3200' }}>{ing.ingredienteNome}</td>
                          <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0ece8', color: '#6b3200' }}>
                            {ing.quantidade}{ing.unidade || ''}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0ece8' }}>
                            <button type="button" className={styles.removerButton} onClick={() => removerIngredienteModal(idx)}>
                              <FaTrashCan />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Tipo da receita</label>
              <select
                className={styles.select}
                value={tipoReceita}
                onChange={(e) => setTipoReceita(e.target.value)}
              >
                <option value="" disabled>Selecione o tipo</option>
                <option value="massa">Massa</option>
                <option value="recheio">Recheio</option>
                <option value="cobertura">Cobertura</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button type="button" className={styles.adicionarButton} onClick={handleCancelarModal} style={{ flex: 1 }}>Cancelar</button>
              <button type="submit" className={styles.adicionarButton} style={{ flex: 1 }}>Salvar</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal de detalhes da receita */}
      <Modal isOpen={detalheAberto} onClose={() => setDetalheAberto(false)}>
        <div style={{ padding: 12, width: 720 }}>
          {receitaDetalhe && (
            <>
              <h2 className={styles.sectionTitle} style={{ marginTop: 6, marginBottom: 12 }}>
                Detalhes: {receitaDetalhe.nome} {Array.isArray(receitaDetalhe.ingredientes) && receitaDetalhe.tipo ? `(${String(receitaDetalhe.tipo).charAt(0).toUpperCase() + String(receitaDetalhe.tipo).slice(1)})` : ''}
              </h2>

              {Array.isArray(receitaDetalhe.ingredientes) ? (
                <div>
                  <div style={{
                    background: '#fff',
                    border: '2px solid #6b3200',
                    borderRadius: 8,
                    maxHeight: 260,
                    overflowY: 'auto'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f9f7f4' }}>
                          <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #e5ded8', color: '#6b3200' }}>Ingrediente</th>
                          <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #e5ded8', color: '#6b3200', width: 180 }}>Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receitaDetalhe.ingredientes.map((ing, i) => (
                          <tr key={i}>
                            <td style={{ padding: '8px', borderBottom: '1px solid #f0ece8', color: '#6b3200' }}>{ing.ingredienteNome || `ID ${ing.ingredienteId}`}</td>
                            <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0ece8', color: '#6b3200' }}>{ing.quantidade}{ing.unidade || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: '#fff',
                  border: '2px solid #6b3200',
                  borderRadius: 8,
                  padding: 12
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px', color: '#6b3200' }}>
                    <span>Ingrediente</span>
                    <span>Quantidade</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px', color: '#6b3200', borderTop: '1px solid #f0ece8' }}>
                    <span>{receitaDetalhe.nome}</span>
                    <span>{receitaDetalhe.quantidade} {receitaDetalhe.unidade}</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="button" className={styles.adicionarButton} onClick={() => setDetalheAberto(false)} style={{ flex: 1 }}>Fechar</button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}