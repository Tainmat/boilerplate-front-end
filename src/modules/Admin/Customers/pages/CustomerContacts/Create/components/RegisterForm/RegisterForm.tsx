import { Field, Form, Formik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { phoneNumberMask } from "@/shared/utils/masks";

import { Button } from "@/shared/components/Core/Buttons/Button";
import { Checkbox } from "@/shared/components/Core/Form/Fields/Checkbox";
import { InputText } from "@/shared/components/Core/Form/Fields/InputText";
import { InputPhone } from "@/shared/components/Core/Form/Fields/InputPhone";
import { Select } from "@/shared/components/Core/Form/Fields/Select";
import { IOption } from "@/shared/components/Core/Form/Fields/Select/Select.interface";
import { TextArea } from "@/shared/components/Core/Form/Fields/TextArea";
import { Skeleton } from "@/shared/components/Core/Skeleton";
import { useAlertContext } from "@/shared/contexts/Alert";

import { customerContactValidationSchema, ICustomerContatcRegisterForm } from "./RegisterForm.form";

interface Props {
  initialValues: ICustomerContatcRegisterForm | null;
  onSubmit: (data: ICustomerContatcRegisterForm) => void;
}

export function CustomerContactRegisterForm({ initialValues, onSubmit }: Props) {
  const { addAlertOnCancel } = useAlertContext();
  const navigate = useNavigate();

  if (!initialValues) {
    return (
      <>
        <Row className="mb-4">
          <Col xl={12}>
            <Skeleton />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xs={4}>
            <Skeleton />
          </Col>
          <Col xs={2}>
            <Skeleton />
          </Col>
          <Col xs={4}>
            <Skeleton />
          </Col>
          <Col xs={2}>
            <Skeleton />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col xl={12}>
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
      validationSchema={customerContactValidationSchema}
      onSubmit={onSubmit}
    >
      {({ touched, errors, dirty, isValid, setFieldValue, setFieldTouched, values }) => (
        <Form>
          {/* LINHA 1 */}
          <Row className="mb-4">
            <Col className="d-flex flex-row gap-3">
              <Field
                as={Checkbox}
                name="inResponsavelLegal"
                description="Responsável Legal"
                checked={values.inResponsavelLegal === "true"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { checked } = e.target;
                  setFieldValue("inResponsavelLegal", checked ? "true" : "false");
                }}
              />

              <Field
                as={Checkbox}
                name="inResponsavelTecnico"
                description="Responsável Técnico"
                checked={values.inResponsavelTecnico === "true"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { checked } = e.target;
                  setFieldValue("inResponsavelTecnico", checked ? "true" : "false");
                }}
              />

              <Field
                as={Checkbox}
                name="inRecebeEmail"
                description="Recebe E-mail"
                checked={values.inRecebeEmail === "true"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { checked } = e.target;
                  setFieldValue("inRecebeEmail", checked ? "true" : "false");
                }}
              />
              
              <Field
                as={Checkbox}
                name="inWhatsAppContatoCliente"
                description="WhatsApp"
                checked={values.inWhatsAppContatoCliente === "true"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { checked } = e.target;
                  setFieldValue("inWhatsAppContatoCliente", checked ? "true" : "false");
                }}
              />
            </Col>
          </Row>

          {/* LINHA 2 */}
          <Row className="mb-4">
            <Col xl={4}>
              <Field
                as={InputText}
                label="Nome"
                name="nomeContatoCliente"
                placeholder="Nome do Contato do Cliente"
                maxLength={128}
                type="text"
                error={touched.nomeContatoCliente && !!errors.nomeContatoCliente}
                helperText={
                  touched.nomeContatoCliente && !!errors.nomeContatoCliente
                    ? errors.nomeContatoCliente
                    : ""
                }
              />
            </Col>

            <Col xl={2}>
              <Field
                as={InputPhone}
                label="Telefone"
                name="numeroTelefoneContatoCliente"
                placeholder="(99) 9999-9999"
                type="text"
                error={
                  touched.numeroTelefoneContatoCliente && !!errors.numeroTelefoneContatoCliente
                }
                helperText={
                  touched.numeroTelefoneContatoCliente && !!errors.numeroTelefoneContatoCliente
                    ? errors.numeroTelefoneContatoCliente
                    : ""
                }
              />
            </Col>
            
            <Col xl={2}>
              <Field
                as={InputText}
                label="Ramal"
                name="numeroRamalContatoCliente"
                placeholder="Ramal"
                maxLength={10}
                type="text"
                error={touched.numeroRamalContatoCliente && !!errors.numeroRamalContatoCliente}
                helperText={
                  touched.numeroRamalContatoCliente && !!errors.numeroRamalContatoCliente
                    ? errors.numeroRamalContatoCliente
                    : ""
                }
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputPhone}
                label="E-mail"
                name="dsEmailContatoCliente"
                placeholder="nome@dominio.com"
                maxLength={128}
                type="email"
                error={touched.dsEmailContatoCliente && !!errors.dsEmailContatoCliente}
                helperText={
                  touched.dsEmailContatoCliente && !!errors.dsEmailContatoCliente
                    ? errors.dsEmailContatoCliente
                    : ""
                }
              />
            </Col>

            <Col xl={2} className="d-flex justify-content-end">
              <Field
                as={Select}
                label="Status"
                name="inStatusCadastroContatoCliente"
                placeholder="Selecionar"
                options={[
                  { value: "true", label: "Ativo" },
                  { value: "false", label: "Inativo" },
                ]}
                error={
                  touched.inStatusCadastroContatoCliente && !!errors.inStatusCadastroContatoCliente
                }
                helperText={
                  touched.inStatusCadastroContatoCliente && !!errors.inStatusCadastroContatoCliente
                    ? errors.inStatusCadastroContatoCliente
                    : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("inStatusCadastroContatoCliente");
                  setFieldValue("inStatusCadastroContatoCliente", value);
                }}
              />
            </Col>
          </Row>

          {/* LINHA 3 - Celular */}
          <Row className="mb-4">
            <Col xl={4}>
              <Field
                as={InputPhone}
                label="Celular"
                name="numeroCelularContatoCliente"
                placeholder="(99) 99999-9999"
                country="BR"
                showValidation={true}
                error={touched.numeroCelularContatoCliente && !!errors.numeroCelularContatoCliente}
                helperText={
                  touched.numeroCelularContatoCliente && !!errors.numeroCelularContatoCliente
                    ? errors.numeroCelularContatoCliente
                    : ""
                }
              />
            </Col>
          </Row>

          {/* LINHA 3 */}
          <Row className="mb-4">
            <Col xl={12}>
              <Field
                as={TextArea}
                label="Observações"
                name="descricaoObservacoesContatoCliente"
                placeholder="Informe Observações"
                maxlength={1024}
                type="text"
                error={
                  touched.descricaoObservacoesContatoCliente &&
                  !!errors.descricaoObservacoesContatoCliente
                }
                helperText={
                  touched.descricaoObservacoesContatoCliente &&
                  !!errors.descricaoObservacoesContatoCliente
                    ? errors.descricaoObservacoesContatoCliente
                    : ""
                }
              />
            </Col>
          </Row>

          {/* LINHA DOS BOTÕES */}
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
