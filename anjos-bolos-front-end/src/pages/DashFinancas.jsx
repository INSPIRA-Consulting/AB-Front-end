import { useState, useRef } from "react";
import { FaRegCalendarAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from '../styles/DashFinancas.module.css';
import '../styles/fonts/fonts.css';
import { Navbar } from '../components/Navbar';
import { DashSidebar } from '../components/DashSidebar';
import { useDocumentTitle } from '../hooks/useDocumentTitle';


import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrar apenas os módulos necessários para o gráfico de linha nesta página
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export function DashFinancas(props) {
    useDocumentTitle(props.titulo);
    // Estados para datas
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const startInputRef = useRef(null);
    const endInputRef = useRef(null);
    
    // Hook de navegação
    const navigate = useNavigate();
    
    // Função para redirecionar para catálogo de produtos
    const handleSearchClick = () => {
        navigate('/catalogo-produtos');
    };

    // Dados e configuração do gráfico Chart.js
    const chartData = {
        labels: ['19 Jun', '20 Jun', '21 Jun', '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun'],
        datasets: [
            {
                label: 'Entrada',
                data: [1250.50, 1380.25, 1150.75, 980.30, 850.60, 1750.90, 1420.15, 920.45],
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#2e7d32',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#6b3a13',
                    font: {
                        family: 'Montserrat, Arial, sans-serif',
                        size: 12,
                        weight: 600
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#2e7d32',
                bodyColor: '#2e7d32',
                borderColor: '#2e7d32',
                borderWidth: 1,
                titleFont: {
                    family: 'Montserrat, Arial, sans-serif'
                },
                bodyFont: {
                    family: 'Montserrat, Arial, sans-serif'
                },
                callbacks: {
                    label: function(context) {
                        const value = context.parsed.y;
                        return context.dataset.label + ': ' + value.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        });
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#6b3a13',
                    font: {
                        family: 'Montserrat, Arial, sans-serif',
                        size: 11,
                        weight: 600
                    }
                },
                grid: {
                    display: true,
                    color: 'rgba(229, 229, 229, 0.5)'
                }
            },
            y: {
                min: 0,
                max: 2000,
                ticks: {
                    color: '#2e7d32',
                    font: {
                        family: 'Montserrat, Arial, sans-serif',
                        size: 11,
                        weight: 600
                    },
                    callback: function(value) {
                        return value.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        });
                    }
                },
                grid: {
                    display: true,
                    color: 'rgba(229, 229, 229, 0.5)'
                }
            }
        }
    };

        return (
            <div className={styles.dashContainer}>
                <Navbar logado={true} activePage="financas" />
                <div className={styles.dashMain}>
                    <DashSidebar activeItem="financas" />
                    <main className={styles.dashContent}>
                        <section className={styles.dashPeriodo}>
                            <h2>Selecione um período:</h2>
                            <div className={styles.periodoInputs}>
                                {/* Data inicial */}
                                <div
                                    className={styles.periodoDate}
                                    onClick={() => startInputRef.current && startInputRef.current.showPicker && startInputRef.current.showPicker()}
                                    style={{ position: "relative", cursor: "pointer" }}
                                >
                                    <FaRegCalendarAlt className={styles.calendarIcon} />
                                    {/* Placeholder visível */}
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
                                    {/* Data formatada se selecionada */}
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

                        <section className={styles.dashCards}>
                            <div className={styles.dashCard}>
                                <div className={styles.dashCardTitle + ' ' + styles.dashCardTitleLucro}>% de Lucro sobre os produtos</div>
                                <div className={styles.dashCardContent + ' ' + styles.lucroCardContainer}>
                                    <div className={styles.lucroSection}>
                                        <span className={styles.lucroLabel}>Mínimo:</span>
                                        <span className={styles.lucroValueMin}>10% <FaSearch 
                                            style={{ fontSize: 24, marginLeft: 6, color: '#4d2c0c', cursor: 'pointer' }} 
                                            onClick={handleSearchClick}
                                        /></span>
                                    </div>
                                    <div className={styles.lucroSection}>
                                        <span className={styles.lucroLabel}>Máximo:</span>
                                        <span className={styles.lucroValueMax}>35% <FaSearch 
                                            style={{ fontSize: 24, marginLeft: 6, color: '#4d2c0c', cursor: 'pointer' }} 
                                            onClick={handleSearchClick}
                                        /></span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.dashCard}>
                                <div className={styles.dashCardTitle + ' ' + styles.dashCardTitleResumo}>Resumo Financeiro</div>
                                <div className={styles.dashCardContent + ' ' + styles.resumoCardContainer}>
                                    <div className={styles.resumoItem + ' ' + styles.resumoEntrada}>
                                        <span className={styles.resumoItemLabel}>Entrada:</span>
                                        <span className={styles.resumoItemValue}>R$ 3.000,00</span>
                                    </div>
                                    <div className={styles.resumoItem + ' ' + styles.resumoSaida}>
                                        <span className={styles.resumoItemLabel}>Saída:</span>
                                        <span className={styles.resumoItemValue}>R$ 1.000,00</span>
                                    </div>
                                    <div className={styles.resumoItem + ' ' + styles.resumoLucro}>
                                        <span className={styles.resumoItemLabel}>Lucro Aproximado:</span>
                                        <span className={styles.resumoItemValue}>R$ 2.000,00</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={styles.dashGrafico}>
                            <h2>Entrada por Período:</h2>
                            <div className={styles.graficoPlaceholder}>
                                <Line 
                                    data={chartData}
                                    options={chartOptions}
                                />
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
