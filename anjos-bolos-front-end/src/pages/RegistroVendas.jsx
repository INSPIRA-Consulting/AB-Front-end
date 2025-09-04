import React from "react";
import { Button } from "../components/Button";
import { Navbar } from "../components/Navbar";
import styles from "../styles/RegistroVendas.module.css";
import { Produto } from "../components/Produto";
import Footer from "../components/Footer";

export function RegistroVendas() {

    const produtos = [
    {
      imagem: "https://s2-receitas.glbimg.com/wJmq1MqeOZZ-VSLlDxRLdL2zj60=/0x0:1280x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/1/N/aQD0fhQs2qW7qlFw0bTA/bolo-de-chocolate-facil.jpg",
      titulo: "Bolo de Chocolate"
    },
    {
      imagem: "https://cozinha365.com.br/wp-content/uploads/2025/02/Bolo-de-cenoura-S.webp",
      titulo: "Bolo de Cenoura"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    },
    {
      imagem: "https://s2-receitas.glbimg.com/5rvytTYCmTaPYu8yCsaya0GaA08=/0x0:1000x667/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/Q/C/2DeqRTSI2oR5wVBFVVOw/delicious-cornmeal-cake-traditional-brazilian-cake.jpg",
      titulo: "Bolo de Fubá"
    }
  ];

    const limitador = 24;

    const [isButtonActive, setIsButtonActive] = React.useState(false);

    const handleProdutoClick = () => {
    setIsButtonActive(true);
    console.log("Produto selecionado");
  };

    return (
        <div className={styles.container}>
            <Navbar logado={true} />
            <h1>Registro de Vendas</h1>
            <div className={styles.labelFiltro}>
                <div>
                    <h4>Tipo de venda</h4>
                    <select name="" id="">
                        <option value="">Pronta-Entrega</option>
                        <option value="">Encomenda</option>
                    </select>
                </div>
                <button disabled={!isButtonActive} className={!isButtonActive ? styles.inactiveButton : ''}>
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
                            defaultChecked />
                        Bolos Tradicionais
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="categoria"
                            value="bebidas" />
                        Bebidas
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="categoria"
                            value="salgados" />
                        Salgados
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="categoria"
                            value="pote" />
                        Bolos de Pote
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="categoria"
                            value="festa" />
                        Bolos de Festa
                    </label>
                </div>
            </div>

            <div className={styles.produtos}>
                {/* {produtos.slice(0, limitador).map((p, index) => (
                    <Produto
                    key={index}
                    imagem={p.imagem}
                    titulo={p.titulo}
                    onButtonClick={handleProdutoClick}
                    />
                ))} */}

                {produtos.map(produtos => <Produto
                    key={produtos.titulo}
                    imagem={produtos.imagem}
                    titulo={produtos.titulo}
                    onButtonClick={handleProdutoClick}
                    />)}
            </div>
            <Footer />
        </div>
    )
}
