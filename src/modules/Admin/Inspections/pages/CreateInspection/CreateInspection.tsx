import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { Section } from "@shared/components/Core/Containers/Section";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { TITLE_ADMIN_INSPECTIONS } from "@shared/constants/title.browser";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useLoaderContext } from "@shared/contexts/Loader";
import { useToastContext } from "@shared/contexts/Toast";
import { IInspection, inspections } from "@shared/hooks/services/Admin/useInspections";
/* import { customers } from "@shared/hooks/services/Admin/useCustomers";
import { equipments } from "@shared/hooks/services/Admin/useEquipments";
import { usuarios } from "@shared/hooks/services/Admin/useUsers"; */
import { fakeRequest, post, put } from "@shared/services/api/api.service";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { ROUTE_LIST_INSPECTIONS } from "@/modules/Admin/Inspections/routes/Inspection.paths";

import { InspectionRegisterForm } from "./components/RegisterForm";
import { IInspectionRegisterForm } from "./components/RegisterForm/RegisterForm.form";

export function CreateInspection() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { uuid } = useParams();

  const fakeGetInspection = (uuid: string) => {
    return fakeRequest(500, { uuid }).then(() => {
      const inspection = inspections.find((i) => i.uuidInspecao === uuid);

      if (!inspection) {
        return { data: null };
      }

      return { data: inspection };
    });
  };

  const fakePostInspection = async (payload: Partial<IInspection>) => {
    const newInspection = {
      ...payload,
      idInspecao: inspections.length + 1,
      uuidInspecao: uuidv4(),
      dsTipoInspecao: getInspectionTypeDescription(payload.tipoInspecao || ""),
      dsStatusInspecao: getStatusDescription(payload.statusInspecao || "AGENDADA"),
      dsPrioridadeInspecao: getPriorityDescription(payload.prioridadeInspecao || "MEDIA"),
      dataCadastroInspecao: new Date().toISOString(),
      inStatusCadastroInspecao: !!payload.inStatusCadastroInspecao,
      dsStatusCadastroInspecao: payload.inStatusCadastroInspecao ? "Ativo" : "Inativo",
      // Buscar nomes relacionados
      /* nomeCliente: customers.find(c => c.uuidCliente === payload.uuidCliente)?.nomeRazaoSocialCliente || "",
      nomeEquipamento: equipments.find(e => e.uuidEquipamento === payload.uuidEquipamento)?.nomeEquipamento || "",
      nomeInspector: usuarios.find(u => u.uuidUsuario === payload.uuidInspector)?.nomeUsuario || "", */
    };

    inspections.push(newInspection as IInspection);

    return fakeRequest(1000, {
      data: newInspection,
      message: "Inspeção cadastrada com sucesso!",
    });
  };

  const fakePutInspection = async (uuid: string, payload: Partial<IInspection>) => {
    const index = inspections.findIndex((i) => i.uuidInspecao === uuid);

    if (index === -1) {
      throw new Error("Inspeção não encontrada");
    }

    const updatedInspection: IInspection = {
      ...inspections[index],
      ...payload,
      dsTipoInspecao: getInspectionTypeDescription(
        payload.tipoInspecao || inspections[index].tipoInspecao,
      ),
      dsStatusInspecao: getStatusDescription(
        payload.statusInspecao || inspections[index].statusInspecao,
      ),
      dsPrioridadeInspecao: getPriorityDescription(
        payload.prioridadeInspecao || inspections[index].prioridadeInspecao,
      ),
      dsStatusCadastroInspecao: payload.inStatusCadastroInspecao ? "Ativo" : "Inativo",
      /* nomeCliente: customers.find(c => c.uuidCliente === payload.uuidCliente)?.nomeRazaoSocialCliente || inspections[index].nomeCliente,
      nomeEquipamento: equipments.find(e => e.uuidEquipamento === payload.uuidEquipamento)?.nomeEquipamento || inspections[index].nomeEquipamento,
      nomeInspector: usuarios.find(u => u.uuidUsuario === payload.uuidInspector)?.nomeUsuario || inspections[index].nomeInspector, */
    };

    inspections[index] = updatedInspection;

    return fakeRequest(1000, {
      data: updatedInspection,
      message: "Inspeção atualizada com sucesso!",
    });
  };

  function getInspectionTypeDescription(type: string): string {
    const types: Record<string, string> = {
      PREVENTIVA: "Preventiva",
      CORRETIVA: "Corretiva",
      PREDITIVA: "Preditiva",
      EMERGENCIAL: "Emergencial",
      PERIODICA: "Periódica",
      INICIAL: "Inicial",
      FINAL: "Final",
    };
    return types[type] || type;
  }

  function getStatusDescription(status: string): string {
    const statuses: Record<string, string> = {
      AGENDADA: "Agendada",
      EM_ANDAMENTO: "Em Andamento",
      CONCLUIDA: "Concluída",
      CANCELADA: "Cancelada",
    };
    return statuses[status] || status;
  }

  function getPriorityDescription(priority: string): string {
    const priorities: Record<string, string> = {
      BAIXA: "Baixa",
      MEDIA: "Média",
      ALTA: "Alta",
      CRITICA: "Crítica",
    };
    return priorities[priority] || priority;
  }

  const [inspection, setInspection] = useState<IInspectionRegisterForm | null>(null);

  // Opções para os selects
  /* const customersOptions = customers.map(customer => ({
    value: customer.uuidCliente,
    label: customer.nomeRazaoSocialCliente,
  }));

  const equipmentsOptions = equipments.map(equipment => ({
    value: equipment.uuidEquipamento,
    label: equipment.nomeEquipamento,
  }));

  const inspectorsOptions = usuarios.map(user => ({
    value: user.uuidUsuario,
    label: user.nomeUsuario,
  })); */

  useEffect(() => {
    document.title = TITLE_ADMIN_INSPECTIONS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Admin" },
      { text: "Cadastros", route: ROUTE_LIST_INSPECTIONS },
      { text: "Inspeções" },
    ]);

    if (uuid) {
      fakeGetInspection(uuid)
        .then((data) => {
          if (data.data) {
            setInspection({
              tipoInspecao: data.data.tipoInspecao,
              numeroInspecao: data.data.numeroInspecao,
              dataInspecao: data.data.dataInspecao,
              horaInspecao: data.data.horaInspecao,
              uuidCliente: data.data.uuidCliente,
              uuidEquipamento: data.data.uuidEquipamento,
              uuidInspector: data.data.uuidInspector,
              statusInspecao: data.data.statusInspecao,
              prioridadeInspecao: data.data.prioridadeInspecao,
              descricaoObjetivo: data.data.descricaoObjetivo,
              observacoesInspecao: data.data.observacoesInspecao,
              inStatusCadastroInspecao: data.data.inStatusCadastroInspecao ? "true" : "false",
            });
          } else {
            addToast({
              type: "helper",
              title: "Ooops.",
              description: "Inspeção não encontrada.",
            });
            navigate(-1);
          }
        })
        .catch(() => {
          addToast({
            type: "helper",
            title: "Ooops.",
            description: "Erro ao recuperar dados da Inspeção.",
          });
          navigate(-1);
        });
    } else {
      setInspection({
        tipoInspecao: "",
        numeroInspecao: "",
        dataInspecao: "",
        horaInspecao: "",
        uuidCliente: "",
        uuidEquipamento: "",
        uuidInspector: "",
        statusInspecao: "AGENDADA",
        prioridadeInspecao: "MEDIA",
        descricaoObjetivo: "",
        observacoesInspecao: "",
        inStatusCadastroInspecao: "true",
      });
    }
  }, [setPageBreadcrumb, uuid, navigate, addToast]);

  async function handleOnSubmit(formValues: IInspectionRegisterForm) {
    const payload = {
      ...formValues,
      inStatusCadastroInspecao: formValues.inStatusCadastroInspecao === "true",
    };

    try {
      showLoader();
      let response;

      if (uuid) {
        response = await fakePutInspection(uuid, payload);

        if (response.data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: response.message,
          });
        }
      } else {
        response = await fakePostInspection(payload);

        if (response.data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: response.message,
          });
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

                <Subtitle size="sm">Cadastrar Inspeção</Subtitle>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <InspectionRegisterForm
                initialValues={inspection && inspection}
                /* customersOptions={customersOptions}
                equipmentsOptions={equipmentsOptions}
                inspectorsOptions={inspectorsOptions} */
                onSubmit={(values) => handleOnSubmit(values)}
              />
            </Col>
          </Row>
        </Container>
      </Section>
    </AnimatedPage>
  );
}
