import { useState, useRef, useEffect } from "react";
import { FaRegCalendarAlt, FaSearch } from "react-icons/fa";
import styles from '../styles/DashProdutos.module.css';
import '../styles/fonts/fonts.css';
import { Navbar } from '../components/Navbar';
import { DashSidebar } from '../components/DashSidebar';
import { FaFilter } from "react-icons/fa";

export function DashProdutos() {
	// Estados para datas
	const [startDate, setStartDate] = useState("2025-06-01");
	const [endDate, setEndDate] = useState("2025-06-12");
	const startInputRef = useRef(null);
	const endInputRef = useRef(null);

	// Estados para filtros
	const [showRecomendFilter, setShowRecomendFilter] = useState(false);
	const [showCategoriasFilter, setShowCategoriasFilter] = useState(false);
	const [selectedRecomendFilters, setSelectedRecomendFilters] = useState([
		"Bolos Tradicionais",
		"Bebidas", 
		"Salgados",
		"Bolos de Pote",
		"Bolos de Festa"
	]);
	const [selectedCategoriaType, setSelectedCategoriaType] = useState("Categorias de Produtos");

	// Opções de filtro para recomendações (múltipla seleção)
	const recomendOptions = [
		"Bolos Tradicionais",
		"Bebidas", 
		"Salgados",
		"Bolos de Pote",
		"Bolos de Festa"
	];

	// Opções para a tabela TOP 5 (seleção única)
	const categoriaTypeOptions = [
		"Categorias de Produtos",
		"Bolos Tradicionais",
		"Bebidas", 
		"Salgados",
		"Bolos de Pote",
		"Bolos de Festa"
	];

	// Funções para gerenciar filtros de recomendação
	const handleRecomendFilterChange = (option) => {
		setSelectedRecomendFilters(prev => {
			if (prev.includes(option)) {
				return prev.filter(item => item !== option);
			} else {
				return [...prev, option];
			}
		});
		// Filtro aplicado imediatamente - aqui você pode implementar a lógica de filtro
	};

	// Função para gerenciar filtro de categoria (seleção única)
	const handleCategoriaTypeChange = (type) => {
		setSelectedCategoriaType(type);
		setShowCategoriasFilter(false);
	};

	// Função para gerar título dinâmico
	const getTableTitle = () => {
		if (selectedCategoriaType === "Categorias de Produtos") {
			return "TOP 5 Categorias de produtos mais vendidos:";
		} else if (selectedCategoriaType === "Bebidas") {
			return `TOP 5 ${selectedCategoriaType} mais vendidas:`;
		} else {
			return `TOP 5 ${selectedCategoriaType} mais vendidos:`;
		}
	};

	// Fechar filtros ao clicar fora
	useEffect(() => {
		const handleClickOutside = (event) => {
			// Se clicou fora dos filtros, fechar
			if (!event.target.closest(`.${styles.filterDropdown}`) && 
				!event.target.closest('th')) {
				setShowRecomendFilter(false);
				setShowCategoriasFilter(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Dados das recomendações
	const recomendacoes = [
		{ data: "30/06/2025", feriado: "Festa Junina", categoria: "Bolo Tradicional", produto: "Bolo de Milho" },
		{ data: "10/08/2025", feriado: "Dia dos Pais", categoria: "Salgado", produto: "Esfirra de Carne" }
	];

	return (
		<div className={styles.dashContainer}>
			<Navbar logado={true} activePage="produtos" />
			<div className={styles.dashMain}>
				<DashSidebar activeItem="produto" />
				<main className={styles.dashContent}>
					{/* Tabela de recomendações */}
					<section style={{ width: "100%", maxWidth: 900, margin: "0 auto 8px auto", position: "relative" }}>
						<h3 className={styles.sectionTitle}>Recomendação para produção e venda:</h3>
						
						{/* Filtro de Recomendações - fora da tabela */}
						{showRecomendFilter && (
							<div className={`${styles.filterDropdown} ${styles.filterDropdownRecomend}`}>
								<div className={`${styles.filterTitle} ${styles.filterTitleRecomend}`}>
									Filtrar por Categoria
								</div>
								<div className={styles.filterOptionsContainer}>
									{recomendOptions.map((option, i) => (
										<div key={i} className={styles.filterOption}>
											<input
												type="checkbox"
												id={`recomend-${i}`}
												checked={selectedRecomendFilters.includes(option)}
												onChange={() => handleRecomendFilterChange(option)}
											/>
											<label htmlFor={`recomend-${i}`}>{option}</label>
										</div>
									))}
								</div>
							</div>
						)}

						<div style={{ overflowX: "auto" }}>
							<table className={styles.recomendTable}>
								<thead>
									<tr>
										<th>Data</th>
										<th>Feriado</th>
										<th 
											style={{ cursor: "pointer" }}
											onClick={() => setShowRecomendFilter(!showRecomendFilter)}
										>
											Categoria <FaFilter style={{ fontSize: 17, marginLeft: 4, verticalAlign: "middle" }} />
										</th>
										<th>Produto</th>
									</tr>
								</thead>
								<tbody>
									{recomendacoes.map((rec, i) => (
										<tr key={i}>
											<td>{rec.data}</td>
											<td>{rec.feriado}</td>
											<td>{rec.categoria}</td>
											<td>{rec.produto}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</section>

					{/* Período */}
					<section className={styles.dashPeriodo} style={{ width: "100%", maxWidth: 900, margin: "0 auto 8px auto", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<h2 className={styles.sectionTitle}>Selecione um período:</h2>
						<div className={styles.periodoInputs}>
							{/* Data inicial */}
							<div
								className={styles.periodoDate}
								onClick={() => startInputRef.current && startInputRef.current.showPicker && startInputRef.current.showPicker()}
								style={{ position: "relative", cursor: "pointer" }}
							>
								<FaRegCalendarAlt className={styles.calendarIcon} />
								{ !startDate && (
									<span className={styles.datePlaceholder}>dd/mm/aaaa</span>
								)}
								<input
									ref={startInputRef}
									type="date"
									value={startDate}
									onChange={e => setStartDate(e.target.value)}
									className={styles.invisibleDateInput}
									style={{
										position: "absolute",
										left: 0,
										top: 0,
										width: "100%",
										height: "100%",
										opacity: 0,
										cursor: "pointer",
										zIndex: 2
									}}
								/>
								{ startDate && (
									<span className={styles.dateValue}>{formatDateBR(startDate)}</span>
								)}
							</div>
							{/* Data final */}
							<div
								className={styles.periodoDate}
								onClick={() => endInputRef.current && endInputRef.current.showPicker && endInputRef.current.showPicker()}
								style={{ position: "relative", cursor: "pointer" }}
							>
								<FaRegCalendarAlt className={styles.calendarIcon} />
								{ !endDate && (
									<span className={styles.datePlaceholder}>dd/mm/aaaa</span>
								)}
								<input
									ref={endInputRef}
									type="date"
									value={endDate}
									onChange={e => setEndDate(e.target.value)}
									className={styles.invisibleDateInput}
									style={{
										position: "absolute",
										left: 0,
										top: 0,
										width: "100%",
										height: "100%",
										opacity: 0,
										cursor: "pointer",
										zIndex: 2
									}}
								/>
								{ endDate && (
									<span className={styles.dateValue}>{formatDateBR(endDate)}</span>
								)}
							</div>
						</div>
					</section>

					{/* Tabela TOP 5 Categorias */}
					<section style={{ width: "100%", maxWidth: 900, margin: "0 auto 8px auto", position: "relative" }}>
						<h3 className={styles.sectionTitle}>{getTableTitle()}</h3>
						
						{/* Filtro de Categorias - fora da tabela */}
						{showCategoriasFilter && (
							<div className={`${styles.filterDropdown} ${styles.filterDropdownCategorias}`}>
								<div className={`${styles.filterTitle} ${styles.filterTitleCategorias}`}>
									Filtrar por:
								</div>
								<div className={styles.filterOptionsContainer}>
									{categoriaTypeOptions.map((option, i) => (
										<div key={i} className={styles.filterOption}>
											<input
												type="radio"
												id={`categoria-${i}`}
												name="categoriaType"
												checked={selectedCategoriaType === option}
												onChange={() => handleCategoriaTypeChange(option)}
											/>
											<label htmlFor={`categoria-${i}`}>{option}</label>
										</div>
									))}
								</div>
							</div>
						)}

						<div style={{ overflowX: "auto" }}>
							<table className={styles.categoriasTable}>
								<thead>
									<tr>
										<th>Ranking</th>
										<th 
											style={{ cursor: "pointer" }}
											onClick={() => setShowCategoriasFilter(!showCategoriasFilter)}
										>
											Categorias <FaFilter style={{ fontSize: 17, marginLeft: 4, verticalAlign: "middle" }} />
										</th>
										<th>Qtd.</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>1º</td>
										<td>Bolos Tradicionais</td>
										<td>25</td>
										<td><FaSearch style={{ color: "#4d2c0c", fontSize: 24 }} /></td>
									</tr>
									<tr>
										<td>2º</td>
										<td>Bolos de Pote</td>
										<td>10</td>
										<td><FaSearch style={{ color: "#4d2c0c", fontSize: 24 }} /></td>
									</tr>
									<tr>
										<td>3º</td>
										<td>Bolos de Festa</td>
										<td>9</td>
										<td><FaSearch style={{ color: "#4d2c0c", fontSize: 24 }} /></td>
									</tr>
									<tr>
										<td>4º</td>
										<td>Salgado</td>
										<td>8</td>
										<td><FaSearch style={{ color: "#4d2c0c", fontSize: 24 }} /></td>
									</tr>
									<tr>
										<td>5º</td>
										<td>Bebida</td>
										<td>3</td>
										<td><FaSearch style={{ color: "#4d2c0c", fontSize: 24 }} /></td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>
				</main>
			</div>
		</div>
	);

	// Função para formatar data yyyy-mm-dd para dd/mm/aaaa
	function formatDateBR(dateStr) {
		if (!dateStr) return "";
		const [y, m, d] = dateStr.split("-");
		return `${d}/${m}/${y}`;
	}
}
