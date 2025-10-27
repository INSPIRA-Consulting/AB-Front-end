import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { CatalogHeader } from "../components/CatalogHeader";
import { SearchBar } from "../components/SearchBar";
import { DataTable } from "../components/DataTable";
import styles from "../styles/CatalogoProdutos.module.css";
import axios from "axios";
import { AdvancedFilter } from "../components/AdvancedFilter";
import { useEffect } from "react";

export function CatalogoIngredientes() {
    const [ingredientes, setIngredientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const pageSize = 10;

    const fetchIngredientes = async (page = 0) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/ingredientes?page=${page}&size=${pageSize}&sort=nome,asc`);
            setIngredientes(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);
            console.log(response.data);
        } catch (error) {
            console.error("Erro ao buscar ingredientes:", error);
            setIngredientes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIngredientes(0);
    }, []);

    // Opções do seletor
    const selectOptions = [
        { value: "produtos", label: "Produtos" },
        { value: "ingredientes", label: "Ingredientes" }
    ];

    // Headers da tabela
    const tableHeaders = ["Ingrediente", "Custo por Medida"];

    const handleSelectChange = (value) => {
        if (value === 'produtos') {
            window.location.href = '/catalogo-produtos';
        } else if (value === 'ingredientes') {
            window.location.href = '/catalogo-ingredientes';
        }
    };

    const handleButtonClick = () => {
        window.location.href = '/registro-ingredientes';
    };

    const handleFilterChange = (filtro) => {
        console.log('Filtro selecionado:', filtro);
        // Aqui você pode implementar a lógica de ordenação
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            fetchIngredientes(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            fetchIngredientes(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        fetchIngredientes(page);
    };

    const renderTableRow = (ingrediente) => {
        return (
            <>
                <div className={styles.tableCell}>{ingrediente.nome}</div>
                <div className={styles.tableCell}>{
                    ingrediente.custoMedida !== undefined
                        ? `R$ ${Number(ingrediente.custoMedida).toFixed(2).replace('.', ',')}`
                        : "-"
                }</div>
            </>
        );
    };

    return (
        <div className={styles.container}>
            <Navbar logado={true} />

            <CatalogHeader
                options={selectOptions}
                defaultValue="ingredientes"
                onSelectChange={handleSelectChange}
                buttonText="Registrar Ingrediente"
                onButtonClick={handleButtonClick}
            />

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Pesquise um ingrediente"
            />

            <div className={styles.filterAdvancedContainerLeft}>
                <AdvancedFilter onFilterChange={handleFilterChange} />
            </div>

            <DataTable
                headers={tableHeaders}
                data={ingredientes}
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
                    <p>Carregando ingredientes...</p>
                </div>
            )}
        </div>
    )
}
