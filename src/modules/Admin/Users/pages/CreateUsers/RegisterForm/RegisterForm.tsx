import {
  IUserRegisterForm,
  usersValidationSchema,
} from "@modules/Admin/Users/pages/CreateUsers/RegisterForm/RegisterForm.form";
import { Button } from "@shared/components/Core/Buttons/Button";
import { InputText } from "@shared/components/Core/Form/Fields/InputText";
import { InputDatePicker } from "@shared/components/Core/Form/Fields/InputDatePicker";
import { Select } from "@shared/components/Core/Form/Fields/Select";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { useAlertContext } from "@shared/contexts/Alert";
import { Field, Form, Formik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Props {
  initialValues: IUserRegisterForm | null;
  onSubmit: (data: IUserRegisterForm) => void;
  perfilOptions: IOption[];
}

export function UserRegisterForm({ initialValues, onSubmit, perfilOptions }: Props) {
  const { addAlertOnCancel } = useAlertContext();
  const navigate = useNavigate();

  if (!initialValues) {
    return (
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
      validationSchema={usersValidationSchema}
      onSubmit={onSubmit}
    >
      {({ touched, errors, dirty, isValid, setFieldValue, setFieldTouched }) => (
        <Form>
          <Row className="mb-4">
            <Col xl={5}>
              <Field
                as={InputText}
                label="Nome do Usuário"
                name="nomeUsuario"
                placeholder="Informe o Nome do Usuário"
                maxLength={50}
                type="text"
                error={touched.nomeUsuario && !!errors.nomeUsuario}
                helperText={touched.nomeUsuario && !!errors.nomeUsuario ? errors.nomeUsuario : ""}
              />
            </Col>
            
            <Col xl={5}>
              <Field
                as={InputText}
                label="Nome Social"
                name="nomeSocialUsuario"
                placeholder="Informe o Nome Social do Usuário"
                maxLength={50}
                type="text"
                error={touched.nomeSocialUsuario && !!errors.nomeSocialUsuario}
                helperText={touched.nomeSocialUsuario && !!errors.nomeSocialUsuario ? errors.nomeSocialUsuario : ""}
              />
            </Col>

            <Col xl={2}>
              <Field
                as={Select}
                label="Status"
                name="inStatusCadastroUsuario"
                placeholder="Selecionar"
                options={[
                  { value: "true", label: "Ativo" },
                  { value: "false", label: "Inativo" },
                ]}
                error={touched.inStatusCadastroUsuario && !!errors.inStatusCadastroUsuario}
                helperText={
                  touched.inStatusCadastroUsuario && !!errors.inStatusCadastroUsuario
                    ? errors.inStatusCadastroUsuario
                    : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("inStatusCadastroUsuario");
                  setFieldValue("inStatusCadastroUsuario", value);
                }}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xl={5}>
              <Field
                as={InputText}
                label="E-mail do Usuário"
                name="emailUsuario"
                placeholder="Informe o e-mail do Usuário"
                maxLength={100}
                inputMode="email"
                type="email"
                error={touched.emailUsuario && !!errors.emailUsuario}
                helperText={
                  touched.emailUsuario && !!errors.emailUsuario ? errors.emailUsuario : ""
                }
              />
            </Col>
            
            <Col xl={3}>
              <Field
                as={InputDatePicker}
                label="Data de Nascimento"
                name="dataNascimento"
                placeholder="dd/mm/aaaa"
                value={initialValues?.dataNascimento ? new Date(initialValues.dataNascimento) : null}
                onChange={(date: Date | null) => {
                  setFieldValue("dataNascimento", date ? date.toISOString().split('T')[0] : "");
                }}
              />
            </Col>
            
            <Col xl={4}>
              <Field
                as={Select}
                label="Perfil"
                name="idPerfil"
                placeholder="Selecione um Perfil"
                options={perfilOptions}
                error={touched.idPerfil && !!errors.idPerfil}
                helperText={
                  touched.idPerfil && !!errors.idPerfil ? errors.idPerfil : ""
                }
                onChange={({ value }: IOption) => {
                  setFieldTouched("idPerfil");
                  setFieldValue("idPerfil", value);
                }}
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
