/* eslint-disable simple-import-sort/imports */
import { Section } from "@shared/components/Core/Containers/Section";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Tag } from "@shared/components/Core/Tag";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
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
import { Col, Container, Row } from "react-bootstrap";

import { useCustomersDropdown } from "@/shared/hooks/services/Admin/Dropdown/useCustomersDropdown";
import { useMemo } from "react";
import { createPortal } from "react-dom";
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
    autoRefreshEnabled,
    handleGeneratePDF,
    handleLatestInspectionsRefetchReady,
    handleSearchParams,
    inspectionByType,
    isCustomer,
    lastUpdated,
    params,
    pdfRef,
    setAutoRefreshEnabled,
    temporalEvolution,
    totalizingCards,
  } = useDashboardRules();

  const { result: CUSTOMER_OPTIONS } = useCustomersDropdown({ onlyActive: false });

  const customerName = useMemo(() => {
    if (!params?.customerId || params.customerId === "") return "Todos";
    const customer = CUSTOMER_OPTIONS.find((option) => option.value === params.customerId);
    return customer?.label || "Todos";
  }, [params?.customerId, CUSTOMER_OPTIONS]);

  return (
    <>
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
              onGeneratePDF={handleGeneratePDF}
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
      {createPortal(
        <div
          ref={pdfRef}
          style={{
            padding: "2rem 0",
            boxSizing: "border-box",
          }}
        >
          {/* Cabeçalho com Título, Filtros e Data de Atualização */}
          <Row className="align-items-center mb-4">
            <Col md="auto" className="d-flex align-items-center gap-2">
              <Icon icon="dashboard" size="md" />
              <Heading size="sm" className="mb-0">
                Dashboard de Inspeções
              </Heading>
            </Col>
            <Col className="d-flex align-items-center gap-2 flex-wrap">
              <Paragraph size="xs" className="mb-0 fw-bold">
                | Filtros:
              </Paragraph>
              {params?.initialReportStartDate && (
                <div className="d-flex align-items-center gap-1">
                  <Paragraph size="xs" className="mb-0">
                    Início:
                  </Paragraph>
                  <Tag size="sm" status="default">
                    {new Date(params.initialReportStartDate + "T00:00:00").toLocaleDateString(
                      "pt-BR",
                    )}
                  </Tag>
                </div>
              )}
              {params?.finalReportStartDate && (
                <div className="d-flex align-items-center gap-1">
                  <Paragraph size="xs" className="mb-0">
                    Fim:
                  </Paragraph>
                  <Tag size="sm" status="default">
                    {new Date(params.finalReportStartDate + "T00:00:00").toLocaleDateString(
                      "pt-BR",
                    )}
                  </Tag>
                </div>
              )}
              <div className="d-flex align-items-center gap-1">
                <Paragraph size="xs" className="mb-0">
                  Cliente:
                </Paragraph>
                <Tag size="sm" status="default">
                  {customerName}
                </Tag>
              </div>
            </Col>
            <Col md="auto" className="text-end">
              <Paragraph size="xs" className="mb-0 text-muted">
                Atualizado em: {lastUpdated.toLocaleString("pt-BR")}
              </Paragraph>
            </Col>
          </Row>

          <TotalizingCards data={totalizingCards.data} loading={totalizingCards.loading} />

          <Row className="mb-4">
            <Col md={6}>
              <StatusPieChart data={totalizingCards.data} loading={totalizingCards.loading} />
            </Col>
            <Col md={6}>
              <InspectionByType data={inspectionByType.data} loading={inspectionByType.loading} />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <TemporalEvolutionChart
                data={temporalEvolution.data}
                loading={temporalEvolution.loading}
              />
            </Col>
          </Row>
        </div>,
        document.body,
      )}
    </>
  );
}
