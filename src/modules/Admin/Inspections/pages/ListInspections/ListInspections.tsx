import { Section } from "@shared/components/Core/Containers/Section";
import { Pagination } from "@shared/components/Core/Pagination";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { ItemsPerPage } from "@shared/components/Core/Table/ItemsPerPage";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { Col, Container, Row } from "react-bootstrap";
import { createPortal } from "react-dom";

import { Tab, Tabs } from "@/shared/components/Core/Tabs";

import { ExportExcelModal } from "./components/ExportExcelModal";
import { ExportPDFModal } from "./components/ExportPDFModal";
import { InspectionListPDFReport } from "./components/InspectionListPDFReport/InspectionListPDFReport";
import { InspectionPDFReport } from "./components/InspectionPDFReport ";
import { InspectionSearchForm } from "./components/InspectionSearchForm/InspectionSearchForm";
import { InspectionsTable } from "./components/InspectionsTable";
import { useInspectionsRules } from "./useInspectionsRules";

export function ListInspections() {
  const {
    tableMode,
    setTableMode,
    isOnline,
    isInspectionChanger,
    SEARCH_OPTIONS,
    result,
    params,
    offlineInspections,
    errorsCount,
    storageBarData,
    pdfRef,
    inspectionToPrint,
    handleGeneratePdf,
    handleOnSearch,
    handleOnChangeItemsPerPage,
    handleOnChangePage,
    handleOnChangeStatusInspection,
    handleDeleteInspection,
    addNew,
    updateOfflineInspection,
    handleSyncInspection,
    handleExportExcel,
    showExportModal,
    handleCloseExportModal,
    handleConfirmExport,
    showExportPDFModal,
    handleCloseExportPDFModal,
    handleExportPDF,
    handleConfirmExportPDF,
    pdfListRef,
    pdfListData,
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
                onExport={handleExportExcel}
                onExportPDF={handleExportPDF}
                offline={tableMode === "offline"}
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
                  onGeneratePdf={(id, title) => handleGeneratePdf(id, title)}
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
                  onEdit={(id: string) => updateOfflineInspection(id)}
                  handleOnChangeStatusInspection={(id: string, inStatus: boolean) =>
                    handleOnChangeStatusInspection(id, inStatus)
                  }
                  handleDeleteInspection={(id: string) => handleDeleteInspection(id)}
                  offline={true}
                  onRetrySync={(id: string) => handleSyncInspection(id)}
                  storageBarData={storageBarData}
                />
              </Row>
            </Tab>
          </Tabs>

          {tableMode === "online" && (
            <Row>
              <Col xs={9}>
                <ItemsPerPage
                  onChange={(items) => handleOnChangeItemsPerPage(Number(items.value))}
                />
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
          )}
        </Container>
      </Section>

      <ExportExcelModal
        isOpen={showExportModal}
        onClose={handleCloseExportModal}
        onConfirm={handleConfirmExport}
      />

      <ExportPDFModal
        isOpen={showExportPDFModal}
        onClose={handleCloseExportPDFModal}
        onConfirm={handleConfirmExportPDF}
      />

      {inspectionToPrint &&
        createPortal(
          <div
            ref={pdfRef}
            className="pdf-print-area"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "210mm",
              minHeight: "297mm",
              // padding: "2mm 0 2mm 0",
              boxSizing: "border-box",
              backgroundColor: "#fff",
              // transform: "translateX(-10000px)",
            }}
          >
            <InspectionPDFReport inspection={inspectionToPrint} />
          </div>,
          document.body,
        )}

      {pdfListData &&
        createPortal(
          <div
            ref={pdfListRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <InspectionListPDFReport
              data={pdfListData.data}
              fields={pdfListData.fields}
              generatedAt={pdfListData.generatedAt}
            />
          </div>,
          document.body,
        )}
    </AnimatedPage>
  );
}
