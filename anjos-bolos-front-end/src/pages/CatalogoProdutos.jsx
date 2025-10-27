import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { CatalogHeader } from "../components/CatalogHeader";
import { SearchBar } from "../components/SearchBar";
import { FilterSection } from "../components/FilterSection";
import { DataTable } from "../components/DataTable";
import { AdvancedFilter } from "../components/AdvancedFilter";
import styles from "../styles/CatalogoProdutos.module.css";
import { useEffect } from "react";
import axios from "axios";
import { useDocumentTitle } from "../hooks/useDocumentTitle";


export function CatalogoProdutos(props) {
    useDocumentTitle(props.titulo);
    const [produtos, setProdutos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const pageSize = 10;

    const fetchProdutos = async (page = 0) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/produtos?page=${page}&size=${pageSize}&sort=nome,asc`);
            setProdutos(response.data.content || response.data);
            setTotalPages(response.data.totalPages || Math.ceil(response.data.length / pageSize));
            setCurrentPage(page);
            console.log(response.data);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            setProdutos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos(0);
    }, []);

    // Dados mockados da tabela para produtos
    // const produtos = [
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" },
    //     { produto: "Bolo de Cenoura", categoria: "Bolo da Vovó", custoProducao: "R$ 10,00", valorVenda: "R$ 10,00", lucro: "R$ 10,00" }
    // ];

    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [filtroOrdenacao, setFiltroOrdenacao] = useState('');

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
    const tableHeaders = ["Produto", "Categoria", "Custo de Produção", "Preço Final", "Lucro"];

    const handleCategoriaChange = (categoria) => {
        setCategoriasSelecionadas(prev => {
            if (prev.includes(categoria)) {
                return prev.filter(c => c !== categoria);
            } else {
                return [...prev, categoria];
            }
        });
    };
   
    const handleSelectChange = (value) => {
        if (value === 'produtos') {
            window.location.href = '/catalogo-produtos';
        } else if (value === 'ingredientes') {
            window.location.href = '/catalogo-ingredientes';
        }
    };

    const handleButtonClick = () => {
        window.location.href = '/registro-produto';
    };

    const handleFilterChange = (filtro) => {
        setFiltroOrdenacao(filtro);
        console.log('Filtro selecionado:', filtro);
        // Aqui você pode implementar a lógica de ordenação
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            fetchProdutos(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            fetchProdutos(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        fetchProdutos(page);
    };

    const renderTableRow = (produto) => {
        // Calculando o lucro baseado nos dados do banco (precoFinal - custoProducao)
        const lucro = produto.precoFinal && produto.custoProducao 
            ? produto.precoFinal - produto.custoProducao 
            : 0;

        return (
            <>
                <div className={styles.tableCell}>{produto.nome}</div>
                <div className={styles.tableCell}>
                    {produto.categoriaProduto?.nome || produto.categoria || "-"}
                </div>
                <div className={styles.tableCell}>
                    {produto.custoProducao !== undefined
                        ? `R$ ${Number(produto.custoProducao).toFixed(2).replace('.', ',')}`
                        : "-"}
                </div>
                <div className={styles.tableCell}>
                    {produto.precoFinal !== undefined
                        ? `R$ ${Number(produto.precoFinal).toFixed(2).replace('.', ',')}`
                        : "-"}
                </div>
                <div className={styles.tableCell}>
                    {lucro !== undefined
                        ? `R$ ${Number(lucro).toFixed(2).replace('.', ',')}`
                        : "-"}
                </div>
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
                onAdvancedFilterChange={handleFilterChange}
            />

            <div className={styles.filterAdvancedContainerLeft}>
                <AdvancedFilter onFilterChange={handleFilterChange} />
            </div>

            <DataTable
                headers={tableHeaders}
                data={produtos}
                renderRow={renderTableRow}
                currentPage={currentPage}
                totalPages={totalPages}
                loading={loading}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                onPageClick={handlePageClick}
            />

            {loading && (
                <div className={styles.loadingContainer}>
                    <p>Carregando produtos...</p>
                </div>
            )}
        </div>
    )
}