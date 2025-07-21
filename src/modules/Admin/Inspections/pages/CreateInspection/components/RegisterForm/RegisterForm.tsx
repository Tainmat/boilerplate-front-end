import { Button } from "@shared/components/Core/Buttons/Button";
import { InputText } from "@shared/components/Core/Form/Fields/InputText";
import { Select } from "@shared/components/Core/Form/Fields/Select";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { useAlertContext } from "@shared/contexts/Alert";
import { Field, Form, Formik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { TextArea } from "@/shared/components/Core/Form/Fields/TextArea";

import { inspectionValidationSchema, IInspectionRegisterForm } from "./RegisterForm.form";

interface Props {
  initialValues: IInspectionRegisterForm | null;
  onSubmit: (data: IInspectionRegisterForm) => void;
  /* customersOptions: IOption[];
  equipmentsOptions: IOption[];
  inspectorsOptions: IOption[]; */
}

const INSPECTION_TYPE_OPTIONS: IOption[] = [
  { value: "PREVENTIVA", label: "Preventiva" },
  { value: "CORRETIVA", label: "Corretiva" },
  { value: "PREDITIVA", label: "Preditiva" },
  { value: "EMERGENCIAL", label: "Emergencial" },
  { value: "PERIODICA", label: "Periódica" },
  { value: "INICIAL", label: "Inicial" },
  { value: "FINAL", label: "Final" },
];

const STATUS_OPTIONS: IOption[] = [
  { value: "AGENDADA", label: "Agendada" },
  { value: "EM_ANDAMENTO", label: "Em Andamento" },
  { value: "CONCLUIDA", label: "Concluída" },
  { value: "CANCELADA", label: "Cancelada" },
];

const PRIORITY_OPTIONS: IOption[] = [
  { value: "BAIXA", label: "Baixa" },
  { value: "MEDIA", label: "Média" },
  { value: "ALTA", label: "Alta" },
  { value: "CRITICA", label: "Crítica" },
];

export function InspectionRegisterForm({
  initialValues,
  onSubmit,
  /* customersOptions,
  equipmentsOptions,
  inspectorsOptions  */
}: Props) {
  const { addAlertOnCancel } = useAlertContext();
  const navigate = useNavigate();

  if (!initialValues) {
    return (
      <>
        <Row className="mb-4">
          <Col />
        </Row>
        <Row className="mb-4">
          <Col xs={4}>
            <Skeleton />
          </Col>
          <Col xs={4}>
            <Skeleton />
          </Col>
          <Col xs={4}>
            <Skeleton />
          </Col>
        </Row>
      </>
    );
  }

  function handleOnCancel(hasChanges: boolean) {
    if (!hasChanges) {
      navigate(-1);
    } else {
      addAlertOnCancel(() => {
        navigate(-1);
      });
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={inspectionValidationSchema}
      onSubmit={onSubmit}
    >
      {({ touched, errors, dirty, isValid, setFieldValue, setFieldTouched, values }) => (
        <Form>
          <Row className="mb-4">
            <Col xl={3}>
              <Field
                as={Select}
                label="Tipo de Inspeção"
                name="tipoInspecao"
                placeholder="Selecione o tipo"
                options={INSPECTION_TYPE_OPTIONS}
                error={touched.tipoInspecao && !!errors.tipoInspecao}
                helperText={
                  touched.tipoInspecao && !!errors.tipoInspecao ? errors.tipoInspecao : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("tipoInspecao");
                  setFieldValue("tipoInspecao", value);
                }}
              />
            </Col>

            <Col xl={3}>
              <Field
                as={InputText}
                label="Número da Inspeção"
                name="numeroInspecao"
                placeholder="Informe o número"
                maxLength={50}
                type="text"
                error={touched.numeroInspecao && !!errors.numeroInspecao}
                helperText={
                  touched.numeroInspecao && !!errors.numeroInspecao ? errors.numeroInspecao : ""
                }
              />
            </Col>

            <Col xl={3}>
              <Field
                as={InputText}
                label="Data da Inspeção"
                name="dataInspecao"
                placeholder="dd/mm/aaaa"
                type="date"
                error={touched.dataInspecao && !!errors.dataInspecao}
                helperText={
                  touched.dataInspecao && !!errors.dataInspecao ? errors.dataInspecao : ""
                }
              />
            </Col>

            <Col xl={3}>
              <Field
                as={InputText}
                label="Hora da Inspeção"
                name="horaInspecao"
                placeholder="hh:mm"
                type="time"
                error={touched.horaInspecao && !!errors.horaInspecao}
                helperText={
                  touched.horaInspecao && !!errors.horaInspecao ? errors.horaInspecao : ""
                }
              />
            </Col>
          </Row>

          <Row className="mb-4">
            {/* <Col xl={4}>
              <Field
                as={Select}
                label="Cliente"
                name="uuidCliente"
                placeholder="Selecione o cliente"
                options={customersOptions}
                error={touched.uuidCliente && !!errors.uuidCliente}
                helperText={
                  touched.uuidCliente && !!errors.uuidCliente ? errors.uuidCliente : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("uuidCliente");
                  setFieldValue("uuidCliente", value);
                  // Reset equipment when client changes
                  setFieldValue("uuidEquipamento", "");
                }}
              />
            </Col> */}

            {/* <Col xl={4}>
              <Field
                as={Select}
                label="Equipamento"
                name="uuidEquipamento"
                placeholder="Selecione o equipamento"
                options={equipmentsOptions}
                disabled={!values.uuidCliente}
                error={touched.uuidEquipamento && !!errors.uuidEquipamento}
                helperText={
                  touched.uuidEquipamento && !!errors.uuidEquipamento
                    ? errors.uuidEquipamento
                    : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("uuidEquipamento");
                  setFieldValue("uuidEquipamento", value);
                }}
              />
            </Col> */}

            {/* <Col xl={4}>
              <Field
                as={Select}
                label="Inspetor"
                name="uuidInspector"
                placeholder="Selecione o inspetor"
                options={inspectorsOptions}
                error={touched.uuidInspector && !!errors.uuidInspector}
                helperText={
                  touched.uuidInspector && !!errors.uuidInspector
                    ? errors.uuidInspector
                    : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("uuidInspector");
                  setFieldValue("uuidInspector", value);
                }}
              />
            </Col> */}
          </Row>

          <Row className="mb-4">
            <Col xl={3}>
              <Field
                as={Select}
                label="Status"
                name="statusInspecao"
                placeholder="Selecione o status"
                options={STATUS_OPTIONS}
                error={touched.statusInspecao && !!errors.statusInspecao}
                helperText={
                  touched.statusInspecao && !!errors.statusInspecao ? errors.statusInspecao : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("statusInspecao");
                  setFieldValue("statusInspecao", value);
                }}
              />
            </Col>

            <Col xl={3}>
              <Field
                as={Select}
                label="Prioridade"
                name="prioridadeInspecao"
                placeholder="Selecione a prioridade"
                options={PRIORITY_OPTIONS}
                error={touched.prioridadeInspecao && !!errors.prioridadeInspecao}
                helperText={
                  touched.prioridadeInspecao && !!errors.prioridadeInspecao
                    ? errors.prioridadeInspecao
                    : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("prioridadeInspecao");
                  setFieldValue("prioridadeInspecao", value);
                }}
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputText}
                label="Objetivo da Inspeção"
                name="descricaoObjetivo"
                placeholder="Descreva o objetivo"
                maxLength={500}
                type="text"
                error={touched.descricaoObjetivo && !!errors.descricaoObjetivo}
                helperText={
                  touched.descricaoObjetivo && !!errors.descricaoObjetivo
                    ? errors.descricaoObjetivo
                    : ""
                }
              />
            </Col>

            <Col xl={2} className="d-flex justify-content-end">
              <Field
                as={Select}
                label="Status Cadastro"
                name="inStatusCadastroInspecao"
                placeholder="Selecionar"
                options={[
                  { value: "true", label: "Ativo" },
                  { value: "false", label: "Inativo" },
                ]}
                error={touched.inStatusCadastroInspecao && !!errors.inStatusCadastroInspecao}
                helperText={
                  touched.inStatusCadastroInspecao && !!errors.inStatusCadastroInspecao
                    ? errors.inStatusCadastroInspecao
                    : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("inStatusCadastroInspecao");
                  setFieldValue("inStatusCadastroInspecao", value);
                }}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xl={12}>
              <Field
                as={TextArea}
                label="Observações"
                name="observacoesInspecao"
                placeholder="Informe observações sobre a inspeção"
                maxlength={1024}
                type="text"
                error={touched.observacoesInspecao && !!errors.observacoesInspecao}
                helperText={
                  touched.observacoesInspecao && !!errors.observacoesInspecao
                    ? errors.observacoesInspecao
                    : ""
                }
              />
            </Col>
          </Row>

          <Row className="justify-content-end">
            <Col xs="auto">
              <Row>
                <Col xs="auto">
                  <Button
                    type="button"
                    styles="primary"
                    mode="warning"
                    onClick={() => handleOnCancel(dirty)}
                  >
                    Cancelar
                  </Button>
                </Col>

                <Col xs="auto">
                  <Button
                    type="submit"
                    styles="primary"
                    mode="success"
                    disabled={!dirty || !isValid}
                  >
                    Salvar
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}
