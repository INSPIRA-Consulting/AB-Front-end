import { useState, useRef } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import styles from '../styles/DashFinancas.module.css';
import '../styles/fonts/fonts.css';
import { Navbar } from '../components/Navbar';
import { DashSidebar } from '../components/DashSidebar';


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


export function DashFinancas() {
    // Estados para datas
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const startInputRef = useRef(null);
    const endInputRef = useRef(null);

    // Dados e configuração do gráfico Chart.js
    const chartData = {
        labels: ['19 Jun', '20 Jun', '21 Jun', '22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun'],
        datasets: [
            {
                label: 'Entrada',
                data: [60, 58, 55, 48, 45, 83, 75, 42],
                borderColor: '#4d2c0c',
                backgroundColor: 'rgba(77, 44, 12, 0.1)',
                borderWidth: 3,
                pointBackgroundColor: '#4d2c0c',
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
                titleColor: '#6b3a13',
                bodyColor: '#6b3a13',
                borderColor: '#a86b32',
                borderWidth: 1,
                titleFont: {
                    family: 'Montserrat, Arial, sans-serif'
                },
                bodyFont: {
                    family: 'Montserrat, Arial, sans-serif'
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
                max: 100,
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

                        <div className={styles.middleSection}>
                            <section className={styles.lucroSection}>
                                <h2>% de Lucro sobre os produtos</h2>
                                <div className={styles.lucroCard}>
                                    <div className={styles.lucroColumn}>
                                        <span className={styles.lucroLabel}>Mínimo</span>
                                        <div className={styles.lucroValue + ' ' + styles.minimo}>
                                            <span>10%</span>
                                            <div className={styles.lucroIcon}>🔍</div>
                                        </div>
                                    </div>
                                    <div className={styles.lucroColumn}>
                                        <span className={styles.lucroLabel}>Máxima</span>
                                        <div className={styles.lucroValue + ' ' + styles.maximo}>
                                            <span>35%</span>
                                            <div className={styles.lucroIcon}>🔍</div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className={styles.resumoFinanceiro}>
                                <h2>Resumo Financeiro</h2>
                                <div className={styles.resumoCard}>
                                    <div className={styles.resumoItem + ' ' + styles.entrada}>
                                        <span className={styles.resumoLabel}>Entrada:</span>
                                        <span className={styles.resumoValue}>R$ 3000,00</span>
                                    </div>
                                    <div className={styles.resumoItem + ' ' + styles.saida}>
                                        <span className={styles.resumoLabel}>Saída:</span>
                                        <span className={styles.resumoValue}>R$ 1000,00</span>
                                    </div>
                                    <div className={styles.resumoItem + ' ' + styles.lucro}>
                                        <span className={styles.resumoLabel}>Lucro Aproximado:</span>
                                        <span className={styles.resumoValue}>R$ 2000,00</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section className={styles.dashGrafico}>
                            <h2>Entrada/Saída por Período:</h2>
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
