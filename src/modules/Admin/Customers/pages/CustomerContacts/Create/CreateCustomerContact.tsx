import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTE_HOME } from "@/modules/Home/routes/Home.paths";
import { Section } from "@/shared/components/Core/Containers/Section";
import { Icon } from "@/shared/components/Core/Icons/Icon";
import { Subtitle } from "@/shared/components/Core/Typography/Subtitle";
import { AnimatedPage } from "@/shared/components/Layout/AnimatedPage";
import { TITLE_PROCCESSES_CUSTOMER_CONTACTS } from "@/shared/constants/title.browser";
/* import { URL_PROC_LIST_CONT_CLIE, URL_PROC_SAVE_CONT_CLIE } from "@/shared/constants/urls"; */
import { useBreadcrumbContext } from "@/shared/contexts/Layout/Breadcrumb";
import { useLoaderContext } from "@/shared/contexts/Loader";
import { useToastContext } from "@/shared/contexts/Toast";
import { ICustomerContacts } from "@/shared/hooks/services/Admin/useCustomerContacts";
import { /* getOne, */ fakeRequest, post, put } from "@/shared/services/api/api.service";

import { customerContacts } from "@/shared/hooks/services/Admin/useCustomerContacts";

import { ROUTE_LIST_CUSTOMERS } from "../../../routes/Customer.paths";
import { CustomerContactRegisterForm } from "./components/RegisterForm";
import { ICustomerContatcRegisterForm } from "./components/RegisterForm/RegisterForm.form";
import { v4 as uuidv4 } from "uuid";

