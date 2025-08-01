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
import { SearchForm } from "@shared/components/Rules/SearchForm";
import {
  initialValuesSchema,
  IParamsSearchForm,
} from "@shared/components/Rules/SearchForm/SearchForm.form";
import { DEFAULT_ITEMS_PER_PAGE } from "@shared/constants/options";
import { TITLE_ADMIN_INSPECTIONS } from "@shared/constants/title.browser";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useInspections } from "@shared/hooks/services/Admin/useInspections";
import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  ROUTE_LIST_INSPECTIONS,
  ROUTE_SAVE_INSPECTION,
  ROUTE_UPDATE_INSPECTION,
} from "@/modules/Admin/Inspections/routes/Inspection.paths";

import { InspectionsTable } from "./components/InspectionsTable";

export function ListInspections() {
  const navigate = useNavigate();

  const { setPageBreadcrumb } = useBreadcrumbContext();

  const [searchParams, setSearchParams] = useSearchParams();

  const { result, params, setParams } = useInspections();

  const [loaded, setLoaded] = useState(false);

  const SEARCH_OPTIONS: IOption[] = [
    {
      value: "reportNumber",
      label: "Número do Relatório",
    },
    {
      value: "customer",
      label: "Cliente",
    },
    {
      value: "partType",
      label: "Tipo de Peça",
    },
    {
      value: "inspectorUser",
      label: "Inspetor",
    },
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
          ...initialValuesSchema,
          items: DEFAULT_ITEMS_PER_PAGE,
          page: 1,
          order: "reportNumber",
        };
      }

      handleSearchParams(params);
    }
  }, [params, loaded, searchParams, handleSearchParams]);

  function handleOnSearch(data: IParamsSearchForm) {
    if (params) {
      const { search, searchingBy, status } = data;

      const newParams = {
        ...params,
        page: 1,
        searchingBy,
        search,
        status,
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

  return (
    <AnimatedPage>
      <Section>
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <SearchForm
                options={SEARCH_OPTIONS}
                defaultValues={
                  params
                    ? {
                        status: params.status,
                        searchingBy: params.searchIn,
                        search: params.value,
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
