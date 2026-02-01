import { Section } from "@shared/components/Core/Containers/Section";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Col, Container, Row } from "react-bootstrap";

import { InspectionByType } from "./components/Charts/InspectionByType";
import { LatestInspections } from "./components/Charts/LatestInspections";
import { StatusPieChart } from "./components/Charts/StatusPieChart";
import { TemporalEvolutionChart } from "./components/Charts/TemporalEvolutionChart";
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
    totalizingCards,
    lastUpdated,
    params,
    handleSearchParams,
    inspectionByType,
    temporalEvolution,
    autoRefreshEnabled,
    setAutoRefreshEnabled,
    handleLatestInspectionsRefetchReady,
    isCustomer,
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
            autoRefreshEnabled={autoRefreshEnabled}
            handleAutoRefreshToggle={(enabled) => setAutoRefreshEnabled(enabled)}
            lastUpdated={lastUpdated}
          />

          {/* Cards de Métricas */}
          <TotalizingCards data={totalizingCards.data} loading={totalizingCards.loading} />

          {/* Gráficos - Primeira Linha */}
          <Row className="mb-4">
            {/* Gráfico de Pizza - Status */}
            <Col lg={6} md={12} className="mb-4 mb-lg-0">
              <StatusPieChart data={totalizingCards.data} loading={totalizingCards.loading} />
            </Col>

            {/* Gráfico de Barras - Tipos */}
            <Col lg={6} md={12}>
              <InspectionByType data={inspectionByType.data} loading={inspectionByType.loading} />
            </Col>
          </Row>
          {/* Gráficos - Segunda Linha */}
          <Row className="mb-4">
            {/* Gráfico de Área - Comparativo */}
            <Col lg={12} md={12}>
              <TemporalEvolutionChart
                data={temporalEvolution.data}
                loading={temporalEvolution.loading}
              />
            </Col>
          </Row>
          {/* Tabela de Últimas Inspeções */}
          {!isCustomer() && (
            <Row>
              <Col>
                <LatestInspections
                  params={params}
                  onRefetchReady={handleLatestInspectionsRefetchReady}
                />
              </Col>
            </Row>
          )}
        </Container>
      </Section>
    </AnimatedPage>
  );
}
