import { UsersTable } from "@modules/Admin/Users/pages/ListUsers/components/UsersTable";
import { ROUTE_SAVE_USER, ROUTE_UPDATE_USER } from "@modules/Admin/Users/routes/Users.paths";
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
import { TITLE_ADMIN_USERS } from "@shared/constants/title.browser";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useUsers } from "@shared/hooks/services/Admin/useUsers";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";

export function ListUsers() {
  const navigate = useNavigate();
  const { isSmartphone } = useDeviceDetection();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const { result, params, setParams } = useUsers();
  const [loaded, setLoaded] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { isRegister } = useAuthRoles();

  const SEARCH_OPTIONS: IOption[] = [
    {
      value: "socialName",
      label: "Nome do Usuário",
    },
    {
      value: "email",
      label: "E-mail",
    },
  ];

  useEffect(() => {
    document.title = TITLE_ADMIN_USERS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Admin" },
      { text: "Cadastros" },
      { text: "Usuários" },
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
          records: DEFAULT_ITEMS_PER_PAGE,
          page: 1,
          order: "socialName",
          /* sort: "nomeUsuario", */
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
    navigate(!uuid ? ROUTE_SAVE_USER : `${ROUTE_UPDATE_USER}/${uuid}`);
  }

  function toggleRowExpand(uuid: string) {
    setExpandedRow(expandedRow === uuid ? null : uuid);
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
                        searchingBy: params.searchingBy,
                        search: params.search,
                      }
                    : null
                }
                onSubmit={(search) => handleOnSearch(search)}
                onAdd={isRegister() ? addNew : undefined}
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
                  {/* <Th>
                    <Heading size="xs">#</Heading>
                  </Th> */}

                  <Th>
                    <Heading size="xs">Nome</Heading>
                  </Th>

                  <Th hideOnMobile={true}>
                    <Heading size="xs">Nome Social</Heading>
                  </Th>

                  <Th hideOnMobile={isSmartphone}>
                    <Heading size="xs">E-mail</Heading>
                  </Th>

                  <Th hideOnMobile={true}>
                    <Heading size="xs">Perfil</Heading>
                  </Th>

                  <Th>
                    <div className="d-flex justify-content-center">
                      <Heading size="xs">Status</Heading>
                    </div>
                  </Th>

                  {isRegister() && (
                    <Th>
                      <div className="d-flex justify-content-center">
                        <Heading size="xs">Ações</Heading>
                      </div>
                    </Th>
                  )}
                </Tr>
              </Thead>

              <Tbody>
                {result ? (
                  result.data.length > 0 ? (
                    result.data.map((item) => (
                      <UsersTable
                        key={item.id}
                        data={item}
                        onEdit={() => addNew(item.id)}
                        expanded={expandedRow === item.id}
                        onToggleExpand={() => toggleRowExpand(item.id)}
                        isSmartphone={isSmartphone}
                        isRegister={isRegister()}
                      />
                    ))
                  ) : (
                    <Empty columns={7} />
                  )
                ) : (
                  <LoadingLines lines={params ? Number(params.records) : 10} columns={7} />
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
      </Section>
    </AnimatedPage>
  );
}
