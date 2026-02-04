import { Section } from "@shared/components/Core/Containers/Section";
import { Pagination } from "@shared/components/Core/Pagination";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { ItemsPerPage } from "@shared/components/Core/Table/ItemsPerPage";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { Col, Container, Row } from "react-bootstrap";

import { Tab, Tabs } from "@/shared/components/Core/Tabs";

import { InspectionPDFReport } from "./components/InspectionPDFReport ";
import { InspectionSearchForm } from "./components/InspectionSearchForm/InspectionSearchForm";
import { InspectionsTable } from "./components/InspectionsTable";
import { useInspectionsRules } from "./useInspectionsRules";

export function ListInspections() {
  const {
    // Estados
    tableMode,
    setTableMode,
    isOnline,

    // Permissões
    isInspectionChanger,

    // Constantes
    SEARCH_OPTIONS,

    // Hook inspections
    result,
    params,

    // Hook offline inspections
    offlineInspections,
    errorsCount,

    // PDF
    pdfRef,
    inspectionToPrint,
    handleGeneratePdf,

    // Callbacks de busca/paginação
    handleOnSearch,
    handleOnChangeItemsPerPage,
    handleOnChangePage,

    // Callbacks de ações
    addNew,
    handleOnChangeStatusInspection,
  } = useInspectionsRules();

  return (
    <AnimatedPage>
      <Section>
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <InspectionSearchForm
                searchOptions={SEARCH_OPTIONS}
                defaultValues={
                  params
                    ? {
                        searchingBy: params.searchingBy,
                        search: params.search,
                        inspectionStatusId: params.inspectionStatusId,
                      }
                    : null
                }
                onSubmit={(search) => handleOnSearch(search)}
                onAdd={isInspectionChanger() ? addNew : undefined}
              />
            </Col>
          </Row>

          <Tabs
            defaultActiveKey={tableMode}
            onChange={(key) => setTableMode(key as "online" | "offline")}
          >
            <Tab eventKey="online" title="Online" disabled={!isOnline}>
              <Row className="mb-3">
                <InspectionsTable
                  data={result?.data || null}
                  onEdit={(id: string) => addNew(id)}
                  onGeneratePdf={(id: string) => handleGeneratePdf(id)}
                  handleOnChangeStatusInspection={(id: string, inStatus: boolean) =>
                    handleOnChangeStatusInspection(id, inStatus)
                  }
                  offline={false}
                />
              </Row>
            </Tab>
            <Tab
              eventKey="offline"
              title={
                <span>
                  Offline
                  {offlineInspections && offlineInspections.length > 0 && (
                    <span className="badge bg-info ms-2">{offlineInspections.length}</span>
                  )}
                  {errorsCount > 0 && <span className="badge bg-danger ms-2">{errorsCount}</span>}
                </span>
              }
            >
              <Row className="mb-3">
                <InspectionsTable
                  data={offlineInspections || null}
                  onEdit={(id: string) => addNew(id)}
                  onGeneratePdf={(id: string) => handleGeneratePdf(id)}
                  handleOnChangeStatusInspection={(id: string, inStatus: boolean) =>
                    handleOnChangeStatusInspection(id, inStatus)
                  }
                  offline={true}
                />
              </Row>
            </Tab>
          </Tabs>

          <Row>
            <Col xs={9}>
              <ItemsPerPage onChange={(items) => handleOnChangeItemsPerPage(Number(items.value))} />
            </Col>

            <Col xs={3} className="d-flex justify-content-end ">
              {params && result ? (
                <Pagination
                  key={params.page}
                  defaultCurrent={params.page}
                  pageSize={Number(params.records)}
                  total={result.total}
                  onChange={(page) => handleOnChangePage(page)}
                />
              ) : (
                <Skeleton />
              )}
            </Col>
          </Row>
        </Container>
        {inspectionToPrint && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "210mm",
              opacity: 0,
              pointerEvents: "none",
              zIndex: -9999,
              overflow: "hidden",
            }}
          >
            <InspectionPDFReport ref={pdfRef} inspection={inspectionToPrint} />
          </div>
        )}
      </Section>
    </AnimatedPage>
  );
}
