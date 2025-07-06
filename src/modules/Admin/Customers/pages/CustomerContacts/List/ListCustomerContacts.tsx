import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { ROUTE_HOME } from "@/modules/Home/routes/Home.paths";
import { Section } from "@/shared/components/Core/Containers/Section";
import { EmptyResult } from "@/shared/components/Core/EmptyResult";
import { IOption } from "@/shared/components/Core/Form/Fields/Select/Select.interface";
import { Pagination } from "@/shared/components/Core/Pagination";
import { Skeleton } from "@/shared/components/Core/Skeleton";
import { ItemsPerPage } from "@/shared/components/Core/Table/ItemsPerPage";
import { Tag } from "@/shared/components/Core/Tag";
import { Heading } from "@/shared/components/Core/Typography/Heading";
import { AnimatedPage } from "@/shared/components/Layout/AnimatedPage";
import { SearchForm } from "@/shared/components/Rules/SearchForm";
import {
  initialValuesSchema,
  IParamsSearchForm,
} from "@/shared/components/Rules/SearchForm/SearchForm.form";
import { TITLE_PROCCESSES_CUSTOMER_CONTACTS } from "@/shared/constants/title.browser";
import { useBreadcrumbContext } from "@/shared/contexts/Layout/Breadcrumb";
import { useCustomerContacts } from "@/shared/hooks/services/Admin/useCustomerContacts";

import { useCustomerContext } from "../../../../../../shared/contexts/Customer";
import { ROUTE_LIST_CUSTOMERS } from "../../../routes/Customer.paths";
import { ContactCard } from "./components/ContactCard";

export function ListCustomerContacts() {
  const navigate = useNavigate();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const { uuid } = useParams();

  const { result, params, setParams, refetch } = useCustomerContacts();

  const [loaded, setLoaded] = useState(false);

  const { customer } = useCustomerContext();

  const SEARCH_OPTIONS: IOption[] = [
    {
      value: "nomeContatoCliente",
      label: "Nome do Contato",
    },
  ];

  useEffect(() => {
    document.title = TITLE_PROCCESSES_CUSTOMER_CONTACTS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Admin" },
      { text: "Cadastros", route: ROUTE_LIST_CUSTOMERS },
      { text: "Contatos do Cliente" },
    ]);

    setLoaded(true);
  }, [setPageBreadcrumb, setLoaded, uuid]);

  const handleSearchParams = useCallback(
    (params: Record<string, any>) => {
      setSearchParams({
        q: window.btoa(JSON.stringify(params)),
      });

      setParams({
        ...params,
        uuidCustomer: uuid,
      });
    },
    [setSearchParams, setParams, uuid],
  );

  useEffect(() => {
    if (params === null && loaded) {
      let params;

      if (searchParams.get("q")) {
        params = JSON.parse(window.atob(String(searchParams.get("q"))));
      } else {
        params = {
          ...initialValuesSchema,
          items: 12,
          page: 1,
          order: "ASC",
          sort: "nomeContatoCliente",
        };
      }

      handleSearchParams(params);
    }
  }, [params, loaded, searchParams, handleSearchParams]);

  function handleOnSearch(data: IParamsSearchForm) {
    if (params) {
      const { value, searchIn, status } = data;

      const newParams = {
        ...params,
        page: 1,
        searchIn,
        value,
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

  function addNew(uuidContato?: string) {
    navigate(
      !uuidContato
        ? `${ROUTE_LIST_CUSTOMERS}/${uuid}/contacts/new`
        : `${ROUTE_LIST_CUSTOMERS}/${uuid}/contacts/edit/${uuidContato}`,
    );
  }

  return (
    <AnimatedPage>
      <Section>
        <Container fluid>
          <Row className="mb-4">
            <Col className="d-flex align-items-center gap-2">
              <Tag size="sm">{`# ${customer.idCliente}`}</Tag>
              <Heading size="xs">{customer.nomeRazaoSocialCliente}</Heading>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <SearchForm
                options={SEARCH_OPTIONS}
                defaultValues={
                  params
                    ? {
                        status: params.inStatusCadastroClassificacao,
                        searchIn: params.searchIn,
                        value: params.value,
                      }
                    : null
                }
                onSubmit={(search) => handleOnSearch(search)}
                onAdd={() => addNew()}
              />
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              {result ? (
                result.data && result.data.length > 0 ? (
                  <Row>
                    {result.data.map((item) => (
                      <Col key={item.uuidContatoCliente} xxl={4} xl={6}>
                        <ContactCard
                          item={item}
                          onRefetch={() => refetch()}
                          onEdit={() => addNew(item.uuidContatoCliente)}
                        />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <EmptyResult />
                )
              ) : (
                <Row>
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <Col key={idx} xxl={4} xl={6} lg={12}>
                      <ContactCard />
                    </Col>
                  ))}
                </Row>
              )}
            </Col>
          </Row>

          <Row>
            <Col xs={9}>
              {params && result && result.data.length >= 8 && (
                <ItemsPerPage
                  onChange={(items) => handleOnChangeItemsPerPage(Number(items.value))}
                  options={[
                    { value: 12, label: "12" },
                    { value: 24, label: "24" },
                    { value: 48, label: "48" },
                  ]}
                />
              )}
            </Col>

            <Col xs={3} className="d-flex justify-content-end ">
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
