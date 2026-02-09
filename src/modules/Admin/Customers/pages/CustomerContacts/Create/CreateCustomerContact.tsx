import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTE_HOME } from "@/modules/Home/routes/Home.paths";
import { Section } from "@/shared/components/Core/Containers/Section";
import { Icon } from "@/shared/components/Core/Icons/Icon";
import { Subtitle } from "@/shared/components/Core/Typography/Subtitle";
import { AnimatedPage } from "@/shared/components/Layout/AnimatedPage";
import { TITLE_PROCCESSES_CUSTOMER_CONTACTS } from "@/shared/constants/title.browser";
import { useBreadcrumbContext } from "@/shared/contexts/Layout/Breadcrumb";
import { useLoaderContext } from "@/shared/contexts/Loader";
import { useToastContext } from "@/shared/contexts/Toast";
import { get, post, put } from "@/shared/services/api/api.service";

import { ROUTE_LIST_CUSTOMERS } from "../../../routes/Customer.paths";
import { CustomerContactRegisterForm } from "./components/RegisterForm";
import { ICustomerContatcRegisterForm } from "./components/RegisterForm/RegisterForm.form";

export function CreateCustomerContact() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { uuid: uuidCliente, uuidContato } = useParams();

  const [customerContact, setCustomerContact] = useState<ICustomerContatcRegisterForm | null>(null);

  useEffect(() => {
    document.title = TITLE_PROCCESSES_CUSTOMER_CONTACTS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Administrativo" },
      { text: "Cadastros", route: `${ROUTE_LIST_CUSTOMERS}/${uuidCliente}/contacts` },
      { text: "Contatos do Cliente" },
    ]);

    if (uuidContato) {
      showLoader();

      get(`${"parametrizations/customers/contacts"}/${uuidContato}`)
        .then((data) => {
          if (data.data) {
            const response = data.data.data;
            setCustomerContact({
              name: response.name,
              email: response.email,
              phone: response.phone,
              extension: response.extension,
              mobile: response.mobile,
              isWhatsApp: response.isWhatsApp ? "true" : "false",
              receiveInspectionEmail: response.receiveInspectionEmail ? "true" : "false",
              isActive: response.isActive ? "true" : "false",
            });
          } else {
            addToast({
              type: "helper",
              title: "Ooops.",
              description: "Contato não encontrado.",
            });

            navigate(-1);
          }
        })
        .catch(() => {
          addToast({
            type: "helper",
            title: "Ooops.",
            description: "Erro ao recuperar dados do Contato.",
          });
          navigate(-1);
        })
        .finally(() => {
          hideLoader();
        });
    } else {
      setCustomerContact({
        name: "",
        email: "",
        phone: "",
        extension: "",
        mobile: "",
        isWhatsApp: "false",
        receiveInspectionEmail: "false",
        isActive: "false",
      });
    }
  }, [setPageBreadcrumb, navigate, uuidCliente, addToast, uuidContato, showLoader, hideLoader]);

  async function handleOnSubmit(formValues: ICustomerContatcRegisterForm) {
    const payload = {
      ...formValues,
      receiveInspectionEmail: formValues.receiveInspectionEmail === "true",
      isWhatsApp: formValues.isWhatsApp === "true",
      isActive: formValues.isActive === "true",
      /* uuidCliente: uuidCliente, */
    };

    try {
      showLoader();

      if (uuidContato) {
        const { data, message } = await put(
          `${"parametrizations/customers/contacts"}/${uuidContato}`,
          payload,
        );

        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Contato atualizado com sucesso!",
          });
        }
      } else {
        const { data, message } = await post(
          `${"parametrizations/customers"}/${uuidCliente}/contacts`,
          payload,
        );

        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Contato cadastrado com sucesso!",
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

                <Subtitle size="sm">Cadastrar Contato do Cliente</Subtitle>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <CustomerContactRegisterForm
                initialValues={customerContact && customerContact}
                onSubmit={(values) => handleOnSubmit(values)}
              />
            </Col>
          </Row>
        </Container>
      </Section>
    </AnimatedPage>
  );
}
