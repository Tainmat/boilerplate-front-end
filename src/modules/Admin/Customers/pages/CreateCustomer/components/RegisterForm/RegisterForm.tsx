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
                name="cnpj"
                value={cnpjMask(values.cnpj)}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                type="text"
                error={touched.cnpj && !!errors.cnpj}
                helperText={touched.cnpj && !!errors.cnpj ? errors.cnpj : ""}
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputText}
                label="Razão Social"
                name="corporateName"
                placeholder="Informe a Razão Social"
                maxLength={50}
                type="text"
                error={touched.corporateName && !!errors.corporateName}
                helperText={
                  touched.corporateName && !!errors.corporateName ? errors.corporateName : ""
                }
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputText}
                label="Nome Fantasia"
                name="fantasyName"
                placeholder="Informe o Nome Fantasia"
                maxLength={50}
                type="text"
                error={touched.fantasyName && !!errors.fantasyName}
                helperText={touched.fantasyName && !!errors.fantasyName ? errors.fantasyName : ""}
              />
            </Col>
          </Row>

          {/* LINHA 2 - CEP e Endereço */}
          <Row className="mb-4">
            <Col xl={3}>
              <Field
                as={InputText}
                label="CEP"
                name="cep"
                value={cepMask(values.cep)}
                placeholder="00000-000"
                maxLength={9}
                type="text"
                error={touched.cep && !!errors.cep}
                helperText={touched.cep && !!errors.cep ? errors.cep : ""}
              />
            </Col>

            <Col xl={6}>
              <Field
                as={InputText}
                label="Logradouro"
                name="street"
                placeholder="Informe o Logradouro"
                maxLength={100}
                type="text"
                error={touched.street && !!errors.street}
                helperText={touched.street && !!errors.street ? errors.street : ""}
              />
            </Col>

            <Col xl={3}>
              <Field
                as={InputText}
                label="Número"
                name="number"
                placeholder="Número"
                maxLength={10}
                type="text"
                error={touched.number && !!errors.number}
                helperText={touched.number && !!errors.number ? errors.number : ""}
              />
            </Col>
          </Row>

          {/* LINHA 3 - Complemento, Bairro, Município e UF */}
          <Row className="mb-4">
            <Col xl={3}>
              <Field
                as={InputText}
                label="Complemento"
                name="complement"
                placeholder="Informe o Complemento"
                maxLength={100}
                type="text"
                error={touched.complement && !!errors.complement}
                helperText={touched.complement && !!errors.complement ? errors.complement : ""}
              />
            </Col>

            <Col xl={3}>
              <Field
                as={InputText}
                label="Bairro"
                name="neighborhood"
                placeholder="Informe o Bairro"
                maxLength={50}
                type="text"
                error={touched.neighborhood && !!errors.neighborhood}
                helperText={
                  touched.neighborhood && !!errors.neighborhood ? errors.neighborhood : ""
                }
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputText}
                label="Município"
                name="city"
                placeholder="Informe o Município"
                maxLength={50}
                type="text"
                error={touched.city && !!errors.city}
                helperText={touched.city && !!errors.city ? errors.city : ""}
              />
            </Col>

            <Col xl={2}>
              <Field
                as={Select}
                label="UF"
                name="state"
                placeholder="UF"
                options={UF_OPTIONS}
                error={touched.state && !!errors.state}
                helperText={touched.state && !!errors.state ? errors.state : ""}
                onChange={({ value }: IOption) => {
                  setFieldTouched("state");
                  setFieldValue("state", value);
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
                name="email"
                placeholder="email@dominio.com.br"
                maxLength={100}
                type="text"
                error={touched.email && !!errors.email}
                helperText={touched.email && !!errors.email ? errors.email : ""}
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputPhone}
                label="Telefone"
                name="phone"
                value={phoneNumberMask(values.phone).formatted}
                placeholder="(99) 99999-9999"
                country="BR"
                showValidation={true}
                error={touched.phone && !!errors.phone}
                helperText={touched.phone && !!errors.phone ? errors.phone : ""}
              />
            </Col>

            <Col xl={2} className="d-flex justify-content-end">
              <Field
                as={Select}
                label="Status"
                name="isActive"
                placeholder="Selecionar"
                options={[
                  { value: "true", label: "Ativo" },
                  { value: "false", label: "Inativo" },
                ]}
                error={touched.isActive && !!errors.isActive}
                helperText={touched.isActive && !!errors.isActive ? errors.isActive : ""}
                onChange={({ value }: IOption) => {
                  setFieldTouched("isActive");
                  setFieldValue("isActive", value);
                }}
              />
            </Col>
          </Row>

          {/* LINHA 5 - Observações */}
          {/* <Row className="mb-4">
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
          </Row> */}

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
