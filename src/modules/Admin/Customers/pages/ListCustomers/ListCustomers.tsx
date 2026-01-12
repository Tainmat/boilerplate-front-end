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
import { TITLE_PROCCESSES_CLIENTS } from "@shared/constants/title.browser";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useCustomers } from "@shared/hooks/services/Admin/useCustomers";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  ROUTE_LIST_CUSTOMERS,
  ROUTE_SAVE_CUSTOMER,
  ROUTE_UPDATE_CUSTOMER,
} from "@/modules/Admin/Customers/routes/Customer.paths";

import { CustomerContext, useCustomerContext } from "@/shared/contexts/Customer/CustomerContext";
import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";
import { CustomersTable } from "./components/CustomersTable";

export function ListCustomers() {
  const navigate = useNavigate();
  const { isSmartphone, isTablet } = useDeviceDetection();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const { result, params, setParams } = useCustomers();
  const [loaded, setLoaded] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { selectCustomer } = useCustomerContext();
  const { isRegister } = useAuthRoles();

  const SEARCH_OPTIONS: IOption[] = [
    {
      value: "corporateName",
      label: "Razão Social",
    },
    {
      value: "cnpj",
      label: "CNPJ",
    },
    {
      value: "fantasyName",
      label: "Nome Fantasia",
    },
  ];

  useEffect(() => {
    document.title = TITLE_PROCCESSES_CLIENTS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Admin" },
      { text: "Cadastros" },
      { text: "Clientes" },
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
          order: "corporateName",
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

  function addNew(id?: string) {
    navigate(!id ? ROUTE_SAVE_CUSTOMER : `${ROUTE_UPDATE_CUSTOMER}/${id}`);
  }

  function toggleRowExpand(id: string) {
    setExpandedRow(expandedRow === id ? null : id);
  }

  return (
    <CustomerContext>
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
                          status: params.isActive,
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
                    <Th>
                      <Heading size="xs">CNPJ</Heading>
                    </Th>

                    <Th>
                      <Heading size="xs">Razão Social</Heading>
                    </Th>

                    <Th hideOnMobile={isSmartphone}>
                      <Heading size="xs">Município</Heading>
                    </Th>

                    <Th hideOnMobile={isSmartphone}>
                      <Heading size="xs">Telefone</Heading>
                    </Th>

                    <Th hideOnMobile={isSmartphone}>
                      <Heading size="xs">E-mail</Heading>
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
                        <CustomersTable
                          key={item.id}
                          data={item}
                          onEdit={() => addNew(item.id)}
                          expanded={expandedRow === item.id}
                          onToggleExpand={() => toggleRowExpand(item.id)}
                          isSmartphone={isSmartphone}
                          onOpenContacts={() => {
                            selectCustomer(item);
                            navigate(`${ROUTE_LIST_CUSTOMERS}/${item.id}/contacts`);
                          }}
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
          </Container>
        </Section>
      </AnimatedPage>
    </CustomerContext>
  );
}
