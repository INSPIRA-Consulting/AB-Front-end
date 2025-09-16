import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { CatalogHeader } from "../components/CatalogHeader";
import { SearchBar } from "../components/SearchBar";
import { FilterSection } from "../components/FilterSection";
import { DataTable } from "../components/DataTable";
import { AdvancedFilter } from "../components/AdvancedFilter";
import styles from "../styles/CatalogoProdutos.module.css";

export function CatalogoIngredientes() {
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroOrdenacao, setFiltroOrdenacao] = useState('');
    const navigate = useNavigate();

    // Opções do seletor
    const selectOptions = [
        { value: "produtos", label: "Produtos" },
        { value: "ingredientes", label: "Ingredientes" }
    ];

    // Filtros disponíveis para ingredientes
    const filters = [
        { id: 'bolosTradicionais', label: 'Bolos Tradicionais', colorClass: 'bolosTradicionais' },
        { id: 'bebidas', label: 'Bebidas', colorClass: 'bebidas' },
        { id: 'salgados', label: 'Salgados', colorClass: 'salgados' },
        { id: 'bolosPote', label: 'Bolos de pote', colorClass: 'bolosPote' },
        { id: 'bolosFesta', label: 'Bolos de Festa', colorClass: 'bolosFesta' }
    ];

    // Headers da tabela
    const tableHeaders = ["Ingrediente", "Categoria", "Custo de Produção", "Valor de Venda", "Lucro"];

    const handleCategoriaChange = (categoria) => {
        setCategoriasSelecionadas(prev => {
            if (prev.includes(categoria)) {
                return prev.filter(c => c !== categoria);
            } else {
                return [...prev, categoria];
            }
        });
    };

    // Dados mockados da tabela para ingredientes
    const ingredientes = [
        { produto: "Farinha de Trigo", categoria: "Farinhas", custoProducao: "R$ 5,00", valorVenda: "R$ 8,00", lucro: "R$ 3,00" },
        { produto: "Açúcar Cristal", categoria: "Adoçantes", custoProducao: "R$ 3,00", valorVenda: "R$ 5,00", lucro: "R$ 2,00" },
        { produto: "Ovos", categoria: "Proteínas", custoProducao: "R$ 8,00", valorVenda: "R$ 12,00", lucro: "R$ 4,00" },
        { produto: "Manteiga", categoria: "Gorduras", custoProducao: "R$ 6,00", valorVenda: "R$ 10,00", lucro: "R$ 4,00" },
        { produto: "Leite", categoria: "Lácteos", custoProducao: "R$ 4,00", valorVenda: "R$ 6,00", lucro: "R$ 2,00" },
        { produto: "Fermento", categoria: "Agentes", custoProducao: "R$ 2,00", valorVenda: "R$ 4,00", lucro: "R$ 2,00" },
        { produto: "Chocolate em Pó", categoria: "Saborizantes", custoProducao: "R$ 12,00", valorVenda: "R$ 18,00", lucro: "R$ 6,00" },
        { produto: "Baunilha", categoria: "Essências", custoProducao: "R$ 15,00", valorVenda: "R$ 25,00", lucro: "R$ 10,00" },
        { produto: "Creme de Leite", categoria: "Lácteos", custoProducao: "R$ 5,50", valorVenda: "R$ 8,50", lucro: "R$ 3,00" },
        { produto: "Açúcar Impalpável", categoria: "Adoçantes", custoProducao: "R$ 4,00", valorVenda: "R$ 7,00", lucro: "R$ 3,00" }
    ];

    const handleSelectChange = (value) => {
        if (value === 'produtos') {
            window.location.href = '/catalogo-produtos';
        } else if (value === 'ingredientes') {
            window.location.href = '/catalogo-ingredientes';
        }
    };

    const handleButtonClick = () => {
        // Navegar para a página de registro de ingredientes
        navigate('/registro-ingredientes');
    };

    const handleFilterChange = (filtro) => {
        setFiltroOrdenacao(filtro);
        console.log('Filtro selecionado:', filtro);
        // Aqui você pode implementar a lógica de ordenação
    };

    const renderTableRow = (ingrediente) => {
        return (
            <>
                <div className={styles.tableCell}>{ingrediente.produto}</div>
                <div className={styles.tableCell}>{ingrediente.categoria}</div>
                <div className={styles.tableCell}>{ingrediente.custoProducao}</div>
                <div className={styles.tableCell}>{ingrediente.valorVenda}</div>
                <div className={styles.tableCell}>{ingrediente.lucro}</div>
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

            <FilterSection
                filters={filters}
                selectedCategories={categoriasSelecionadas}
                onCategoryChange={handleCategoriaChange}
                onAdvancedFilterChange={handleFilterChange}
            />

            <DataTable
                headers={tableHeaders}
                data={ingredientes}
                renderRow={renderTableRow}
            />
        </div>
    )
}
