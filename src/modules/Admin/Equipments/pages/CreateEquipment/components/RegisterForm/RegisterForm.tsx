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
import { InputNumber } from "@/shared/components/Core/Form/Fields/InputNumber";

import { 
  equipmentValidationSchema, 
  IEquipmentRegisterForm 
} from "./RegisterForm.form";

interface Props {
  initialValues: IEquipmentRegisterForm | null;
  onSubmit: (data: IEquipmentRegisterForm) => void;
  customersOptions: IOption[];
  tiposPecaOptions: IOption[];
}

export function EquipmentRegisterForm({ 
  initialValues, 
  onSubmit, 
  customersOptions, 
  tiposPecaOptions 
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
      validationSchema={equipmentValidationSchema}
      onSubmit={onSubmit}
    >
      {({ touched, errors, dirty, isValid, setFieldValue, setFieldTouched, values }) => (
        <Form>
          <Row className="mb-4">
            <Col xl={4}>
              <Field
                as={Select}
                label="Tipo de Peça"
                name="uuidTipoPeca"
                placeholder="Selecione o tipo"
                options={tiposPecaOptions}
                error={touched.uuidTipoPeca && !!errors.uuidTipoPeca}
                helperText={
                  touched.uuidTipoPeca && !!errors.uuidTipoPeca
                    ? errors.uuidTipoPeca
                    : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("uuidTipoPeca");
                  setFieldValue("uuidTipoPeca", value);
                }}
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputText}
                label="Nome do Equipamento"
                name="nomeEquipamento"
                placeholder="Informe o nome do equipamento"
                maxLength={100}
                type="text"
                error={touched.nomeEquipamento && !!errors.nomeEquipamento}
                helperText={
                  touched.nomeEquipamento && !!errors.nomeEquipamento
                    ? errors.nomeEquipamento
                    : ""
                }
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputNumber}
                label="Pontos de Inspeção"
                name="ttPontoInspecao"
                placeholder="0"
                decimalScale={0}
                error={touched.ttPontoInspecao && !!errors.ttPontoInspecao}
                helperText={
                  touched.ttPontoInspecao && !!errors.ttPontoInspecao
                    ? errors.ttPontoInspecao
                    : ""
                }
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xl={10}>
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
                }}
              />
            </Col>

            <Col xl={2} className="d-flex justify-content-end">
              <Field
                as={Select}
                label="Status"
                name="inStatusCadastroEquipamento"
                placeholder="Selecionar"
                options={[
                  { value: "true", label: "Ativo" },
                  { value: "false", label: "Inativo" },
                ]}
                error={touched.inStatusCadastroEquipamento && !!errors.inStatusCadastroEquipamento}
                helperText={
                  touched.inStatusCadastroEquipamento && !!errors.inStatusCadastroEquipamento
                    ? errors.inStatusCadastroEquipamento
                    : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("inStatusCadastroEquipamento");
                  setFieldValue("inStatusCadastroEquipamento", value);
                }}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xl={12}>
              <Field
                as={TextArea}
                label="Observação"
                name="dsObservacao"
                placeholder="Informe observações sobre a peça"
                maxlength={1024}
                type="text"
                error={touched.dsObservacao && !!errors.dsObservacao}
                helperText={
                  touched.dsObservacao && !!errors.dsObservacao
                    ? errors.dsObservacao
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