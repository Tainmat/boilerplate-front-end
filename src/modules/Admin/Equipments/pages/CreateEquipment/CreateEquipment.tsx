import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { Section } from "@shared/components/Core/Containers/Section";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { TITLE_ADMIN_EQUIPMENTS } from "@shared/constants/title.browser";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useLoaderContext } from "@shared/contexts/Loader";
import { useToastContext } from "@shared/contexts/Toast";
import { get, post, put } from "@shared/services/api/api.service";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

/* import { customers } from "@shared/hooks/services/Admin/useCustomers"; */
import { ROUTE_LIST_EQUIPMENTS } from "@/modules/Admin/Equipments/routes/Equipment.paths";

import { EquipmentRegisterForm } from "./components/RegisterForm";
import { IEquipmentRegisterForm } from "./components/RegisterForm/RegisterForm.form";

// Dados fictícios para tipos de peça
/* const tiposDePeca = [
  { id: 1, uuidTipoPeca: "tp-a1b2c3d4", nmTipoPeca: "Moenda", dsObse: "Moendas de cana" },
  { id: 2, uuidTipoPeca: "tp-b2c3d4e5", nmTipoPeca: "Caldeira", dsObse: "Caldeiras de vapor" },
  { id: 3, uuidTipoPeca: "tp-c3d4e5f6", nmTipoPeca: "Turbina", dsObse: "Turbinas geradoras" },
  {
    id: 4,
    uuidTipoPeca: "tp-d4e5f6a7",
    nmTipoPeca: "Centrífuga",
    dsObse: "Centrífugas de separação",
  },
  { id: 5, uuidTipoPeca: "tp-e5f6a7b8", nmTipoPeca: "Evaporador", dsObse: "Evaporadores de caldo" },
]; */

