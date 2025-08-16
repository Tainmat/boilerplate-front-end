import {
  IUserRegisterForm,
  usersValidationSchema,
} from "@modules/Admin/Users/pages/CreateUsers/RegisterForm/RegisterForm.form";
import { Button } from "@shared/components/Core/Buttons/Button";
import { InputText } from "@shared/components/Core/Form/Fields/InputText";
import { InputDatePicker } from "@shared/components/Core/Form/Fields/InputDatePicker";
import { InputFile } from "@shared/components/Core/Form/Fields/InputFile";
import { Select } from "@shared/components/Core/Form/Fields/Select";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { useAlertContext } from "@shared/contexts/Alert";
import { Field, Form, Formik } from "formik";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useProfileNotAssociatedDropdown } from "@/shared/hooks/services/Admin/Dropdown/useProfileNotAssociatedDropdown";

interface Props {
  initialValues: IUserRegisterForm | null;
  onSubmit: (data: IUserRegisterForm) => void;
}

export function UserRegisterForm({ initialValues, onSubmit }: Props) {
  console.log('UserRegisterForm - initialValues recebido:', initialValues);
  
  const { addAlertOnCancel } = useAlertContext();
  const navigate = useNavigate();
  const { result: profilesOptions } = useProfileNotAssociatedDropdown();

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
      {({ touched, errors, dirty, isValid, setFieldValue, setFieldTouched, values }) => {
        console.log('RegisterForm - signature value:', values.signature);
        console.log('RegisterForm - initialValues:', initialValues);
        return (
        <Form>
          <Row className="mb-4">
            <Col xl={5}>
              <Field
                as={InputText}
                label="Nome do Usuário"
                name="name"
                placeholder="Informe o Nome do Usuário"
                maxLength={50}
                type="text"
                error={touched.name && !!errors.name}
                helperText={touched.name && !!errors.name ? errors.name : ""}
              />
            </Col>

            <Col xl={5}>
              <Field
                as={InputText}
                label="Nome Social"
                name="socialName"
                placeholder="Informe o Nome Social do Usuário"
                maxLength={50}
                type="text"
                error={touched.socialName && !!errors.socialName}
                helperText={touched.socialName && !!errors.socialName ? errors.socialName : ""}
              />
            </Col>

            <Col xl={2}>
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

          <Row className="mb-4">
            <Col xl={5}>
              <Field
                as={InputText}
                label="E-mail do Usuário"
                name="email"
                placeholder="Informe o e-mail do Usuário"
                maxLength={100}
                inputMode="email"
                type="email"
                error={touched.email && !!errors.email}
                helperText={touched.email && !!errors.email ? errors.email : ""}
              />
            </Col>

            <Col xl={3}>
              <Field
                as={InputDatePicker}
                label="Data de Nascimento"
                name="birthDate"
                placeholder="dd/mm/aaaa"
                value={initialValues?.birthDate ? new Date(initialValues.birthDate) : null}
                onChange={(date: Date | null) => {
                  setFieldValue("birthDate", date ? date.toISOString().split("T")[0] : "");
                }}
              />
            </Col>

            <Col xl={4}>
              <Field
                as={Select}
                label="Perfil"
                name="profileId"
                placeholder="Selecione um Perfil"
                options={profilesOptions}
                error={touched.profileId && !!errors.profileId}
                helperText={touched.profileId && !!errors.profileId ? errors.profileId : ""}
                onChange={({ value }: IOption) => {
                  setFieldTouched("profileId");
                  setFieldValue("profileId", value);
                }}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            <Col xl={5}>
              <Field
                as={InputText}
                label="Senha do Usuário"
                name="password"
                placeholder="Informe a senha do Usuário"
                maxLength={20}
                inputMode="password"
                type="password"
                error={touched.password && !!errors.password}
                helperText={touched.password && !!errors.password ? errors.password : ""}
              />
            </Col>

            <Col xl={7}>
              <Field
                as={InputFile}
                label="Assinatura"
                name="signature"
                placeholder="Clique para selecionar ou arraste a assinatura do usuário"
                type="file"
                accept="image/*"
                value={values.signature || ""}
                error={touched.signature && !!errors.signature}
                helperText={touched.signature && !!errors.signature ? errors.signature : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const base64 = event.target?.result as string;
                      setFieldValue("signature", base64);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setFieldValue("signature", "");
                  }
                }}
                onRemove={() => {
                  setFieldValue("signature", "");
                  setFieldTouched("signature", true);
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
        );
      }}
    </Formik>
  );
}
