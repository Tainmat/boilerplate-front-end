import { Button } from "@shared/components/Core/Buttons/Button";
import { InputText } from "@shared/components/Core/Form/Fields/InputText";
import { Select } from "@shared/components/Core/Form/Fields/Select";
import { InputPhone } from "@shared/components/Core/Form/Fields/InputPhone";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { useAlertContext } from "@shared/contexts/Alert";
import { Field, Form, Formik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { TextArea } from "@/shared/components/Core/Form/Fields/TextArea";
import { cnpjMask, cpfMask, phoneNumberMask, cepMask } from "@/shared/utils/masks";

import { customerValidationSchema, ICustomerRegisterForm } from "./RegisterForm.form";

// Lista de UFs para o select
const UF_OPTIONS: IOption[] = [
  { value: "AC", label: "AC" },
  { value: "AL", label: "AL" },
  { value: "AP", label: "AP" },
  { value: "AM", label: "AM" },
  { value: "BA", label: "BA" },
  { value: "CE", label: "CE" },
  { value: "DF", label: "DF" },
  { value: "ES", label: "ES" },
  { value: "GO", label: "GO" },
  { value: "MA", label: "MA" },
  { value: "MT", label: "MT" },
  { value: "MS", label: "MS" },
  { value: "MG", label: "MG" },
  { value: "PA", label: "PA" },
  { value: "PB", label: "PB" },
  { value: "PR", label: "PR" },
  { value: "PE", label: "PE" },
  { value: "PI", label: "PI" },
  { value: "RJ", label: "RJ" },
  { value: "RN", label: "RN" },
  { value: "RS", label: "RS" },
  { value: "RO", label: "RO" },
  { value: "RR", label: "RR" },
  { value: "SC", label: "SC" },
  { value: "SP", label: "SP" },
  { value: "SE", label: "SE" },
  { value: "TO", label: "TO" },
];

interface Props {
  initialValues: ICustomerRegisterForm | null;
  onSubmit: (data: ICustomerRegisterForm) => void;
}

export function ClientRegisterForm({ initialValues, onSubmit }: Props) {
  const { addAlertOnCancel } = useAlertContext();
  const navigate = useNavigate();

  if (!initialValues) {
    return (
      <>
        <Row className="mb-4">
          <Col />
        </Row>
        <Row className="mb-4">
          <Col xs={5}>
            <Skeleton />
          </Col>
          <Col xs={5}>
            <Skeleton />
          </Col>
          <Col xs={2}>
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
      validationSchema={customerValidationSchema}
      onSubmit={onSubmit}
    >
      {({ touched, errors, dirty, isValid, setFieldValue, setFieldTouched, values }) => (
        <Form>
          {/* LINHA 1 - CNPJ e Nome */}
          <Row className="mb-4">
            <Col xl={4}>
              <Field
                as={InputText}
                label="CNPJ"
                name="numeroDocumentoCliente"
                value={cnpjMask(values.numeroDocumentoCliente)}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                type="text"
                error={touched.numeroDocumentoCliente && !!errors.numeroDocumentoCliente}
                helperText={
                  touched.numeroDocumentoCliente && !!errors.numeroDocumentoCliente
                    ? errors.numeroDocumentoCliente
                    : ""
                }
              />
            </Col>

            <Col xl={8}>
              <Field
                as={InputText}
                label="Razão Social"
                name="nomeRazaoSocialCliente"
                placeholder="Informe a Razão Social"
                maxLength={50}
                type="text"
                error={touched.nomeRazaoSocialCliente && !!errors.nomeRazaoSocialCliente}
                helperText={
                  touched.nomeRazaoSocialCliente && !!errors.nomeRazaoSocialCliente
                    ? errors.nomeRazaoSocialCliente
                    : ""
                }
              />
            </Col>
          </Row>

          {/* LINHA 2 - CEP e Endereço */}
          <Row className="mb-4">
            <Col xl={3}>
              <Field
                as={InputText}
                label="CEP"
                name="numeroCepCliente"
                value={cepMask(values.numeroCepCliente)}
                placeholder="00000-000"
                maxLength={9}
                type="text"
                error={touched.numeroCepCliente && !!errors.numeroCepCliente}
                helperText={
                  touched.numeroCepCliente && !!errors.numeroCepCliente
                    ? errors.numeroCepCliente
                    : ""
                }
              />
            </Col>
            
            <Col xl={6}>
              <Field
                as={InputText}
                label="Logradouro"
                name="dsLogradouroCliente"
                placeholder="Informe o Logradouro"
                maxLength={100}
                type="text"
                error={touched.dsLogradouroCliente && !!errors.dsLogradouroCliente}
                helperText={
                  touched.dsLogradouroCliente && !!errors.dsLogradouroCliente
                    ? errors.dsLogradouroCliente
                    : ""
                }
              />
            </Col>

            <Col xl={3}>
              <Field
                as={InputText}
                label="Número"
                name="numeroLogradouroCliente"
                placeholder="Número"
                maxLength={10}
                type="text"
                error={touched.numeroLogradouroCliente && !!errors.numeroLogradouroCliente}
                helperText={
                  touched.numeroLogradouroCliente && !!errors.numeroLogradouroCliente
                    ? errors.numeroLogradouroCliente
                    : ""
                }
              />
            </Col>
          </Row>
          
          {/* LINHA 3 - Complemento, Bairro, Município e UF */}
          <Row className="mb-4">
            <Col xl={3}>
              <Field
                as={InputText}
                label="Complemento"
                name="dsComplementoCliente"
                placeholder="Informe o Complemento"
                maxLength={100}
                type="text"
                error={touched.dsComplementoCliente && !!errors.dsComplementoCliente}
                helperText={
                  touched.dsComplementoCliente && !!errors.dsComplementoCliente
                    ? errors.dsComplementoCliente
                    : ""
                }
              />
            </Col>
            
            <Col xl={3}>
              <Field
                as={InputText}
                label="Bairro"
                name="dsBairroCliente"
                placeholder="Informe o Bairro"
                maxLength={50}
                type="text"
                error={touched.dsBairroCliente && !!errors.dsBairroCliente}
                helperText={
                  touched.dsBairroCliente && !!errors.dsBairroCliente
                    ? errors.dsBairroCliente
                    : ""
                }
              />
            </Col>
            
            <Col xl={4}>
              <Field
                as={InputText}
                label="Município"
                name="dsMunicipioCliente"
                placeholder="Informe o Município"
                maxLength={50}
                type="text"
                error={touched.dsMunicipioCliente && !!errors.dsMunicipioCliente}
                helperText={
                  touched.dsMunicipioCliente && !!errors.dsMunicipioCliente
                    ? errors.dsMunicipioCliente
                    : ""
                }
              />
            </Col>
            
            <Col xl={2}>
              <Field
                as={Select}
                label="UF"
                name="dsUfCliente"
                placeholder="UF"
                options={UF_OPTIONS}
                error={touched.dsUfCliente && !!errors.dsUfCliente}
                helperText={
                  touched.dsUfCliente && !!errors.dsUfCliente
                    ? errors.dsUfCliente
                    : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("dsUfCliente");
                  setFieldValue("dsUfCliente", value);
                }}
              />
            </Col>
          </Row>
          
          {/* LINHA 4 - Email, Telefone e Status */}
          <Row className="mb-4">
            <Col xl={4}>
              <Field
                as={InputText}
                label="E-mail"
                name="dsEmailCliente"
                placeholder="email@dominio.com.br"
                maxLength={100}
                type="text"
                error={touched.dsEmailCliente && !!errors.dsEmailCliente}
                helperText={
                  touched.dsEmailCliente && !!errors.dsEmailCliente
                    ? errors.dsEmailCliente
                    : ""
                }
              />
            </Col>
            
            <Col xl={4}>
              <Field
                as={InputPhone}
                label="Telefone"
                name="numeroTelefoneCliente"
                value={values.numeroTelefoneCliente}
                placeholder="(99) 99999-9999"
                country="BR"
                showValidation={true}
                error={touched.numeroTelefoneCliente && !!errors.numeroTelefoneCliente}
                helperText={
                  touched.numeroTelefoneCliente && !!errors.numeroTelefoneCliente
                    ? errors.numeroTelefoneCliente
                    : ""
                }
              />
            </Col>

            <Col xl={2} className="d-flex justify-content-end">
              <Field
                as={Select}
                label="Status"
                name="inStatusCadastroCliente"
                placeholder="Selecionar"
                options={[
                  { value: "true", label: "Ativo" },
                  { value: "false", label: "Inativo" },
                ]}
                error={touched.inStatusCadastroCliente && !!errors.inStatusCadastroCliente}
                helperText={
                  touched.inStatusCadastroCliente && !!errors.inStatusCadastroCliente
                    ? errors.inStatusCadastroCliente
                    : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("inStatusCadastroCliente");
                  setFieldValue("inStatusCadastroCliente", value);
                }}
              />
            </Col>
          </Row>

          {/* LINHA 5 - Observações */}
          <Row className="mb-4">
            <Col xl={12}>
              <Field
                as={TextArea}
                label="Observações"
                name="descricaoObservacoesCliente"
                placeholder="Informe Observações"
                maxlength={1024}
                type="text"
                error={touched.descricaoObservacoesCliente && !!errors.descricaoObservacoesCliente}
                helperText={
                  touched.descricaoObservacoesCliente && !!errors.descricaoObservacoesCliente
                    ? errors.descricaoObservacoesCliente
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
