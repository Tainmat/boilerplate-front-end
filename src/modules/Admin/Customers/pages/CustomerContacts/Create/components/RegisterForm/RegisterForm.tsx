import { Field, Form, Formik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/components/Core/Buttons/Button";
import { Checkbox } from "@/shared/components/Core/Form/Fields/Checkbox";
import { InputPhone } from "@/shared/components/Core/Form/Fields/InputPhone";
import { InputText } from "@/shared/components/Core/Form/Fields/InputText";
import { Select } from "@/shared/components/Core/Form/Fields/Select";
import { IOption } from "@/shared/components/Core/Form/Fields/Select/Select.interface";
import { Skeleton } from "@/shared/components/Core/Skeleton";
import { useAlertContext } from "@/shared/contexts/Alert";
import { phoneNumberMask } from "@/shared/utils/masks";

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
          {/* LINHA 1 - Checkbox*/}
          <Row className="mb-4">
            <Col className="d-flex flex-row gap-3">
              <Field
                as={Checkbox}
                name="receiveInspectionEmail"
                description="Recebe E-mail"
                checked={values.receiveInspectionEmail === "true"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { checked } = e.target;
                  setFieldValue("receiveInspectionEmail", checked ? "true" : "false");
                }}
              />

              <Field
                as={Checkbox}
                name="isWhatsApp"
                description="WhatsApp"
                checked={values.isWhatsApp === "true"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { checked } = e.target;
                  setFieldValue("isWhatsApp", checked ? "true" : "false");
                }}
              />
            </Col>
          </Row>

          {/* LINHA 2 - Dados básicos*/}
          <Row className="mb-4">
            <Col xl={4}>
              <Field
                as={InputText}
                label="Nome"
                name="name"
                placeholder="Nome do Contato do Cliente"
                maxLength={128}
                type="text"
                error={touched.name && !!errors.name}
                helperText={touched.name && !!errors.name ? errors.name : ""}
              />
            </Col>

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

            <Col xl={4} className="d-flex justify-content-end">
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

          {/* LINHA 3 - Fones */}
          <Row className="mb-4">
            <Col xl={4}>
              <Field
                as={InputPhone}
                label="Telefone"
                name="phone"
                value={phoneNumberMask(values.phone).formatted}
                placeholder="(99) 9999-9999"
                country="BR"
                error={touched.phone && !!errors.phone}
                helperText={touched.phone && !!errors.phone ? errors.phone : ""}
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputText}
                label="Ramal"
                name="extension"
                placeholder="Ramal"
                maxLength={10}
                type="text"
                error={touched.extension && !!errors.extension}
                helperText={touched.extension && !!errors.extension ? errors.extension : ""}
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputPhone}
                label="Celular"
                name="mobile"
                value={phoneNumberMask(values.mobile).formatted}
                placeholder="(99) 99999-9999"
                country="BR"
                showValidation={true}
                error={touched.mobile && !!errors.mobile}
                helperText={touched.mobile && !!errors.mobile ? errors.mobile : ""}
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
