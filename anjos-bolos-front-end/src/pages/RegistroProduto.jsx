import { useState } from 'react';
import { FaTrashCan } from "react-icons/fa6";
import { Navbar } from '../components/Navbar';
import styles from '../styles/RegistroProduto.module.css';

export function RegistroProduto() {
  const [ingrediente, setIngrediente] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState('g');
  const [listaIngredientes, setListaIngredientes] = useState([]);
  const [nomeProduto, setNomeProduto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [imagem, setImagem] = useState('/src/assets/bolinho15.png');

  function adicionarIngrediente() {
    const qtd = quantidade === '' ? 1 : Number(quantidade);
    if (ingrediente && qtd > 0) {
      setListaIngredientes([
        ...listaIngredientes,
        { nome: ingrediente, quantidade: qtd, unidade }
      ]);
      setIngrediente('');
      setQuantidade('');
      setUnidade('g');
    }
  }

  function removerIngrediente(index) {
    setListaIngredientes(listaIngredientes.filter((_, i) => i !== index));
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
          {/* Seção de Adição de Ingrediente */}
          <div className={styles.ingredienteSection}>
            <h2 className={styles.sectionTitle}>Adição de Ingrediente</h2>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Ingrediente:</label>
              <input
                type="text"
                value={ingrediente}
                onChange={e => setIngrediente(e.target.value)}
                className={styles.input}
                placeholder="Ovo"
              />
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
              onClick={adicionarIngrediente}
              className={styles.adicionarButton}
              type="button"
            >
              Adicionar
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
            
            <div className={styles.ingredientesLista}>
              <label className={styles.label}>Lista de Ingredientes:</label>
              <div className={styles.ingredientesTable}>
                {listaIngredientes.map((ing, idx) => (
                  <div key={idx} className={styles.ingredienteItem}>
                    <span className={styles.ingredienteNome}>• {ing.nome}</span>
                    <span className={styles.ingredienteQuantidade}>
                      {ing.quantidade} {ing.unidade}
                    </span>
                    <button
                      onClick={() => removerIngrediente(idx)}
                      className={styles.removerButton}
                      type="button"
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.buttonContainer}>
              <button className={styles.cadastrarButton} type="button">
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}