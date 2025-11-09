import { useState, useRef, useEffect } from "react";
import { FaRegCalendarAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from '../styles/DashFinancas.module.css';
import '../styles/fonts/fonts.css';
import { Navbar } from '../components/Navbar';
import { DashSidebar } from '../components/DashSidebar';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import api from '../provider/api';


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
    
    // Função para obter o primeiro dia do mês atual no formato yyyy-MM-dd
    const getPrimeiroDiaDoMes = () => {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        return `${ano}-${mes}-01`;
    };
    
    // Função para obter o último dia do mês atual no formato yyyy-MM-dd
    const getUltimoDiaDoMes = () => {
        const hoje = new Date();
        const ano = hoje.getFullYear();
        const mes = hoje.getMonth();
        // Criar data do próximo mês, dia 0 (que é o último dia do mês atual)
        const ultimoDia = new Date(ano, mes + 1, 0);
        const dia = String(ultimoDia.getDate()).padStart(2, '0');
        const mesFormatado = String(mes + 1).padStart(2, '0');
        return `${ano}-${mesFormatado}-${dia}`;
    };
    
    // Estados para datas - inicializados com primeiro e último dia do mês atual
    const [startDate, setStartDate] = useState(getPrimeiroDiaDoMes());
    const [endDate, setEndDate] = useState(getUltimoDiaDoMes());
    const startInputRef = useRef(null);
    const endInputRef = useRef(null);
    
    // Estado para controlar qual opção do resumo financeiro está selecionada
    const [opcaoSelecionada, setOpcaoSelecionada] = useState('entrada');
    
    // Estados para margem de lucro
    const [menorMargemLucro, setMenorMargemLucro] = useState(null);
    const [maiorMargemLucro, setMaiorMargemLucro] = useState(null);
    const [loadingMargem, setLoadingMargem] = useState(false);
    
    // Estados para resumo financeiro
    const [faturamento, setFaturamento] = useState(null);
    const [custos, setCustos] = useState(null);
    const [lucro, setLucro] = useState(null);
    const [loadingResumo, setLoadingResumo] = useState(false);
    
    // Estados para dados do gráfico
    const [dadosGraficoPorData, setDadosGraficoPorData] = useState({
        labels: [],
        entrada: [],
        saida: [],
        lucro: []
    });
    
    // Hook de navegação
    const navigate = useNavigate();
    
    // Função para obter o título do gráfico baseado na opção selecionada
    const getTituloGrafico = () => {
        switch (opcaoSelecionada) {
            case 'entrada':
                return 'Entrada por Período:';
            case 'saida':
                return 'Saída por Período:';
            case 'lucro':
                return 'Lucro por Período:';
            default:
                return 'Entrada por Período:';
        }
    };
    
    // Função para obter a cor da linha baseado na opção selecionada
    const getCorLinha = () => {
        switch (opcaoSelecionada) {
            case 'entrada':
                return '#2e7d32'; // Verde
            case 'saida':
                return '#d32f2f'; // Vermelho
            case 'lucro':
                return '#a86b32'; // Laranja/Marrom
            default:
                return '#2e7d32';
        }
    };
    
    // Função para obter o valor correto baseado na opção selecionada
    const getValorSelecionado = () => {
        switch (opcaoSelecionada) {
            case 'entrada':
                return faturamento;
            case 'saida':
                return custos;
            case 'lucro':
                return lucro;
            default:
                return faturamento;
        }
    };
    
    // Função para obter o label do dataset
    const getLabelDataset = () => {
        switch (opcaoSelecionada) {
            case 'entrada':
                return 'Entrada';
            case 'saida':
                return 'Saída';
            case 'lucro':
                return 'Lucro';
            default:
                return 'Entrada';
        }
    };
    
    // useEffect para buscar dados de margem de lucro e faturamento com base nas datas
    useEffect(() => {
        const fetchDadosDashboard = async () => {
            // Só busca se ambas as datas estiverem definidas
            if (!startDate || !endDate) return;
            
            setLoadingMargem(true);
            setLoadingResumo(true);
            
            try {
                const [menorResponse, maiorResponse, pedidosResponse, itensResponse] = await Promise.all([
                    api.get('/dashboards/menor-margem-lucro', {
                        params: {
                            dataInicio: startDate,
                            dataFim: endDate
                        }
                    }),
                    api.get('/dashboards/maior-margem-lucro', {
                        params: {
                            dataInicio: startDate,
                            dataFim: endDate
                        }
                    }),
                    api.get('/pedidos'),
                    api.get('/itens-pedido')
                ]);
                
                // Setar dados de margem de lucro
                setMenorMargemLucro(menorResponse.data);
                setMaiorMargemLucro(maiorResponse.data);
                
                // Processar dados para o gráfico
                const pedidos = Array.isArray(pedidosResponse.data) ? pedidosResponse.data : [];
                const itens = Array.isArray(itensResponse.data) ? itensResponse.data : [];
                
                console.log('📦 Total de pedidos:', pedidos.length);
                console.log('📦 Total de itens:', itens.length);
                
                // Filtrar pedidos por data e status FINALIZADO
                const pedidosFiltrados = pedidos.filter(pedido => {
                    // Filtrar apenas pedidos finalizados
                    if (pedido.status !== 'Finalizado' && pedido.status !== 'FINALIZADO') {
                        return false;
                    }
                    
                    const dataStr = pedido.dataPedido || pedido.dataPedidoString || pedido.dataPedidoAt || '';
                    if (!dataStr) return false;
                    
                    const dataPedido = new Date(dataStr);
                    dataPedido.setHours(0, 0, 0, 0);
                    
                    const dataInicio = new Date(startDate);
                    const dataFim = new Date(endDate);
                    dataInicio.setHours(0, 0, 0, 0);
                    dataFim.setHours(23, 59, 59, 999);
                    
                    return dataPedido >= dataInicio && dataPedido <= dataFim;
                });
                
                console.log('✅ Pedidos finalizados no período:', pedidosFiltrados.length);
                console.log('📋 IDs dos pedidos:', pedidosFiltrados.map(p => p.id));
                
                // Agrupar dados por data
                const dadosPorData = {};
                
                pedidosFiltrados.forEach(pedido => {
                    const dataStr = pedido.dataPedido || pedido.dataPedidoString || pedido.dataPedidoAt || '';
                    // Extrair apenas a data no formato yyyy-MM-dd (remove hora se houver)
                    const data = dataStr.split(' ')[0]; // Remove "10:00:00" se houver
                    
                    if (!dadosPorData[data]) {
                        dadosPorData[data] = {
                            entrada: 0,
                            saida: 0,
                            lucro: 0
                        };
                    }
                    
                    // Somar valores dos itens deste pedido
                    const itensDoPedido = itens.filter(item => item.pedidoId === pedido.id);
                    itensDoPedido.forEach(item => {
                        dadosPorData[data].entrada += item.valorFinal || 0;
                        dadosPorData[data].saida += item.custoProducao || 0;
                        dadosPorData[data].lucro += (item.valorFinal || 0) - (item.custoProducao || 0);
                    });
                    
                    console.log(`📅 ${data}: Pedido #${pedido.id} - ${itensDoPedido.length} itens - Entrada: R$ ${dadosPorData[data].entrada.toFixed(2)}`);
                });
                
                // Ordenar datas e preparar arrays para o gráfico
                const datasOrdenadas = Object.keys(dadosPorData).sort();
                const labels = datasOrdenadas.map(data => {
                    const [ano, mes, dia] = data.split('-');
                    return `${dia}/${mes}`;
                });
                const entrada = datasOrdenadas.map(data => dadosPorData[data].entrada);
                const saida = datasOrdenadas.map(data => dadosPorData[data].saida);
                const lucroArray = datasOrdenadas.map(data => dadosPorData[data].lucro);
                
                console.log('📊 Dados do gráfico:', {
                    labels,
                    entrada,
                    saida,
                    lucro: lucroArray
                });
                console.log('💰 Total Entrada:', entrada.reduce((a, b) => a + b, 0).toFixed(2));
                console.log('💸 Total Saída:', saida.reduce((a, b) => a + b, 0).toFixed(2));
                console.log('💵 Total Lucro:', lucroArray.reduce((a, b) => a + b, 0).toFixed(2));
                
                // Calcular totais para o Resumo Financeiro baseado nos mesmos dados do gráfico
                // Isso garante consistência entre o gráfico e o card de resumo
                const totalEntrada = entrada.reduce((a, b) => a + b, 0);
                const totalSaida = saida.reduce((a, b) => a + b, 0);
                const totalLucro = lucroArray.reduce((a, b) => a + b, 0);
                
                // Setar dados do Resumo Financeiro com os valores calculados
                setFaturamento(totalEntrada);
                setCustos(totalSaida);
                setLucro(totalLucro);
                
                setDadosGraficoPorData({
                    labels,
                    entrada,
                    saida,
                    lucro: lucroArray
                });
                
            } catch (error) {
                console.error('Erro ao buscar dados do dashboard:', error);
                // Em caso de erro, manter valores null para exibir placeholders
            } finally {
                setLoadingMargem(false);
                setLoadingResumo(false);
            }
        };
        
        fetchDadosDashboard();
    }, [startDate, endDate]); // Reexecuta sempre que as datas mudarem
    
    // Função para redirecionar para catálogo de produtos com filtro de nome
    const handleSearchClick = (nomeProduto) => {
        if (nomeProduto) {
            navigate(`/catalogo-produtos?nome=${encodeURIComponent(nomeProduto)}`);
        } else {
            navigate('/catalogo-produtos');
        }
    };

    // Dados e configuração do gráfico Chart.js (dinâmico baseado na opção selecionada)
    const corAtual = getCorLinha();
    
    // Selecionar os dados corretos baseado na opção selecionada
    const getDadosGrafico = () => {
        switch (opcaoSelecionada) {
            case 'entrada':
                return dadosGraficoPorData.entrada;
            case 'saida':
                return dadosGraficoPorData.saida;
            case 'lucro':
                return dadosGraficoPorData.lucro;
            default:
                return dadosGraficoPorData.entrada;
        }
    };
    
    const chartData = {
        labels: dadosGraficoPorData.labels.length > 0 ? dadosGraficoPorData.labels : ['Sem dados'],
        datasets: [
            {
                label: getLabelDataset(),
                data: getDadosGrafico().length > 0 ? getDadosGrafico() : [0],
                borderColor: corAtual,
                backgroundColor: `${corAtual}1a`, // Adiciona transparência
                borderWidth: 3,
                pointBackgroundColor: corAtual,
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
                    },
                    maxRotation: 0,
                    minRotation: 0
                },
                grid: {
                    display: true,
                    color: 'rgba(229, 229, 229, 0.5)'
                }
            },
            y: {
                beginAtZero: true,
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
                                <div className={styles.dashCardTitle + ' ' + styles.dashCardTitleLucro}>Margem de Lucro por Produto</div>
                                <div className={styles.dashCardContent + ' ' + styles.lucroCardContainer}>
                                    <div className={styles.lucroSection}>
                                        <span className={styles.lucroLabel}>Mínima:</span>
                                        <div className={styles.lucroValueWrapper}>
                                            <span 
                                                className={styles.lucroValueMin}
                                                style={{
                                                    color: menorMargemLucro && menorMargemLucro.margemLucro < 30 ? '#d32f2f' : '#2e7d32'
                                                }}
                                            >
                                                {loadingMargem ? '...' : menorMargemLucro ? `${menorMargemLucro.margemLucro}%` : 'N/A'} 
                                                <FaSearch 
                                                    style={{ fontSize: 20, marginLeft: 6, color: '#4d2c0c', cursor: 'pointer' }} 
                                                    onClick={() => handleSearchClick(menorMargemLucro?.nomeProduto)}
                                                />
                                            </span>
                                        </div>
                                        <span className={styles.produtoNome}>
                                            {loadingMargem ? 'Carregando...' : menorMargemLucro?.nomeProduto || 'Sem dados'}
                                        </span>
                                    </div>
                                    <div className={styles.lucroSection}>
                                        <span className={styles.lucroLabel}>Máxima:</span>
                                        <div className={styles.lucroValueWrapper}>
                                            <span 
                                                className={styles.lucroValueMax}
                                                style={{
                                                    color: maiorMargemLucro && maiorMargemLucro.margemLucro < 30 ? '#d32f2f' : '#2e7d32'
                                                }}
                                            >
                                                {loadingMargem ? '...' : maiorMargemLucro ? `${maiorMargemLucro.margemLucro}%` : 'N/A'} 
                                                <FaSearch 
                                                    style={{ fontSize: 20, marginLeft: 6, color: '#4d2c0c', cursor: 'pointer' }} 
                                                    onClick={() => handleSearchClick(maiorMargemLucro?.nomeProduto)}
                                                />
                                            </span>
                                        </div>
                                        <span className={styles.produtoNome}>
                                            {loadingMargem ? 'Carregando...' : maiorMargemLucro?.nomeProduto || 'Sem dados'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.dashCard}>
                                <div className={styles.dashCardTitle + ' ' + styles.dashCardTitleResumo}>Resumo Financeiro</div>
                                <div className={styles.dashCardContent + ' ' + styles.resumoCardContainer}>
                                    <div 
                                        className={`${styles.resumoItem} ${styles.resumoEntrada} ${opcaoSelecionada === 'entrada' ? styles.selected : ''}`}
                                        onClick={() => setOpcaoSelecionada('entrada')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span className={styles.resumoItemLabel}>Entrada:</span>
                                        <span className={styles.resumoItemValue}>
                                            {loadingResumo ? 'Carregando...' : faturamento !== null ? `R$ ${faturamento.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                                        </span>
                                    </div>
                                    <div 
                                        className={`${styles.resumoItem} ${styles.resumoSaida} ${opcaoSelecionada === 'saida' ? styles.selected : ''}`}
                                        onClick={() => setOpcaoSelecionada('saida')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span className={styles.resumoItemLabel}>Saída:</span>
                                        <span className={styles.resumoItemValue}>
                                            {loadingResumo ? 'Carregando...' : custos !== null ? `R$ ${custos.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                                        </span>
                                    </div>
                                    <div 
                                        className={`${styles.resumoItem} ${styles.resumoLucro} ${opcaoSelecionada === 'lucro' ? styles.selected : ''}`}
                                        onClick={() => setOpcaoSelecionada('lucro')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span className={styles.resumoItemLabel}>Lucro Aproximado:</span>
                                        <span 
                                            className={styles.resumoItemValue}
                                            style={{
                                                color: lucro !== null && lucro < 0 ? '#d32f2f' : 'inherit'
                                            }}
                                        >
                                            {loadingResumo ? 'Carregando...' : lucro !== null ? `R$ ${lucro.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={styles.dashGrafico}>
                            <h2>{getTituloGrafico()}</h2>
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
