import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { Section } from "@shared/components/Core/Containers/Section";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Pagination } from "@shared/components/Core/Pagination";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { Table, Tbody, Th, Thead, Tr } from "@shared/components/Core/Table";
import { Empty } from "@shared/components/Core/Table/Empty";
import { ItemsPerPage } from "@shared/components/Core/Table/ItemsPerPage";
import { LoadingLines } from "@shared/components/Core/Table/LoadingLines";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { DEFAULT_ITEMS_PER_PAGE } from "@shared/constants/options";
import { TITLE_ADMIN_INSPECTIONS } from "@shared/constants/title.browser";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useLoaderContext } from "@shared/contexts/Loader";
import { useToastContext } from "@shared/contexts/Toast";
import { usePartInspectionStatusDropdown } from "@shared/hooks/services/Admin/Dropdown/usePartInspectionStatusDropdown";
import { useInspections } from "@shared/hooks/services/Admin/useInspections";
import { useOnlineStatus } from "@shared/hooks/useOnlineStatus";
import { useCallback, useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { InspectionSearchForm } from "./components/InspectionSearchForm/InspectionSearchForm";
import {
  IInspectionSearchForm,
  initialInspectionSearchValues,
} from "./components/InspectionSearchForm/InspectionSearchForm.form";

import {
  ROUTE_SAVE_INSPECTION,
  ROUTE_UPDATE_INSPECTION,
} from "@/modules/Admin/Inspections/routes/Inspection.paths";

import { IInspectionDetail, useInspection } from "@/shared/hooks/services/Admin/useInspection";
import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";
import { put } from "@/shared/services/api/api.service";
import { InspectionPDFReport } from "./components/InspectionPDFReport ";
import { InspectionsTable } from "./components/InspectionsTable";

export function ListInspections() {
  const navigate = useNavigate();

  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { showLoader, hideLoader } = useLoaderContext();
  const { fetchInspection } = useInspection();
  const isOnline = useOnlineStatus();

  const [searchParams, setSearchParams] = useSearchParams();

  const { result, params, setParams, refetch } = useInspections();
  const { result: inspectionStatusOptions, loading: loadingStatuses } =
    usePartInspectionStatusDropdown();

  const [loaded, setLoaded] = useState(false);

  const { isInspectionChanger } = useAuthRoles();

  const SEARCH_OPTIONS: IOption[] = [
    {
      value: "reportNumber",
      label: "Número do Relatório",
    },
    {
      value: "componentId",
      label: "Código do Equipamento",
    },
    {
      value: "corporateName",
      label: "Nome do Cliente",
    },
  ];

  // Preparar opções de status com "Todos" como primeira opção
  const statusOptionsWithAll = [{ value: "", label: "Todos" }, ...inspectionStatusOptions];

  const pdfRef = useRef<HTMLDivElement>(null);
  const [inspectionToPrint, setInspectionToPrint] = useState<IInspectionDetail | null>(null);

  const onAfterPrint = useCallback(() => {
    // Limpar dados após impressão
    setInspectionToPrint(null);
    hideLoader();
  }, [hideLoader]);

  const onPrintError = useCallback(() => {
    addToast({
      type: "warning",
      title: "Erro ao gerar PDF",
      description: "Não foi possível gerar o PDF. Tente novamente.",
    });
    hideLoader();
  }, [addToast, hideLoader]);

  const handlePrint = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: `Relatorio_${inspectionToPrint?.reportNumber || ""}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
    onAfterPrint,
    onPrintError,
  });

  useEffect(() => {
    document.title = TITLE_ADMIN_INSPECTIONS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Admin" },
      { text: "Cadastros" },
      { text: "Inspeções" },
    ]);

    setLoaded(true);
  }, [setPageBreadcrumb]);

  const handleSearchParams = useCallback(
    (params: Record<string, any>) => {
      setSearchParams({
        q: window.btoa(JSON.stringify(params)),
      });

      setParams(params);
    },
    [setSearchParams, setParams],
  );

  useEffect(() => {
    if (params === null && loaded) {
      let params;

      if (searchParams.get("q")) {
        params = JSON.parse(window.atob(String(searchParams.get("q"))));
      } else {
        params = {
          ...initialInspectionSearchValues,
          records: DEFAULT_ITEMS_PER_PAGE,
          page: 1,
          order: "reportNumber",
        };
      }

      handleSearchParams(params);
    }
  }, [params, loaded, searchParams, handleSearchParams]);

  function handleOnSearch(data: IInspectionSearchForm) {
    if (params) {
      const { search, searchingBy, inspectionStatusId, status } = data;

      const newParams = {
        ...params,
        page: 1,
        searchingBy,
        search,
        inspectionStatusId,
        status,
      };

      handleSearchParams(newParams);
    }
  }

  function handleOnChangeItemsPerPage(records: number) {
    if (params) {
      const newParams = {
        ...params,
        page: 1,
        records,
      };

      handleSearchParams(newParams);
    }
  }

  function handleOnChangePage(page: number) {
    if (params) {
      if (params.page !== page) {
        const newParams = {
          ...params,
          page,
        };

        handleSearchParams(newParams);
      }
    }
  }

  function addNew(uuid?: string) {
    navigate(!uuid ? ROUTE_SAVE_INSPECTION : `${ROUTE_UPDATE_INSPECTION}/${uuid}`);
  }

  async function handleGeneratePdf(inspectionId: string) {
    try {
      showLoader();
      const data = await fetchInspection(inspectionId);

      if (data) {
        // Setar os dados da inspeção
        setInspectionToPrint(data);

        // Aguardar renderização e chamar impressão
        setTimeout(() => {
          handlePrint();
        }, 3000);
      }
    } catch (error) {
      hideLoader();
      handleApiRejection();
      addToast({
        type: "warning",
        title: "Erro ao buscar dados",
        description: "Não foi possível buscar os dados da inspeção.",
      });
    }
  }

  async function handleOnChangeStatusInspection(inspectionId: string, inStatus: boolean) {
    showLoader();

    try {
      const { data } = await put(`/operational/parts-inspection/${inspectionId}/in-status`, {
        inStatus,
      });

      if (data) {
        addToast({
          description: `A inspeção foi ${inStatus ? "ativada" : "inativada"} com sucesso.`,
          type: "success",
          title: "Sucesso",
        });
      }

      refetch();
    } catch {
      handleApiRejection();
    } finally {
      hideLoader();
    }
  }

  return (
    <AnimatedPage>
      <Section>
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <InspectionSearchForm
                searchOptions={SEARCH_OPTIONS}
                statusOptions={statusOptionsWithAll}
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

          {!isOnline && (
            <Row className="mb-3">
              <Col>
                <Alert variant="warning">
                  <Alert.Heading>Você está offline</Alert.Heading>
                  <p className="mb-0">
                    Não é possível carregar a lista de inspeções sem conexão com a internet.
                    Conecte-se à internet e tente novamente.
                  </p>
                </Alert>
              </Col>
            </Row>
          )}

          <Row className="mb-3">
            <Table
              $bordered
              $isLoading={result === null && isOnline}
              $hover={!!result?.data.length}
              $responsive
            >
              <Thead>
                <Tr>
                  <Th>
                    <Heading size="xs">Nº Relatório</Heading>
                  </Th>

                  <Th className="d-none d-md-table-cell">
                    <Heading size="xs">Revisão</Heading>
                  </Th>

                  <Th className="d-none d-sm-table-cell">
                    <Heading size="xs">Cliente</Heading>
                  </Th>

                  <Th>
                    <div className="d-flex justify-content-center">
                      <Heading size="xs">Status</Heading>
                    </div>
                  </Th>

                  <Th className="d-none d-lg-table-cell">
                    <Heading size="xs">Inspetor</Heading>
                  </Th>

                  <Th>
                    <div className="d-flex justify-content-center">
                      <Heading size="xs">Ações</Heading>
                    </div>
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {result ? (
                  result.data.length > 0 ? (
                    result.data.map((item) => (
                      <InspectionsTable
                        key={item.id}
                        data={item}
                        onEdit={() => addNew(item.id)}
                        onGeneratePdf={() => handleGeneratePdf(item.id)}
                        handleOnChangeStatusInspection={() =>
                          handleOnChangeStatusInspection(item.id, !item.isActive)
                        }
                      />
                    ))
                  ) : (
                    <Empty columns={7} />
                  )
                ) : !isOnline ? (
                  <Empty columns={7} />
                ) : (
                  <LoadingLines lines={params ? Number(params.items) : 10} columns={7} />
                )}
              </Tbody>
            </Table>
          </Row>

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
