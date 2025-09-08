import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { CatalogHeader } from "../components/CatalogHeader";
import { SearchBar } from "../components/SearchBar";
import { FilterSection } from "../components/FilterSection";
import { DataTable } from "../components/DataTable";
import styles from "../styles/CatalogoProdutos.module.css";


export function CatalogoProdutos() {
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Opções do seletor
    const selectOptions = [
        { value: "produtos", label: "Produtos" },
        { value: "ingredientes", label: "Ingredientes" }
    ];

    // Filtros disponíveis
    const filters = [
        { id: 'bolosTradicionais', label: 'Bolos Tradicionais', colorClass: 'bolosTradicionais' },
        { id: 'bebidas', label: 'Bebidas', colorClass: 'bebidas' },
        { id: 'salgados', label: 'Salgados', colorClass: 'salgados' },
        { id: 'bolosPote', label: 'Bolos de pote', colorClass: 'bolosPote' },
        { id: 'bolosFesta', label: 'Bolos de Festa', colorClass: 'bolosFesta' }
    ];

    // Headers da tabela
    const tableHeaders = ["Produto", "Categoria", "Custo de Produção", "Valor de Venda", "Lucro"];

    const handleCategoriaChange = (categoria) => {
        setCategoriasSelecionadas(prev => {
            if (prev.includes(categoria)) {
                return prev.filter(c => c !== categoria);
            } else {
                return [...prev, categoria];
            }
        });
    };

    // Dados mockados da tabela
    const produtos = [
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
        { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" }
    ];

    const handleSelectChange = (value) => {
        if (value === 'produtos') {
            window.location.href = '/catalogo-produtos';
        } else if (value === 'ingredientes') {
            window.location.href = '/catalogo-ingredientes';
        }
    };

    const handleButtonClick = () => {
        // Função para o botão registrar
        console.log('Registrar produto clicado');
    };

    const renderTableRow = (produto) => {
        return (
            <>
                <div className={styles.tableCell}>{produto.produto}</div>
                <div className={styles.tableCell}>{produto.categoria}</div>
                <div className={styles.tableCell}>{produto.custoProducao}</div>
                <div className={styles.tableCell}>{produto.valorVenda}</div>
                <div className={styles.tableCell}>{produto.lucro}</div>
            </>
        );
    };

    return (
        <div className={styles.container}>
            <Navbar logado={true} />
            
            <CatalogHeader
                options={selectOptions}
                defaultValue="produtos"
                onSelectChange={handleSelectChange}
                buttonText="Registrar Produto"
                onButtonClick={handleButtonClick}
            />

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Pesquise um produto"
            />

            <FilterSection
                filters={filters}
                selectedCategories={categoriasSelecionadas}
                onCategoryChange={handleCategoriaChange}
            />

            <DataTable
                headers={tableHeaders}
                data={produtos}
                renderRow={renderTableRow}
            />
        </div>
    )
}