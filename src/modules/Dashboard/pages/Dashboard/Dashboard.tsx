import { ROUTE_LIST_INSPECTIONS } from "@/modules/Admin/Inspections/routes/Inspection.paths";
import { ButtonLink } from "@/shared/components/Core/Buttons/ButtonLink";
import { Section } from "@shared/components/Core/Containers/Section";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { Table, Tbody, Td, Th, Thead, Tr } from "@shared/components/Core/Table";
import { Tag } from "@shared/components/Core/Tag";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Bar, Line, Pie } from "react-chartjs-2";
import { TotalizingCards } from "./components/Charts/TotalizingCards";
import { DashboardSearchForm } from "./components/SearchForm";
import { useDashboardRules } from "./useDashboardRules";

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

export function Dashboard() {
  // Usar o hook de regras de negócio
  const {
    dashboardData,
    dashboardApiData,
    loading,
    lastUpdated,
    isSmartphone,
    pieChartOptions,
    barChartOptions,
    areaChartOptions,
    pieChartData,
    barChartData,
    areaChartData,
    getStatusColor,
    params,
    handleSearchParams,
  } = useDashboardRules();

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
          <DashboardSearchForm
            initialValues={params}
            onSearch={(params) => handleSearchParams(params)}
          />

          {/* Última atualização */}
          <Row className="mb-4">
            <Col>
              <Paragraph size="xs" className="text-muted">
                Última atualização: {lastUpdated.toLocaleTimeString()}
              </Paragraph>
            </Col>
          </Row>

          {/* Cards de Métricas */}
          <TotalizingCards params={params} />

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
                    Comparativo: Aprovadas vs. Com Restrição vs. Não Conforme
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
                        ) : dashboardData && dashboardData?.ultimasInspecoes.length > 0 ? (
                          <>
                            {dashboardData?.ultimasInspecoes.map((inspecao, index) => (
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
                            ))}
                            <Tr>
                              <Td colSpan={6}>
                                <div className="d-flex justify-content-center">
                                  <ButtonLink route={ROUTE_LIST_INSPECTIONS} mode="dark" size="sm">
                                    Ver Mais
                                  </ButtonLink>
                                </div>
                              </Td>
                            </Tr>
                          </>
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
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Section>
    </AnimatedPage>
  );
}
