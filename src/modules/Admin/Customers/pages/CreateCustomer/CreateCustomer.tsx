import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { Section } from "@shared/components/Core/Containers/Section";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { TITLE_PROCCESSES_CLIENTS } from "@shared/constants/title.browser";
/* import { URL_PROC_LIST_CLIE, URL_PROC_SAVE_CLIE } from "@shared/constants/urls"; */
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useLoaderContext } from "@shared/contexts/Loader";
import { useToastContext } from "@shared/contexts/Toast";
import { get, post, put } from "@shared/services/api/api.service";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTE_LIST_CUSTOMERS } from "@/modules/Admin/Customers/routes/Customer.paths";

import { ClientRegisterForm } from "./components/RegisterForm";
import { ICustomerRegisterForm } from "./components/RegisterForm/RegisterForm.form";

export function CreateCustomer() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { uuid } = useParams();

  const [customer, setCustomer] = useState<ICustomerRegisterForm | null>(null);

  useEffect(() => {
    document.title = TITLE_PROCCESSES_CLIENTS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Admin" },
      { text: "Cadastros", route: ROUTE_LIST_CUSTOMERS },
      { text: "Clientes" },
    ]);

    if (uuid) {
      get(`${"parametrizations/customers"}/${uuid}`)
        .then((data) => {
          if (data.data) {
            const response = data.data.data;
            setCustomer({
              corporateName: response.corporateName,
              fantasyName: response.fantasyName,
              cnpj: response.cnpj,
              cep: response.cep,
              street: response.street,
              number: response.number,
              complement: response.complement,
              neighborhood: response.neighborhood,
              city: response.city,
              state: response.state,
              email: response.email,
              phone: response.phone,
              isActive: response.isActive ? "true" : "false",
            });
          } else {
            addToast({
              type: "helper",
              title: "Ooops.",
              description: "Cliente não encontrado.",
            });

            navigate(-1);
          }
        })
        .catch(() => {
          addToast({
            type: "helper",
            title: "Ooops.",
            description: "Erro ao recuperar dados do Cliente.",
          });
          navigate(-1);
        });
    } else {
      setCustomer({
        corporateName: "",
        fantasyName: "",
        cnpj: "",
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        email: "",
        phone: "",
        isActive: "false",
      });
    }
  }, [setPageBreadcrumb, uuid, navigate, addToast]);

  async function handleOnSubmit(formValues: ICustomerRegisterForm) {
    const payload = {
      ...formValues,
      isActive: formValues.isActive === "true",
    };

    try {
      showLoader();

      if (uuid) {
        const { data, message } = await put(`${"parametrizations/customers"}/${uuid}`, payload);

        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Cliente atualizado com sucesso!",
          });
        }
      } else {
        const { data, message } = await post("parametrizations/customers", payload);

        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Cliente cadastrado com sucesso!",
          });
        }
      }

      navigate(-1);
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
          <Row>
            <Col lg={9} xxl={12}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <Icon icon="post_add" />

                <Subtitle size="sm">Cadastrar Cliente</Subtitle>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <ClientRegisterForm
                initialValues={customer && customer}
                onSubmit={(values) => handleOnSubmit(values)}
              />
            </Col>
          </Row>
        </Container>
      </Section>
    </AnimatedPage>
  );
}
