import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { CatalogHeader } from "../components/CatalogHeader";
import { SearchBar } from "../components/SearchBar";
// import { FilterSection } from "../components/FilterSection";
import { DataTable } from "../components/DataTable";
import styles from "../styles/CatalogoProdutos.module.css";
import axios from "axios";
import { useEffect } from "react";

export function CatalogoIngredientes() {
    // Dados mockados da tabela para ingredientes
    // const ingredientes = [
    //     { produto: "Farinha de Trigo", categoria: "Farinhas", custoProducao: "R$ 5,00", valorVenda: "R$ 8,00", lucro: "R$ 3,00" },
    //     { produto: "Açúcar Cristal", categoria: "Adoçantes", custoProducao: "R$ 3,00", valorVenda: "R$ 5,00", lucro: "R$ 2,00" },
    //     { produto: "Ovos", categoria: "Proteínas", custoProducao: "R$ 8,00", valorVenda: "R$ 12,00", lucro: "R$ 4,00" },
    //     { produto: "Manteiga", categoria: "Gorduras", custoProducao: "R$ 6,00", valorVenda: "R$ 10,00", lucro: "R$ 4,00" },
    //     { produto: "Leite", categoria: "Lácteos", custoProducao: "R$ 4,00", valorVenda: "R$ 6,00", lucro: "R$ 2,00" },
    //     { produto: "Fermento", categoria: "Agentes", custoProducao: "R$ 2,00", valorVenda: "R$ 4,00", lucro: "R$ 2,00" },
    //     { produto: "Chocolate em Pó", categoria: "Saborizantes", custoProducao: "R$ 12,00", valorVenda: "R$ 18,00", lucro: "R$ 6,00" },
    //     { produto: "Baunilha", categoria: "Essências", custoProducao: "R$ 15,00", valorVenda: "R$ 25,00", lucro: "R$ 10,00" },
    //     { produto: "Creme de Leite", categoria: "Lácteos", custoProducao: "R$ 5,50", valorVenda: "R$ 8,50", lucro: "R$ 3,00" },
    //     { produto: "Açúcar Impalpável", categoria: "Adoçantes", custoProducao: "R$ 4,00", valorVenda: "R$ 7,00", lucro: "R$ 3,00" }
    // ];

    const [ingredientes, setIngredientes] = useState([]);

    const fetchIngredientes = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/ingredientes`);
            setIngredientes(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Erro ao buscar ingredientes:", error);
            setIngredientes([]);
        }
    };

    useEffect(() => {
        fetchIngredientes();
    }, []);

    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Opções do seletor
    const selectOptions = [
        { value: "produtos", label: "Produtos" },
        { value: "ingredientes", label: "Ingredientes" }
    ];



    // Headers da tabela
    const tableHeaders = ["Ingrediente", "Custo por Medida"];

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
        window.location.href = '/registro   -ingredientes';
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



            <DataTable
                headers={tableHeaders}
                data={ingredientes}
                renderRow={renderTableRow}
            />
        </div>
    )
}
