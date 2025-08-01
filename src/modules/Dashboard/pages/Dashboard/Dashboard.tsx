import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { Section } from "@shared/components/Core/Containers/Section";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Button } from "@shared/components/Core/Buttons/Button";
import { Select } from "@shared/components/Core/Form/Fields/Select";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Table, Thead, Tbody, Tr, Th, Td } from "@shared/components/Core/Table";
import { Tag } from "@shared/components/Core/Tag";
import { Pagination } from "@shared/components/Core/Pagination";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
/* import { customers } from "@shared/hooks/services/Admin/useCustomers"; */
import { useInspections } from "@shared/hooks/services/Admin/useInspections";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Importação dos componentes de gráficos
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";

// Registrando componentes do Chart.js
ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler,
);

// Tipos para os dados da dashboard
interface DashboardData {
  totalInspecoes: number;
  inspecoesAprovadas: number;
  inspecoesReprovadas: number;
  taxaAprovacao: number;
  porStatus: {
    labels: string[];
    data: number[];
  };
  evolucaoTemporal: {
    labels: string[];
    aprovadas: number[];
    reprovadas: number[];
    emAnalise: number[];
    pendentes: number[];
  };
  porTipo: {
    labels: string[];
    data: number[];
  };
  comparativoAprovacoes: {
    labels: string[];
    aprovadas: number[];
    reprovadas: number[];
  };
  ultimasInspecoes: Array<{
    id: number;
    data: string;
    tipo: string;
    status: string;
    responsavel: string;
    observacoes: string;
    prioridade: string;
  }>;
}

// Cores para os gráficos
const chartColors = {
  aprovado: "rgba(75, 192, 75, 0.8)",
  reprovado: "rgba(255, 99, 132, 0.8)",
  emAnalise: "rgba(54, 162, 235, 0.8)",
  pendente: "rgba(255, 206, 86, 0.8)",
  tipos: [
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 99, 132, 0.8)",
  ],
};