export function CreateCustomerContact() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { uuid: uuidCliente, uuidContato } = useParams();

  const [customerContact, setCustomerContact] = useState<ICustomerContatcRegisterForm | null>(null);

  const fakeGetCustomersContacts = (uuid: string) => {
    return fakeRequest(500, { uuid }).then(() => {
      const user = customerContacts.find((u) => u.uuidContatoCliente === uuid);

      if (!user) {
        return { data: null };
      }

      return { data: user };
    });
  };

  const fakePostCustomerContacts = async (payload: Partial<ICustomerContacts>) => {
    const newContact: ICustomerContacts = {
      ...payload,
      idContatoCliente: customerContacts.length + 1,
      uuidContatoCliente: uuidv4(),
      dataCadastroContatoCliente: new Date().toISOString(),
      inStatusCadastroContatoCliente: !!payload.inStatusCadastroContatoCliente,
      dsStatusCadastroContatoCliente: payload.inStatusCadastroContatoCliente ? "Ativo" : "Inativo",
      inRecebeEmail: !!payload.inRecebeEmail,
      dsRecebeEmail: payload.inRecebeEmail ? "Sim" : "Não",
      inResponsavelLegal: !!payload.inResponsavelLegal,
      dsResponsavelLegal: payload.inResponsavelLegal ? "Sim" : "Não",
      inResponsavelTecnico: !!payload.inResponsavelTecnico,
      dsResponsavelTecnico: payload.inResponsavelTecnico ? "Sim" : "Não",
      inWhatsAppContatoCliente: !!payload.inWhatsAppContatoCliente,
      dsWhatsAppContatoCliente: payload.inWhatsAppContatoCliente ? "Sim" : "Não",
      // Fallbacks para evitar undefined
      idCliente: payload.idCliente!,
      uuidCliente: payload.uuidCliente!,
      nomeCliente: payload.nomeCliente || "",
      dsEmailContatoCliente: payload.dsEmailContatoCliente || "",
      nomeContatoCliente: payload.nomeContatoCliente || "",
      numeroTelefoneContatoCliente: payload.numeroTelefoneContatoCliente || "",
      numeroRamalContatoCliente: payload.numeroRamalContatoCliente || "",
      numeroCelularContatoCliente: payload.numeroCelularContatoCliente || "",
      descricaoObservacoesContatoCliente: payload.descricaoObservacoesContatoCliente || "",
    };

    customerContacts.push(newContact);

    return fakeRequest(1000, {
      data: newContact,
      message: "Contato cadastrado com sucesso!",
    });
  };

  const fakePutCustomerContacts = async (uuid: string, payload: Partial<ICustomerContacts>) => {
    const index = customerContacts.findIndex((c) => c.uuidContatoCliente === uuid);

    if (index === -1) {
      throw new Error("Contato não encontrado");
    }

    const updatedContact: ICustomerContacts = {
      ...customerContacts[index],
      ...payload,
      dsStatusCadastroContatoCliente: payload.inStatusCadastroContatoCliente ? "Ativo" : "Inativo",
      dsRecebeEmail: payload.inRecebeEmail ? "Sim" : "Não",
      dsResponsavelLegal: payload.inResponsavelLegal ? "Sim" : "Não",
      dsResponsavelTecnico: payload.inResponsavelTecnico ? "Sim" : "Não",
    };

    customerContacts[index] = updatedContact;

    return fakeRequest(1000, {
      data: updatedContact,
      message: "Contato atualizado com sucesso!",
    });
  };

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
      fakeGetCustomersContacts(uuidContato)
        .then((data) => {
          /* const customerContacts = data.data?.find((c) => c.uuidContatoCliente === uuidContato); */

          if (data.data) {
            setCustomerContact({
              nomeContatoCliente: data.data.nomeContatoCliente,
              dsEmailContatoCliente: data.data.dsEmailContatoCliente,
              numeroTelefoneContatoCliente: data.data.numeroTelefoneContatoCliente,
              numeroRamalContatoCliente: data.data.numeroRamalContatoCliente || "",
              numeroCelularContatoCliente: data.data.numeroCelularContatoCliente || "",
              descricaoObservacoesContatoCliente: data.data.descricaoObservacoesContatoCliente,
              inStatusCadastroContatoCliente: data.data.inStatusCadastroContatoCliente
                ? "true"
                : "false",
              inRecebeEmail: data.data.inRecebeEmail ? "true" : "false",
              inResponsavelLegal: data.data.inResponsavelLegal ? "true" : "false",
              inResponsavelTecnico: data.data.inResponsavelTecnico ? "true" : "false",
              inWhatsAppContatoCliente: data.data.inWhatsAppContatoCliente ? "true" : "false",
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

      /* getOne<ICustomerContacts>(`${URL_PROC_LIST_CONT_CLIE}/${uuidContato}`)
        .then((data) => {
          if (data.data) {
            setCustomerContact({
              nomeContatoCliente: data.data.nomeContatoCliente,
              numeroTelefoneContatoCliente: data.data.numeroTelefoneContatoCliente || "",
              nomeEmailContatoCliente: data.data.nomeEmailContatoCliente,
              inResponsavelLegal: data.data.inResponsavelLegal ? "true" : "false",
              inResponsavelTecnico: data.data.inResponsavelTecnico ? "true" : "false",
              inRecebeEmail: data.data.inRecebeEmail ? "true" : "false",
              inStatusCadastroContatoCliente: data.data.inStatusCadastroContatoCliente
                ? "true"
                : "false",
              descricaoObservacoesContatoCliente:
                data.data.descricaoObservacoesContatoCliente || "",
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
        }); */
    } else {
      setCustomerContact({
        nomeContatoCliente: "",
        numeroTelefoneContatoCliente: "",
        numeroRamalContatoCliente: "",
        numeroCelularContatoCliente: "",
        dsEmailContatoCliente: "",
        inResponsavelLegal: "false",
        inResponsavelTecnico: "false",
        inRecebeEmail: "false",
        inWhatsAppContatoCliente: "false",
        inStatusCadastroContatoCliente: "true",
        descricaoObservacoesContatoCliente: "",
      });
    }
  }, [setPageBreadcrumb, navigate, uuidCliente, addToast, uuidContato, showLoader, hideLoader]);

  async function handleOnSubmit(formValues: ICustomerContatcRegisterForm) {
    const payload = {
      ...formValues,
      inResponsavelLegal: formValues.inResponsavelLegal === "true",
      inResponsavelTecnico: formValues.inResponsavelTecnico === "true",
      inRecebeEmail: formValues.inRecebeEmail === "true",
      inWhatsAppContatoCliente: formValues.inWhatsAppContatoCliente === "true",
      inStatusCadastroContatoCliente: formValues.inStatusCadastroContatoCliente === "true",
      uuidCliente: uuidCliente,
    };

    try {
      showLoader();
      let response;
      if (uuidContato) {
        response = await fakePutCustomerContacts(uuidContato, payload);

        if (response.data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: response.message,
          });
        }
        /* const { data, message } = await put<ICustomerContacts>(
          `${URL_PROC_SAVE_CONT_CLIE}/${uuidContato}`,
          payload,
        );
        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Cliente atualizado com sucesso!",
          });
        } */
      } else {
        response = await fakePostCustomerContacts(payload);

        if (response.data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: response.message,
          });

          /* navigate(-1); */
        }
        /* const { data, message } = await post<ICustomerContacts>(URL_PROC_SAVE_CONT_CLIE, payload);
        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Cliente cadastrado com sucesso!",
          });
        } */
      }

      navigate(-1);
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
