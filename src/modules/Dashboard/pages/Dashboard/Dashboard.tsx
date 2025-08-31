import { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { Section } from "@shared/components/Core/Containers/Section";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Select } from "@shared/components/Core/Form/Fields/Select";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Table, Thead, Tbody, Tr, Th, Td } from "@shared/components/Core/Table";
import { Tag } from "@shared/components/Core/Tag";
import { Pagination } from "@shared/components/Core/Pagination";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
/* import { customers } from "@shared/hooks/services/Admin/useCustomers"; */
import { useDashboard } from "@shared/hooks/services/Dashboard/useDashboard";
import { usePartInspectionStatusDropdown } from "@shared/hooks/services/Admin/Dropdown/usePartInspectionStatusDropdown";
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
    aprovadasComRestricao: number[];
    reprovadas: number[];
  };
  ultimasInspecoes: Array<{
    id: string;
    reportNumber: string;
    reportStartDate: string;
    customer: { fantasyName: string };
    partType: { name: string };
    inspectionStatus: { description: string };
    inspectorUser: { name: string };
  }>;
}

// Cores para os gráficos
const chartColors = {
  aprovado: "rgba(75, 192, 75, 0.8)", // Verde
  reprovado: "rgba(220, 53, 69, 0.8)", // Vermelho (helper)
  emAnalise: "rgba(54, 162, 235, 0.8)", // Azul
  pendente: "rgba(255, 206, 86, 0.8)", // Amarelo
  aprovadasComRestricao: "rgba(255, 193, 7, 0.8)", // Laranja (warning)
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
  const [dateRange, setDateRange] = useState<string>("last12months");
  const { data: dashboardApiData, loading, refetch } = useDashboard(dateRange);
  const { result: statusOptions } = usePartInspectionStatusDropdown();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Configurar breadcrumb
  useEffect(() => {
    setPageBreadcrumb([{ text: "Página Inicial" }]);
  }, [setPageBreadcrumb]);

  // Função para processar os dados das inspeções
  const processInspectionData = useCallback((): DashboardData => {
    if (!dashboardApiData || !dashboardApiData.temporalEvolution || dashboardApiData.temporalEvolution.length === 0) {
      return {
        totalInspecoes: 0,
        inspecoesAprovadas: 0,
        inspecoesReprovadas: 0,
        taxaAprovacao: 0,
        porStatus: {
          labels: ["Aprovadas", "Reprovadas", "Em Análise", "Pendentes"],
          data: [0, 0, 0, 0],
        },
        evolucaoTemporal: {
          labels: Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return format(date, "MMM/yy", { locale: ptBR });
          }).reverse(),
          aprovadas: Array(12).fill(0),
          reprovadas: Array(12).fill(0),
          emAnalise: Array(12).fill(0),
          pendentes: Array(12).fill(0),
        },
        porTipo: {
          labels: [],
          data: [],
        },
        comparativoAprovacoes: {
          labels: Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return format(date, "MMM/yy", { locale: ptBR });
          }).reverse(),
          aprovadas: Array(12).fill(0),
          aprovadasComRestricao: Array(12).fill(0),
          reprovadas: Array(12).fill(0),
        },
        ultimasInspecoes: [],
      };
    }

    // Extrair dados dos cards totalizadores
    const totalCard = dashboardApiData.totalizingCards.find((card) => card.title.includes("Total"));
    const approvedCard = dashboardApiData.totalizingCards.find(
      (card) => card.title === "Inspeções Aprovadas",
    );
    const approvedWithRestrictionCard = dashboardApiData.totalizingCards.find(
      (card) => card.title === "Com Restrições",
    );
    const inAnalysisCard = dashboardApiData.totalizingCards.find(
      (card) => card.title === "Em Análise",
    );
    const nonConformingCard = dashboardApiData.totalizingCards.find(
      (card) => card.title === "Não Conforme",
    );

    const totalInspecoes = totalCard?.value || 0;
    const aprovadas = approvedCard?.value || 0;
    const aprovadasComRestricao = approvedWithRestrictionCard?.value || 0;
    const emAnalise = inAnalysisCard?.value || 0;
    const naoConforme = nonConformingCard?.value || 0;

    // Para compatibilidade com os gráficos existentes
    const reprovadas = naoConforme;

    // Dados por status para gráfico de pizza usando os status da API
    const statusLabels = ["Aprovadas", "Aprovadas c/ Restrição", "Em Análise", "Não Conforme"];
    const statusData = [aprovadas, aprovadasComRestricao, emAnalise, naoConforme];

    // Dados por tipo de inspeção (usando dados de partTypes)
    const tiposInspecao = dashboardApiData.partTypes?.map((pt) => pt.partTypeName) || [];
    const dadosPorTipo = dashboardApiData.partTypes?.map((pt) => pt.amount) || [];

    // Dados da evolução temporal
    const evolutionLabels = dashboardApiData.temporalEvolution.map((te) =>
      format(new Date(te.year, te.month - 1), "MMM/yy", { locale: ptBR }),
    );
    // Usar os valores corretos dos totalizingCards para o gráfico comparativo
    const approvedByMonth = dashboardApiData.temporalEvolution.map((te, index, arr) => {
      // Se o temporal evolution tem dados válidos, use apenas o campo "aprovado" (não total_aprovado)
      if (te.aprovado > 0) {
        return te.aprovado;
      }
      // Caso contrário, coloque o valor total no mês mais recente (último item)
      if (aprovadas > 0 && index === arr.length - 1) {
        return aprovadas;
      }
      return 0;
    });

    const approvedWithRestrictionByMonth = dashboardApiData.temporalEvolution.map((te, index, arr) => {
      // Se o temporal evolution tem dados válidos, use-os
      if (te.aprovado_com_restricao > 0) {
        return te.aprovado_com_restricao;
      }
      // Caso contrário, coloque o valor total no mês mais recente (último item)
      if (aprovadasComRestricao > 0 && index === arr.length - 1) {
        return aprovadasComRestricao;
      }
      return 0;
    });

    const rejectedByMonth = dashboardApiData.temporalEvolution.map((te, index, arr) => {
      // Se o temporal evolution tem dados válidos, use-os
      if (te.nao_conforme > 0) {
        return te.nao_conforme;
      }
      // Caso contrário, coloque o valor total no mês mais recente (último item)
      if (naoConforme > 0 && index === arr.length - 1) {
        return naoConforme;
      }
      return 0;
    });
    const inAnalysisByMonth = dashboardApiData.temporalEvolution.map((te) => te.em_analise);
    const pendingByMonth = dashboardApiData.temporalEvolution.map(
      (te) => te.aprovado_com_restricao,
    );

    const comparativoData = {
      labels: evolutionLabels,
      aprovadas: approvedByMonth,
      aprovadasComRestricao: approvedWithRestrictionByMonth,
      reprovadas: rejectedByMonth,
    };


    return {
      totalInspecoes,
      inspecoesAprovadas: aprovadas,
      inspecoesReprovadas: reprovadas,
      taxaAprovacao: approvedCard?.percentage || 0,
      porStatus: {
        labels: statusLabels,
        data: statusData,
      },
      evolucaoTemporal: {
        labels: evolutionLabels,
        aprovadas: approvedByMonth,
        reprovadas: rejectedByMonth,
        emAnalise: inAnalysisByMonth,
        pendentes: pendingByMonth,
      },
      porTipo: {
        labels: tiposInspecao,
        data: dadosPorTipo,
      },
      comparativoAprovacoes: comparativoData,
      ultimasInspecoes: dashboardApiData?.latestInspections || [],
    };
  }, [dashboardApiData, statusOptions]);

  // Atualizar dados processados quando API data mudar
  useEffect(() => {
    if (dashboardApiData) {
      const data = processInspectionData();
      setDashboardData(data);
      setLastUpdated(new Date());
    }
  }, [dashboardApiData, processInspectionData]);

  // Auto-refresh a cada 5 minutos
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (autoRefreshEnabled) {
      intervalId = setInterval(
        () => {
          refetch(dateRange);
        },
        5 * 60 * 1000,
      ); // 5 minutos
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefreshEnabled, refetch, dateRange]);

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
              chartColors.aprovadasComRestricao,
              chartColors.emAnalise,
              chartColors.reprovado,
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const barChartData =
    dashboardData && dashboardData.porTipo.labels.length > 0
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
            label: "Aprovadas c/ Restrição",
            data: dashboardData.comparativoAprovacoes.aprovadasComRestricao,
            borderColor: chartColors.aprovadasComRestricao,
            backgroundColor: "rgba(255, 193, 7, 0.2)",
          },
          {
            fill: true,
            label: "Não Conforme",
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
    switch (status) {
      case "Aprovado":
        return "success"; // Verde
      case "Aprovado com restrição":
        return "helper"; // Vermelho
      case "Em análise":
        return "neutral"; // Azul
      case "Não conforme":
        return "warning"; // Laranja
      default:
        return "default"; // Cinza para outros casos
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
          <Row className="mb-4 g-3 d-flex justify-content-center">
            {dashboardApiData?.totalizingCards.map((card, index) => (
              <Col
                key={index}
                className="d-flex justify-content-center"
                style={{
                  flex: "1 1 0",
                  minWidth: isSmartphone ? "100%" : "200px",
                  maxWidth: isSmartphone ? "100%" : "240px",
                }}
              >
                <Card className="w-100 shadow-sm" style={{ minHeight: "140px" }}>
                  <Card.Body className="d-flex flex-column justify-content-between text-center">
                    {loading ? (
                      <Skeleton />
                    ) : (
                      <>
                        <Subtitle size="xs" color="primary" className="mb-2">
                          {card.title}
                        </Subtitle>
                        <div className="mb-2">
                          <Heading size="md">
                            {card.title === "Taxa de Aprovação" ? `${card.value}%` : card.value}
                          </Heading>
                        </div>
                        <div className="d-flex justify-content-center">
                          <Icon icon={card.icon} size="md" mode={card.status} />
                        </div>
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
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
            {/* Gráfico de Área - Comparativo */}
            <Col lg={12} md={12}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Subtitle size="xs" className="mb-3">
                    Comparativo: Aprovadas vs. Aprovadas c/ Restrição vs. Não Conforme
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
                            <Heading size="xs">Nº Relatório</Heading>
                          </Th>
                          <Th hideOnMobile={isSmartphone}>
                            <Heading size="xs">Data</Heading>
                          </Th>
                          <Th hideOnMobile={isSmartphone}>
                            <Heading size="xs">Cliente</Heading>
                          </Th>
                          <Th>
                            <Heading size="xs">Tipo Peça</Heading>
                          </Th>
                          <Th>
                            <div className="d-flex justify-content-center">
                              <Heading size="xs">Status</Heading>
                            </div>
                          </Th>
                          <Th hideOnMobile={isSmartphone}>
                            <Heading size="xs">Inspetor</Heading>
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
                                <Paragraph size="sm">{inspecao.reportNumber}</Paragraph>
                              </Td>
                              <Td hideOnMobile={isSmartphone}>
                                <Paragraph size="sm">
                                  {new Date(inspecao.reportStartDate).toLocaleDateString("pt-BR")}
                                </Paragraph>
                              </Td>
                              <Td hideOnMobile={isSmartphone}>
                                <Paragraph size="sm">{inspecao.customer.fantasyName}</Paragraph>
                              </Td>
                              <Td>
                                <Paragraph size="sm">{inspecao.partType.name}</Paragraph>
                              </Td>
                              <Td>
                                <div className="d-flex justify-content-center">
                                  <Tag
                                    size="lg"
                                    status={getStatusColor(inspecao.inspectionStatus.description)}
                                  >
                                    {inspecao.inspectionStatus.description}
                                  </Tag>
                                </div>
                              </Td>
                              <Td hideOnMobile={isSmartphone}>
                                <Paragraph size="sm">{inspecao.inspectorUser.name}</Paragraph>
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
