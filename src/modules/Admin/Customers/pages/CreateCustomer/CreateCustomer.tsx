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
import { ICustomer } from "@shared/hooks/services/Admin/useCustomers";
import { /* getOne, */ fakeRequest, post, put } from "@shared/services/api/api.service";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { customers } from "@shared/hooks/services/Admin/useCustomers";

import { ROUTE_LIST_CUSTOMERS } from "@/modules/Admin/Customers/routes/Customer.paths";

import { ClientRegisterForm } from "./components/RegisterForm";
import { ICustomerRegisterForm } from "./components/RegisterForm/RegisterForm.form";
import { v4 as uuidv4 } from "uuid";

export function CreateCustomer() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { uuid } = useParams();

  const fakeGetCustomers = (uuid: string) => {
    return fakeRequest(500, { uuid }).then(() => {
      const user = customers.find((u) => u.uuidCliente === uuid);

      if (!user) {
        return { data: null };
      }

      return { data: user };
    });
  };

  const fakePostCustomer = async (payload: Partial<ICustomer>) => {
    const newCustomer = {
      ...payload,
      idCliente: customers.length + 1,
      uuidCliente: uuidv4(),
      tipoPessoaCliente: "J",
      dsTipoPessoaCliente: "Jurídica",
      numeroDocumentoCliente: payload.numeroDocumentoCliente || "",
      nomeRazaoSocialCliente: payload.nomeRazaoSocialCliente || "",
      numeroCepCliente: payload.numeroCepCliente || "",
      dsLogradouroCliente: payload.dsLogradouroCliente || "",
      numeroLogradouroCliente: payload.numeroLogradouroCliente || "",
      dsComplementoCliente: payload.dsComplementoCliente || "",
      dsBairroCliente: payload.dsBairroCliente || "",
      dsMunicipioCliente: payload.dsMunicipioCliente || "",
      dsUfCliente: payload.dsUfCliente || "",
      numeroTelefoneCliente: payload.numeroTelefoneCliente || "",
      dsEmailCliente: payload.dsEmailCliente || "",
      descricaoObservacoesCliente: payload.descricaoObservacoesCliente || "",
      dataCadastroCliente: new Date().toISOString(),
      inStatusCadastroCliente: !!payload.inStatusCadastroCliente,
      dsStatusCadastroCliente: payload.inStatusCadastroCliente ? "Ativo" : "Inativo",
    };

    customers.push(newCustomer);

    return fakeRequest(1000, {
      data: newCustomer,
      message: "Cliente cadastrado com sucesso!",
    });
  };

  const fakePutCustomer = async (uuid: string, payload: Partial<ICustomer>) => {
    const index = customers.findIndex((c) => c.uuidCliente === uuid);

    if (index === -1) {
      throw new Error("Cliente não encontrado");
    }

    const updatedClient: ICustomer = {
      ...customers[index],
      ...payload,
      dsStatusCadastroCliente: payload.inStatusCadastroCliente ? "Ativo" : "Inativo",
    };

    customers[index] = updatedClient;

    return fakeRequest(1000, {
      data: updatedClient,
      message: "Cliente atualizado com sucesso!",
    });
  };

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
      fakeGetCustomers(uuid)
        .then((data) => {
          if (data.data) {
            setCustomer({
              nomeRazaoSocialCliente: data.data.nomeRazaoSocialCliente,
              numeroCepCliente: data.data.numeroCepCliente,
              dsLogradouroCliente: data.data.dsLogradouroCliente,
              numeroLogradouroCliente: data.data.numeroLogradouroCliente,
              dsComplementoCliente: data.data.dsComplementoCliente,
              dsBairroCliente: data.data.dsBairroCliente,
              dsMunicipioCliente: data.data.dsMunicipioCliente,
              dsUfCliente: data.data.dsUfCliente,
              descricaoObservacoesCliente: data.data.descricaoObservacoesCliente,
              inStatusCadastroCliente: data.data.inStatusCadastroCliente ? "true" : "false",
              dsEmailCliente: data.data.dsEmailCliente,
              numeroDocumentoCliente: data.data.numeroDocumentoCliente,
              numeroTelefoneCliente: data.data.numeroTelefoneCliente,
              tipoPessoaCliente: "J",
            });
          } else {
            addToast({
              type: "helper",
              title: "Ooops.",
              description: "Módulo não encontrado.",
            });
            navigate(-1);
          }
        })
        .catch(() => {
          addToast({
            type: "helper",
            title: "Ooops.",
            description: "Erro ao recuperar dados do Módulo.",
          });
          navigate(-1);
        });

      /*  getOne<IClient>(`${URL_PROC_LIST_CLIE}/${uuid}`)
        .then((data) => {
          if (data.data) {
            setClient({
              nomeRazaoSocialCliente: data.data.nomeRazaoSocialCliente,
              descricaoObservacoesCliente: data.data.descricaoObservacoesCliente,
              inStatusCadastroCliente: data.data.inStatusCadastroCliente ? "true" : "false",
              nomeEmailCliente: data.data.nomeEmailCliente,
              nomeFantasiaCliente: data.data.nomeFantasiaCliente,
              numeroDocumentoCliente: data.data.numeroDocumentoCliente,
              numeroTelefoneCliente: data.data.numeroTelefoneCliente,
              tipoPessoaCliente: "J",
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
        }); */
    } else {
      setCustomer({
        nomeRazaoSocialCliente: "",
        tipoPessoaCliente: "J",
        numeroCepCliente: "",
        dsLogradouroCliente: "",
        numeroLogradouroCliente: "",
        dsComplementoCliente: "",
        dsBairroCliente: "",
        dsMunicipioCliente: "",
        dsUfCliente: "",
        descricaoObservacoesCliente: "",
        inStatusCadastroCliente: "true",
        dsEmailCliente: "",
        numeroDocumentoCliente: "",
        numeroTelefoneCliente: "",
      });
    }
  }, [setPageBreadcrumb, uuid, navigate, addToast]);

  async function handleOnSubmit(formValues: ICustomerRegisterForm) {
    const payload = {
      ...formValues,
      inStatusCadastroCliente: formValues.inStatusCadastroCliente === "true",
    };

    try {
      showLoader();
      let response;

      if (uuid) {
        response = await fakePutCustomer(uuid, payload);

        if (response.data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: response.message,
          });
        }
        /* const { data, message } = await put<ICustomer>(`${URL_PROC_SAVE_CLIE}/${uuid}`, payload);
        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Cliente atualizado com sucesso!",
          });
        }
      } else {
        const { data, message } = await post<ICustomer>(URL_PROC_SAVE_CLIE, payload);
        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Cliente cadastrado com sucesso!",
          });
        } */
      } else {
        response = await fakePostCustomer(payload);

        if (response.data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: response.message,
          });

          /* navigate(-1); */
        }
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