export function CreateEquipment() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { uuid } = useParams();

  // Opções para o select de tipos de peça
  /*   const tiposPecaOptions: IOption[] = tiposDePeca.map((tipo) => ({
    value: tipo.uuidTipoPeca,
    label: tipo.nmTipoPeca,
  })); */

  /*   const fakeGetEquipment = (uuid: string) => {
    return fakeRequest(500, { uuid }).then(() => {
      const equipment = equipments.find((e) => e.uuidEquipamento === uuid);

      if (!equipment) {
        return { data: null };
      }

      return { data: equipment };
    });
  }; */

  /*   const fakePostEquipment = async (payload: Partial<IEquipment>) => {
    const newEquipment = {
      ...payload,
      idTipoPeca: tiposDePeca.find(t => t.uuidTipoPeca === payload.uuidTipoPeca)?.id || 0,
      nmTipoPeca: tiposDePeca.find(t => t.uuidTipoPeca === payload.uuidTipoPeca)?.nmTipoPeca || "",
      idEquipamento: equipments.length + 1,
      uuidEquipamento: uuidv4(),
      dataCadastroEquipamento: new Date().toISOString(),
      dataUltimaAtualizacao: new Date().toISOString(),
      inStatusCadastroEquipamento: !!payload.inStatusCadastroEquipamento,
      dsStatusCadastroEquipamento: payload.inStatusCadastroEquipamento ? "Ativo" : "Inativo",
      // Buscar nome do cliente
      nomeCliente: customers.find(c => c.uuidCliente === payload.uuidCliente)?.nomeRazaoSocialCliente || "",
    };

    equipments.push(newEquipment as IEquipment);

    return fakeRequest(1000, {
      data: newEquipment,
      message: "Equipamento cadastrado com sucesso!",
    });
  }; */

  /*  const fakePutEquipment = async (uuid: string, payload: Partial<IEquipment>) => {
    const index = equipments.findIndex((e) => e.uuidEquipamento === uuid);

    if (index === -1) {
      throw new Error("Equipamento não encontrado");
    }

    const updatedEquipment: IEquipment = {
      ...equipments[index],
      ...payload,
      idTipoPeca: tiposDePeca.find(t => t.uuidTipoPeca === payload.uuidTipoPeca)?.id || equipments[index].idTipoPeca,
      nmTipoPeca: tiposDePeca.find(t => t.uuidTipoPeca === payload.uuidTipoPeca)?.nmTipoPeca || equipments[index].nmTipoPeca,
      dataUltimaAtualizacao: new Date().toISOString(),
      dsStatusCadastroEquipamento: payload.inStatusCadastroEquipamento ? "Ativo" : "Inativo",
      nomeCliente: customers.find(c => c.uuidCliente === payload.uuidCliente)?.nomeRazaoSocialCliente || equipments[index].nomeCliente,
    };

    equipments[index] = updatedEquipment;

    return fakeRequest(1000, {
      data: updatedEquipment,
      message: "Equipamento atualizado com sucesso!",
    });
  }; */

  const [equipment, setEquipment] = useState<IEquipmentRegisterForm | null>(null);

  // Opções de clientes para o select
  /*   const customersOptions = customers.map((customer) => ({
    value: customer.uuidCliente,
    label: customer.nomeRazaoSocialCliente,
  })); */

  useEffect(() => {
    document.title = TITLE_ADMIN_EQUIPMENTS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Admin" },
      { text: "Cadastros", route: ROUTE_LIST_EQUIPMENTS },
      { text: "Equipamentos" },
    ]);

    if (uuid) {
      get(`${"/parametrizations/part-types"}/${uuid}`)
        .then((data) => {
          if (data.data) {
            const response = data.data.data;
            setEquipment({
              name: response.name,
              description: response.description,
              totalInspectionPoints: response.totalInspectionPoints,
              isActive: response.isActive ? "true" : "false",
              coverUrl: response.croqui || "",
            });
          } else {
            addToast({
              type: "helper",
              title: "Ooops.",
              description: "Equipamento não encontrado.",
            });

            navigate(-1);
          }
        })
        .catch(() => {
          addToast({
            type: "helper",
            title: "Ooops.",
            description: "Erro ao recuperar dados do Equipamento.",
          });

          navigate(-1);
        });
    } else {
      setEquipment({
        name: "",
        description: "",
        totalInspectionPoints: "0",
        isActive: "true",
        coverUrl: "",
      });
    }
  }, [setPageBreadcrumb, uuid, navigate, addToast]);

  async function handleOnSubmit(
    formValues: IEquipmentRegisterForm & {
      __isCroquisChanged?: boolean;
      __isCroquisDeleted?: boolean;
    },
  ) {
    const { __isCroquisChanged, __isCroquisDeleted, ...cleanFormValues } = formValues;

    try {
      showLoader();

      // Construir payload base
      const payload: any = {
        name: cleanFormValues.name,
        description: cleanFormValues.description,
        totalInspectionPoints: Number(cleanFormValues.totalInspectionPoints),
        isActive: cleanFormValues.isActive === "true",
      };

      // Lógica para croqui e deleteCroqui
      if (!uuid) {
        // Novo equipamento: incluir croqui se preenchido
        if (cleanFormValues.coverUrl) {
          payload.croqui = cleanFormValues.coverUrl;
        }
      } else {
        // Edição de equipamento existente
        if (__isCroquisDeleted) {
          // Croqui foi deletado
          payload.deleteCroqui = true;
        } else if (__isCroquisChanged && cleanFormValues.coverUrl) {
          // Croqui foi alterado (nova imagem)
          payload.croqui = cleanFormValues.coverUrl;
        } else {
          // Croqui não foi alterado
        }
      }

      if (uuid) {
        const { data, message } = await put(`${"/parametrizations/part-types"}/${uuid}`, payload);
        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Equipamento atualizado com sucesso!",
          });
        }
      } else {
        const { data, message } = await post("/parametrizations/part-types", payload);
        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Equipamento criado com sucesso!",
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

                <Subtitle size="sm">Cadastrar Equipamento</Subtitle>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <EquipmentRegisterForm
                initialValues={equipment && equipment}
                onSubmit={(values) => handleOnSubmit(values)}
              />
            </Col>
          </Row>
        </Container>
      </Section>
    </AnimatedPage>
  );
}