export function Dashboard() {
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { isSmartphone } = useDeviceDetection();

  // Estados
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<string>("last12months");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Configurar breadcrumb
  useEffect(() => {
    setPageBreadcrumb([{ text: "Dashboard" }]);
  }, [setPageBreadcrumb]);


  // Função para processar os dados das inspeções
  const processInspectionData = useCallback(
    (dateRangeFilter: string): DashboardData => {
      // TODO: Integrar com dados reais quando disponível
      // Temporariamente usando array vazio até integração
      let filteredInspections: any[] = [];

      // Aplicar filtro de data
      const today = new Date();
      let startDate = new Date();

      switch (dateRangeFilter) {
        case "last30days":
          startDate.setDate(today.getDate() - 30);
          break;
        case "last90days":
          startDate.setDate(today.getDate() - 90);
          break;
        case "last6months":
          startDate.setMonth(today.getMonth() - 6);
          break;
        case "last12months":
        default:
          startDate.setMonth(today.getMonth() - 12);
          break;
      }

      // TODO: Implementar filtro quando dados reais estiverem disponíveis
      // filteredInspections = filteredInspections.filter(
      //   (inspection) => new Date(inspection.reportStartDate) >= startDate,
      // );

      // Calcular métricas - valores padrão até integração
      const aprovadas = 0;
      const reprovadas = 0;
      const emAnalise = 0;
      const pendentes = 0;
      const total = 0;

      // Dados por status para gráfico de pizza
      const statusLabels = ["Aprovadas", "Reprovadas", "Em Análise", "Pendentes"];
      const statusData = [aprovadas, reprovadas, emAnalise, pendentes];

      // Dados para evolução temporal
      // Agrupar por mês
      const lastMonths = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date;
      }).reverse();

      const monthLabels = lastMonths.map((date) => format(date, "MMM/yy", { locale: ptBR }));

      const approvedByMonth = Array(12).fill(0);
      const rejectedByMonth = Array(12).fill(0);
      const inAnalysisByMonth = Array(12).fill(0);
      const pendingByMonth = Array(12).fill(0);

      // TODO: Implementar agrupamento por mês quando dados reais estiverem disponíveis
      // filteredInspections.forEach((inspection) => {
      //   const inspectionDate = new Date(inspection.reportStartDate);
      //   ...
      // });

      // Dados por tipo de inspeção - valores padrão
      const tiposInspecao: string[] = [];
      const dadosPorTipo: number[] = [];

      // Comparativo de aprovações vs reprovações ao longo do tempo
      const comparativoLabels = monthLabels;
      const comparativoAprovadas = approvedByMonth;
      const comparativoReprovadas = rejectedByMonth;

      // Últimas inspeções - array vazio até integração
      const ultimasInspecoes: Array<{
        id: number;
        data: string;
        tipo: string;
        status: string;
        responsavel: string;
        observacoes: string;
        prioridade: string;
      }> = [];

      return {
        totalInspecoes: total,
        inspecoesAprovadas: aprovadas,
        inspecoesReprovadas: reprovadas,
        taxaAprovacao: total > 0 ? (aprovadas / total) * 100 : 0,
        porStatus: {
          labels: statusLabels,
          data: statusData,
        },
        evolucaoTemporal: {
          labels: monthLabels,
          aprovadas: approvedByMonth,
          reprovadas: rejectedByMonth,
          emAnalise: inAnalysisByMonth,
          pendentes: pendingByMonth,
        },
        porTipo: {
          labels: tiposInspecao,
          data: dadosPorTipo,
        },
        comparativoAprovacoes: {
          labels: comparativoLabels,
          aprovadas: comparativoAprovadas,
          reprovadas: comparativoReprovadas,
        },
        ultimasInspecoes,
      };
    },
    [],
  );

  // Carregar dados da dashboard
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Aguardar implementação da integração real com a API
      // Processar dados temporários
      const data = processInspectionData(dateRange);
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erro ao carregar dados da dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, processInspectionData]);

  // Carregar dados quando o período mudar
  useEffect(() => {
    loadDashboardData();
  }, [dateRange, loadDashboardData]);

  // Auto-refresh a cada 5 minutos
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (autoRefreshEnabled) {
      intervalId = setInterval(
        () => {
          loadDashboardData();
        },
        5 * 60 * 1000,
      ); // 5 minutos
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefreshEnabled, loadDashboardData]);

  // Configurações dos gráficos
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const areaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
    },
  };

  // Preparar dados para os gráficos
  const pieChartData = dashboardData
    ? {
        labels: dashboardData.porStatus.labels,
        datasets: [
          {
            data: dashboardData.porStatus.data,
            backgroundColor: [
              chartColors.aprovado,
              chartColors.reprovado,
              chartColors.emAnalise,
              chartColors.pendente,
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const lineChartData = dashboardData
    ? {
        labels: dashboardData.evolucaoTemporal.labels,
        datasets: [
          {
            label: "Aprovadas",
            data: dashboardData.evolucaoTemporal.aprovadas,
            borderColor: chartColors.aprovado,
            backgroundColor: "rgba(75, 192, 75, 0.1)",
            tension: 0.3,
          },
          {
            label: "Reprovadas",
            data: dashboardData.evolucaoTemporal.reprovadas,
            borderColor: chartColors.reprovado,
            backgroundColor: "rgba(255, 99, 132, 0.1)",
            tension: 0.3,
          },
          {
            label: "Em Análise",
            data: dashboardData.evolucaoTemporal.emAnalise,
            borderColor: chartColors.emAnalise,
            backgroundColor: "rgba(54, 162, 235, 0.1)",
            tension: 0.3,
          },
          {
            label: "Pendentes",
            data: dashboardData.evolucaoTemporal.pendentes,
            borderColor: chartColors.pendente,
            backgroundColor: "rgba(255, 206, 86, 0.1)",
            tension: 0.3,
          },
        ],
      }
    : null;

  const barChartData = dashboardData
    ? {
        labels: dashboardData.porTipo.labels,
        datasets: [
          {
            label: "Quantidade",
            data: dashboardData.porTipo.data,
            backgroundColor: chartColors.tipos,
            borderWidth: 1,
          },
        ],
      }
    : null;

  const areaChartData = dashboardData
    ? {
        labels: dashboardData.comparativoAprovacoes.labels,
        datasets: [
          {
            fill: true,
            label: "Aprovadas",
            data: dashboardData.comparativoAprovacoes.aprovadas,
            borderColor: chartColors.aprovado,
            backgroundColor: "rgba(75, 192, 75, 0.2)",
          },
          {
            fill: true,
            label: "Reprovadas",
            data: dashboardData.comparativoAprovacoes.reprovadas,
            borderColor: chartColors.reprovado,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      }
    : null;

  // Paginação da tabela
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    dashboardData?.ultimasInspecoes.slice(indexOfFirstItem, indexOfLastItem) || [];

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "concluída":
        return "success";
      case "cancelada":
        return "warning";
      case "em andamento":
        return "helper";
      default:
        return "default";
    }
  };

  // Função para obter cor da prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "crítica":
        return "warning";
      case "alta":
        return "helper";
      case "média":
        return "default";
      default:
        return "success";
    }
  };

  return (
    <AnimatedPage>
      <Section>
        <Container fluid>
          {/* Cabeçalho */}
          <Row className="mb-4 align-items-center">
            <Col>
              <div className="d-flex align-items-center gap-2">
                <Icon icon="dashboard" size="md" />
                <Heading size="sm">Dashboard de Inspeções</Heading>
              </div>
            </Col>
          </Row>

          {/* Filtros */}
          <Row className="mb-4">
            {/* Filtro de período */}
            <Col md={6} sm={12} className="mb-3 mb-md-0">
              <Select
                label="Período"
                name="periodo"
                placeholder="Selecione um período"
                options={[
                  { value: "last30days", label: "Últimos 30 dias" },
                  { value: "last90days", label: "Últimos 90 dias" },
                  { value: "last6months", label: "Últimos 6 meses" },
                  { value: "last12months", label: "Últimos 12 meses" },
                ]}
                value={dateRange}
                onChange={(option: IOption) => setDateRange(option.value as string)}
              />
            </Col>

            {/* Auto-refresh e Exportar */}
            <Col md={6} sm={12} className="d-flex align-items-end justify-content-between">
              <Form.Check
                type="switch"
                id="auto-refresh"
                label="Atualização automática"
                checked={autoRefreshEnabled}
                onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
              />

              {/* <Button
                styles="primary"
                onClick={exportData}
                disabled={!dashboardData}
                icon="download"
              >
                Exportar CSV
              </Button> */}
            </Col>
          </Row>

          {/* Última atualização */}
          <Row className="mb-4">
            <Col>
              <Paragraph size="xs" className="text-muted">
                Última atualização: {lastUpdated.toLocaleTimeString()}
              </Paragraph>
            </Col>
          </Row>

          {/* Cards de Métricas */}
          <Row className="mb-4">
            {/* Total de Inspeções */}
            <Col lg={3} md={6} sm={6} xs={12} className="mb-3 mb-lg-0">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    <>
                      <Subtitle size="xs" color="primary">
                        Total de Inspeções
                      </Subtitle>
                      <Heading size="md">{dashboardData?.totalInspecoes || 0}</Heading>
                      <div className="mt-2">
                        <Icon icon="assignment" size="md" mode="primary" />
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Inspeções Aprovadas */}
            <Col lg={3} md={6} sm={6} xs={12} className="mb-3 mb-lg-0">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    <>
                      <Subtitle size="xs" color="primary">
                        Inspeções Aprovadas
                      </Subtitle>
                      <Heading size="md">{dashboardData?.inspecoesAprovadas || 0}</Heading>
                      <div className="mt-2">
                        <Icon icon="check_circle" size="md" mode="success" />
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Inspeções Reprovadas */}
            <Col lg={3} md={6} sm={6} xs={12} className="mb-3 mb-lg-0">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    <>
                      <Subtitle size="xs" color="primary">
                        Inspeções Reprovadas
                      </Subtitle>
                      <Heading size="md">{dashboardData?.inspecoesReprovadas || 0}</Heading>
                      <div className="mt-2">
                        <Icon icon="cancel" size="md" mode="warning" />
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Taxa de Aprovação */}
            <Col lg={3} md={6} sm={6} xs={12} className="mb-3 mb-lg-0">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  {loading ? (
                    <Skeleton />
                  ) : (
                    <>
                      <Subtitle size="xs" color="primary">
                        Taxa de Aprovação
                      </Subtitle>
                      <Heading size="md">{dashboardData?.taxaAprovacao.toFixed(1) || 0}%</Heading>
                      <div className="mt-2">
                        <Icon
                          icon="trending_up"
                          size="md"
                          mode={
                            dashboardData && dashboardData.taxaAprovacao > 70 ? "success" : "helper"
                          }
                        />
                      </div>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Gráficos - Primeira Linha */}
          <Row className="mb-4">
            {/* Gráfico de Pizza - Status */}
            <Col lg={6} md={12} className="mb-4 mb-lg-0">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Subtitle size="xs" className="mb-3">
                    Distribuição por Status
                  </Subtitle>
                  {loading ? (
                    <div style={{ height: "300px" }}>
                      <Skeleton />
                    </div>
                  ) : pieChartData ? (
                    <div style={{ height: "300px" }}>
                      <Pie data={pieChartData} options={pieChartOptions} />
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <Paragraph size="sm">Sem dados disponíveis</Paragraph>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Gráfico de Barras - Tipos */}
            <Col lg={6} md={12}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Subtitle size="xs" className="mb-3">
                    Inspeções por Tipo
                  </Subtitle>
                  {loading ? (
                    <div style={{ height: "300px" }}>
                      <Skeleton />
                    </div>
                  ) : barChartData ? (
                    <div style={{ height: "300px" }}>
                      <Bar data={barChartData} options={barChartOptions} />
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <Paragraph size="sm">Sem dados disponíveis</Paragraph>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Gráficos - Segunda Linha */}
          <Row className="mb-4">
            {/* Gráfico de Linha - Evolução Temporal */}
            <Col lg={6} md={12} className="mb-4 mb-lg-0">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Subtitle size="xs" className="mb-3">
                    Evolução Temporal
                  </Subtitle>
                  {loading ? (
                    <div style={{ height: "300px" }}>
                      <Skeleton />
                    </div>
                  ) : lineChartData ? (
                    <div style={{ height: "300px" }}>
                      <Line data={lineChartData} options={lineChartOptions} />
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <Paragraph size="sm">Sem dados disponíveis</Paragraph>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Gráfico de Área - Comparativo */}
            <Col lg={6} md={12}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Subtitle size="xs" className="mb-3">
                    Comparativo: Aprovadas vs. Reprovadas
                  </Subtitle>
                  {loading ? (
                    <div style={{ height: "300px" }}>
                      <Skeleton />
                    </div>
                  ) : areaChartData ? (
                    <div style={{ height: "300px" }}>
                      <Line data={areaChartData} options={areaChartOptions} />
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <Paragraph size="sm">Sem dados disponíveis</Paragraph>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Tabela de Últimas Inspeções */}
          <Row>
            <Col>
              <Card className="shadow-sm">
                <Card.Body>
                  <Subtitle size="xs" className="mb-3">
                    Últimas Inspeções
                  </Subtitle>

                  <div className="table-responsive">
                    <Table $responsive $hover $bordered>
                      <Thead>
                        <Tr>
                          <Th>
                            <Heading size="xs">Data</Heading>
                          </Th>
                          <Th hideOnMobile={isSmartphone}>
                            <Heading size="xs">Tipo</Heading>
                          </Th>
                          <Th>
                            <Heading size="xs">Status</Heading>
                          </Th>
                          <Th hideOnMobile={true}>
                            <Heading size="xs">Prioridade</Heading>
                          </Th>
                          <Th hideOnMobile={isSmartphone}>
                            <Heading size="xs">Responsável</Heading>
                          </Th>
                          <Th hideOnMobile={true}>
                            <Heading size="xs">Observações</Heading>
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {loading ? (
                          Array(5)
                            .fill(0)
                            .map((_, index) => (
                              <Tr key={index}>
                                <Td colSpan={6}>
                                  <Skeleton />
                                </Td>
                              </Tr>
                            ))
                        ) : currentItems.length > 0 ? (
                          currentItems.map((inspecao, index) => (
                            <Tr key={index} expandable={isSmartphone}>
                              <Td>
                                <Paragraph size="sm">{inspecao.data}</Paragraph>
                              </Td>
                              <Td hideOnMobile={isSmartphone}>
                                <Paragraph size="sm">{inspecao.tipo}</Paragraph>
                              </Td>
                              <Td>
                                <div className="d-flex justify-content-center">
                                  <Tag size="lg" status={getStatusColor(inspecao.status)}>
                                    {inspecao.status}
                                  </Tag>
                                </div>
                              </Td>
                              <Td hideOnMobile={true}>
                                <div className="d-flex justify-content-center">
                                  <Tag size="lg" status={getPriorityColor(inspecao.prioridade)}>
                                    {inspecao.prioridade}
                                  </Tag>
                                </div>
                              </Td>
                              <Td hideOnMobile={isSmartphone}>
                                <Paragraph size="sm">{inspecao.responsavel}</Paragraph>
                              </Td>
                              <Td hideOnMobile={true}>
                                <Paragraph size="sm">
                                  {inspecao.observacoes.substring(0, 50)}
                                  {inspecao.observacoes.length > 50 ? "..." : ""}
                                </Paragraph>
                              </Td>
                            </Tr>
                          ))
                        ) : (
                          <Tr>
                            <Td colSpan={6}>
                              <div className="text-center py-4">
                                <Paragraph size="sm">Nenhuma inspeção encontrada</Paragraph>
                              </div>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </div>

                  {/* Paginação */}
                  {dashboardData && dashboardData.ultimasInspecoes.length > itemsPerPage && (
                    <div className="d-flex justify-content-end mt-3">
                      <Pagination
                        defaultCurrent={currentPage}
                        pageSize={itemsPerPage}
                        total={dashboardData.ultimasInspecoes.length}
                        onChange={(page) => setCurrentPage(page)}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Section>
    </AnimatedPage>
  );
}
