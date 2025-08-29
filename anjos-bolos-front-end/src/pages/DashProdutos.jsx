import { useState, useRef } from "react";
import { FaRegCalendarAlt, FaSearch } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from '../styles/DashProdutos.module.css';
import '../styles/fonts/fonts.css';
import { Navbar } from '../components/Navbar';
import { DashSidebar } from '../components/DashSidebar';
import { FaFilter } from "react-icons/fa";

// Registrar apenas os módulos necessários para o gráfico de pizza nesta página
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export function DashProdutos() {
	// Estados para datas
	const [startDate, setStartDate] = useState("2025-06-01");
	const [endDate, setEndDate] = useState("2025-06-12");
	const startInputRef = useRef(null);
	const endInputRef = useRef(null);

	// Dados do gráfico de pizza (TOP 5 Recheios)
	const pieData = {
		labels: ["Brigadeiro", "Morango", "Ninho", "Prestígio", "Doce de Leite"],
		datasets: [
			{
				data: [36.4, 18.2, 18.2, 18.2, 9.1],
				backgroundColor: [
					"#a86b32",
					"#f7c873",
					"#f9e7c2",
					"#e6b07a",
					"#d9a441"
				],
				borderColor: "#fff",
				borderWidth: 2
			}
		]
	};

	// Dados da tabela de recomendações
	const recomendacoes = [
		{ data: "30/06/2025", feriado: "Festa Junina", categoria: "Bolo Tradicional", produto: "Bolo de Milho" },
		{ data: "10/08/2025", feriado: "Dia dos Pais", categoria: "Salgado", produto: "Esfirra de Carne" }
	];

	// Dados das categorias mais vendidas
	const categorias = [
		"Bolos Tradicionais",
		"Bolos de Pote",
		"Bolos de Festa",
		"Salgado",
		"Bebida"
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

					{/* Cards de gráfico e categorias */}
					<section className={styles.dashCards}>
										{/* Card gráfico de pizza */}
										<div className={styles.dashCard} style={{ background: "#4d2c0c", color: "#fff", minWidth: 320, maxWidth: 420, flex: 1 }}>
											<div className={styles.dashCardTitle} style={{ background: "#4d2c0c", color: "#fff", borderRadius: "12px 12px 0 0" }}>
												TOP 5 Recheios mais populares:
											</div>
											<div className={styles.pieChartContainer}>
												<Pie
													data={pieData}
													options={{
														maintainAspectRatio: false,
														responsive: true,
														plugins: {
															legend: {
																position: "bottom",
																labels: {
																	color: "#4d2c0c",
																	font: { family: 'Montserrat', size: 13, weight: 600 },
																	usePointStyle: true
																}
															},
															tooltip: {
																callbacks: {
																	label: function(context) {
																		const label = context.label || '';
																		const value = context.parsed;
																		const total = context.chart._metasets[context.datasetIndex].total;
																		const percent = ((value / total) * 100).toFixed(1);
																		return `${label}: ${percent}%`;
																	}
																}
															},
															datalabels: {
																color: '#4d2c0c',
																font: {
																	family: 'Montserrat',
																	size: 13,
																	weight: 'bold'
																},
																formatter: (value, context) => {
																	const label = context.chart.data.labels[context.dataIndex];
																	const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
																	const percent = ((value / total) * 100).toFixed(1);
																	return `${label}\n${percent}%`;
																},
																align: 'center',
																anchor: 'center',
															}
														}
													}}
													width={220}
													height={220}
												/>
											</div>
										</div>
						{/* Card categorias */}
						<div className={styles.dashCard} style={{ background: "#a86b32", color: "#fff", minWidth: 320, maxWidth: 420, flex: 1 }}>
							<div className={styles.dashCardTitle} style={{ background: "#a86b32", color: "#fff", borderRadius: "12px 12px 0 0" }}>
								TOP 5 Categorias de produtos mais vendidos:
							</div>
							<table className={styles.categoriasTable}>
								<tbody>
									{categorias.map((cat, idx) => (
										<tr key={cat}>
											<td style={{ width: 40 }}>{idx+1}º</td>
											<td>{cat}</td>
											<td style={{ textAlign: "center", width: 30 }}><FaSearch style={{ color: "#a86b32", fontSize: 16 }} /></td>
										</tr>
									))}
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
