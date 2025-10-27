import React from "react";
import { Button } from "../components/Button";
import { Navbar } from "../components/Navbar";
import styles from "../styles/RegistroVendas.module.css";
import { Produto } from "../components/Produto";
import Footer from "../components/Footer";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function RegistroVendas(props) {
  useDocumentTitle(props.titulo);

    const produtos = [
    {
      imagem: "https://s2-receitas.glbimg.com/wJmq1MqeOZZ-VSLlDxRLdL2zj60=/0x0:1280x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/1/N/aQD0fhQs2qW7qlFw0bTA/bolo-de-chocolate-facil.jpg",
      titulo: "Bolo de Chocolate",
      valor: 25.00,
      categoria: "tradicionais"
    },
    {
      imagem: "https://cozinha365.com.br/wp-content/uploads/2025/02/Bolo-de-cenoura-S.webp",
      titulo: "Bolo de Cenoura",
      valor: 25.00,
      categoria: "tradicionais"
    },
    {
      imagem: "https://inspira-hml.s3.us-east-1.amazonaws.com/bolo.png",
      titulo: "Bolo de Mentira",
      valor: 25.00,
      categoria: "tradicionais"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá",
      valor: 25.00,
      categoria: "tradicionais"
    },
    {
      imagem: "https://prezunic.vtexassets.com/arquivos/ids/210693/66db573a62edc14e790f8550.jpg?v=638612475473130000",
      titulo: "Coca-cola 350ml",
      valor: 25.00,
      categoria: "bebidas"
    },
    {
      imagem: "https://chaparadois.com.br/wp-content/uploads/2024/12/Receita-de-Massa-de-Chocolate-Profissional-Perfeito-para-os-seus-Bolos.webp",
      titulo: "Massa de Chocolate",
      valor: 30.00,
      categoria: "massa"
    },
    {
      imagem: "https://www.gabriellfreitass.com.br/wp-content/uploads/2018/03/bolo.jpg",
      titulo: "Massa Branca",
      valor: 30.00,
      categoria: "massa"
    },
    {
      imagem: "https://bolosparavender.com/wp-content/uploads/2019/11/bolo-de-pote-de-prest%C3%ADgio-recheio.jpg",
      titulo: "Prestígio",
      valor: 20.00,
      categoria: "recheio"
    },
    {
      imagem: "https://panelaterapia.com/wp-content/uploads/2020/04/brigs.jpg",
      titulo: "Brigadeiro",
      valor: 20.00,
      categoria: "recheio"
    },
    {
      imagem: "https://images.tcdn.com.br/img/img_prod/1298299/chocolate_granulado_crocante_1_05kg_da_casa_12693_2_7886a4277021754917186d346be0aecc.jpg",
      titulo: "Granulado",
      valor: 1.00,
      categoria: "cobertura"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/M3nykJqlSXkWqr8sEJ-0_3wMhJI=/0x0:1200x675/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2024/b/S/n0uHQSQuqfrqjXYm5kbg/creme-de-leite-e-chantili-caseiros.jpg",
      titulo: "Chantilly",
      valor: 1.00,
      categoria: "cobertura"
    }
  ];

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
      // Navegar para a tela ResumoVendas passando vendas como propriedade
      window.location.href = `/resumo-venda?data=${encodeURIComponent(JSON.stringify(vendas))}`;
    };

    const [tipoVenda, setTipoVenda] = React.useState("Pronta-Entrega");

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
      onChange={(e) => setTipoVenda(e.target.value)}
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
