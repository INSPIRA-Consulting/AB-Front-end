import { useState, useRef } from "react";
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
					<section style={{ width: "100%", maxWidth: 900, margin: "0 auto 8px auto" }}>
						<h3 className={styles.sectionTitle}>Recomendação para produção e venda:</h3>
						<div style={{ overflowX: "auto" }}>
							<table className={styles.recomendTable}>
								<thead>
									<tr>
										<th>Data</th>
										<th>Feriado</th>
										<th>Categoria <FaFilter style={{ fontSize: 17, marginLeft: 4, verticalAlign: "middle" }} /></th>
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
					<section style={{ width: "100%", maxWidth: 900, margin: "0 auto 8px auto" }}>
						<h3 className={styles.sectionTitle}>TOP 5 Categorias de produtos mais vendidos:</h3>
						<div style={{ overflowX: "auto" }}>
							<table className={styles.categoriasTable}>
								<thead>
									<tr>
										<th>Ranking</th>
										<th>Categorias</th>
										<th>Qtd.</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>1º</td>
										<td>Bolos Tradicionais</td>
										<td>25</td>
										<td><FaSearch style={{ color: "#9D4F4F", fontSize: 20 }} /></td>
									</tr>
									<tr>
										<td>2º</td>
										<td>Bolos de Pote</td>
										<td>10</td>
										<td><FaSearch style={{ color: "#9D4F4F", fontSize: 20 }} /></td>
									</tr>
									<tr>
										<td>3º</td>
										<td>Bolos de Festa</td>
										<td>9</td>
										<td><FaSearch style={{ color: "#9D4F4F", fontSize: 20 }} /></td>
									</tr>
									<tr>
										<td>4º</td>
										<td>Salgado</td>
										<td>8</td>
										<td><FaSearch style={{ color: "#9D4F4F", fontSize: 20 }} /></td>
									</tr>
									<tr>
										<td>5º</td>
										<td>Bebida</td>
										<td>3</td>
										<td><FaSearch style={{ color: "#9D4F4F", fontSize: 20 }} /></td>
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
