import {
  ILoginForm,
  initialValuesSchema,
  ValidationsSchema,
} from "@modules/Auth/pages/Login/Login.form";
import { ROUTE_RECOVER_PASSWORD } from "@modules/Auth/routes/Login.paths";
import { AuthInput } from "@modules/Auth/shared/components/Form/Fields/AuthInput";
import { AuthLayout } from "@modules/Auth/shared/components/Layout/AuthLayout";
import { SubmitButton } from "@modules/Auth/shared/components/SubmitButton";
import * as S from "@modules/Auth/shared/styles/Auth.styles";
import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { ButtonLink } from "@shared/components/Core/Buttons/ButtonLink";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { TITLE_LOGIN } from "@shared/constants/title.browser";
import { useAuthContext } from "@shared/contexts/Auth";
import { useToastContext } from "@shared/contexts/Toast";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

export function Login() {
  const { deviceDetection, isSmartphone } = useDeviceDetection();

  const [searchParams] = useSearchParams();

  const { addToast } = useToastContext();

  const navigate = useNavigate();

  const { signIn } = useAuthContext();

  useEffect(() => {
    document.title = TITLE_LOGIN;
  }, []);

  async function handleOnSubmit(formValues: ILoginForm, formikHelpers: FormikHelpers<ILoginForm>) {
    const user = await signIn({
      username: formValues.emailUsuario,
      password: formValues.passwordUsuario,
    });

    if (user?.authenticated === true) {
      navigate(searchParams.get("redirect") ? String(searchParams.get("redirect")) : ROUTE_HOME);
    } else if (user?.authenticated === false) {
      formikHelpers.setFieldError("emailUsuario", "E-mail incorreto");
      formikHelpers.setFieldError("passwordUsuario", "Senha incorreta");

      if (!isSmartphone) {
        addToast({
          type: "warning",
          title: "Erro no Login",
          description: "E-mail ou senha incorretos.",
        });
      }
    }
  }

  return (
    <AnimatedPage>
      <AuthLayout deviceType={deviceDetection}>
        <Container>
          <Row className="mb-2">
            <Col>
              <S.Title>Login</S.Title>
            </Col>
          </Row>
          <Row>
            <Col>
              <Formik
                validateOnMount
                initialValues={initialValuesSchema}
                validationSchema={ValidationsSchema}
                onSubmit={(values, helpers) => {
                  handleOnSubmit(values, helpers);
                }
                }
              >
                {({ touched, errors, isValid }) => (
                  <Form className="d-flex flex-column gap-1">
                    <Row className="mb-1">
                      <Col>
                        <Field
                          as={AuthInput}
                          name="emailUsuario"
                          type="email"
                          placeholder="E-mail"
                          error={touched.emailUsuario && !!errors.emailUsuario}
                          helperText={
                            touched.emailUsuario && !!errors.emailUsuario ? errors.emailUsuario : ""
                          }
                        />
                      </Col>
                    </Row>

                    <Row className="mb-1">
                      <Col>
                        <Field
                          as={AuthInput}
                          name="passwordUsuario"
                          placeholder="Password"
                          type="password"
                          error={touched.passwordUsuario && !!errors.passwordUsuario}
                          helperText={
                            touched.passwordUsuario && !!errors.passwordUsuario
                              ? errors.passwordUsuario
                              : ""
                          }
                        />
                      </Col>
                    </Row>

                    <Row className="justify-content-end mb-1">
                      <Col xs={12} className="text-end">
                        <ButtonLink route={ROUTE_RECOVER_PASSWORD} mode="light">
                          Recuperar Senha
                        </ButtonLink>
                      </Col>
                    </Row>

                    <Row className="mt-1">
                      <Col>
                        <SubmitButton text="Entrar" disabled={!isValid} typeButton="submit" />
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </Col>
          </Row>
        </Container>
      </AuthLayout>
    </AnimatedPage>
  );
}
