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
import { InspectionSearchForm } from "./components/InspectionSearchForm/InspectionSearchForm";
import { IInspectionSearchForm, initialInspectionSearchValues } from "./components/InspectionSearchForm/InspectionSearchForm.form";
import { DEFAULT_ITEMS_PER_PAGE } from "@shared/constants/options";
import { TITLE_ADMIN_INSPECTIONS } from "@shared/constants/title.browser";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useInspections } from "@shared/hooks/services/Admin/useInspections";
import { usePartInspectionStatusDropdown } from "@shared/hooks/services/Admin/Dropdown/usePartInspectionStatusDropdown";
import { useToastContext } from "@shared/contexts/Toast";
import { useLoaderContext } from "@shared/contexts/Loader";
import { getAuthorizationToken } from "@shared/services/api/token";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  ROUTE_SAVE_INSPECTION,
  ROUTE_UPDATE_INSPECTION,
} from "@/modules/Admin/Inspections/routes/Inspection.paths";

import { InspectionsTable } from "./components/InspectionsTable";

export function ListInspections() {
  const navigate = useNavigate();

  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { showLoader, hideLoader } = useLoaderContext();

  const [searchParams, setSearchParams] = useSearchParams();

  const { result, params, setParams } = useInspections();
  const { result: inspectionStatusOptions, loading: loadingStatuses } = usePartInspectionStatusDropdown();

  const [loaded, setLoaded] = useState(false);

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
  const statusOptionsWithAll = [
    { value: "", label: "Todos" },
    ...inspectionStatusOptions
  ];


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
          items: DEFAULT_ITEMS_PER_PAGE,
          page: 1,
          order: "reportNumber",
        };
      }

      handleSearchParams(params);
    }
  }, [params, loaded, searchParams, handleSearchParams]);

  function handleOnSearch(data: IInspectionSearchForm) {
    if (params) {
      const { 
        search, 
        searchingBy, 
        inspectionStatusId
      } = data;

      const newParams = {
        ...params,
        page: 1,
        searchingBy,
        search,
        inspectionStatusId,
      };

      handleSearchParams(newParams);
    }
  }

  function handleOnChangeItemsPerPage(items: number) {
    if (params) {
      const newParams = {
        ...params,
        page: 1,
        items,
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
      
      const token = getAuthorizationToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/operational/parts-inspection/${inspectionId}/download-pdf`,
        {
          headers: {
            Authorization: token,
          },
          responseType: 'blob'
        }
      );

      // Criar URL do blob e fazer download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inspecao-${inspectionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addToast({
        type: "success",
        title: "Sucesso!",
        description: "PDF gerado com sucesso!",
      });
    } catch (error) {
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
                onAdd={addNew}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Table
              $bordered
              $isLoading={result === null}
              $hover={!!result?.data.length}
              $responsive
            >
              <Thead>
                <Tr>
                  <Th className="d-none d-lg-table-cell">
                    <Heading size="xs">#</Heading>
                  </Th>

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
                        /* onShowLogs={() => setInspectionLogs(item.id)} */
                      />
                    ))
                  ) : (
                    <Empty columns={7} />
                  )
                ) : (
                  <LoadingLines lines={params ? Number(params.items) : 10} columns={7} />
                )}
              </Tbody>
            </Table>
          </Row>

          <Row className="align-items-center">
            <Col xs={12} md={6} lg={4} className="mb-3 mb-md-0">
              <ItemsPerPage onChange={(items) => handleOnChangeItemsPerPage(Number(items.value))} />
            </Col>

            <Col xs={12} md={6} lg={8} className="d-flex justify-content-center justify-content-md-end">
              {params && result ? (
                <Pagination
                  key={params.page}
                  defaultCurrent={params.page}
                  pageSize={Number(params.items)}
                  total={result.total}
                  onChange={(page) => handleOnChangePage(page)}
                />
              ) : (
                <Skeleton />
              )}
            </Col>
          </Row>
        </Container>
      </Section>
    </AnimatedPage>
  );
}
