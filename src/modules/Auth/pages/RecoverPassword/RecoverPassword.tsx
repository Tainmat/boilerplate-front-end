import {
  initialValuesSchema,
  IRecoverPassForm,
  recoverPassValidationsSchema,
} from "@modules/Auth/pages/RecoverPassword/RecoverPassword.form";
import { ROUTE_LOGIN } from "@modules/Auth/routes/Login.paths";
import { AuthInput } from "@modules/Auth/shared/components/Form/Fields/AuthInput/AuthInput";
import { AuthLayout } from "@modules/Auth/shared/components/Layout";
import { SubmitButton } from "@modules/Auth/shared/components/SubmitButton";
import * as S from "@modules/Auth/shared/styles/Auth.styles";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { TITLE_RECOVER_PASSWORD } from "@shared/constants/title.browser";
/* import { URL_RECOVER_PASSWORD } from "@shared/constants/urls"; */
import { useLoaderContext } from "@shared/contexts/Loader";
import { useToastContext } from "@shared/contexts/Toast";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { post } from "@shared/services/api/api.service";
import { Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function RecoverPassword() {
  const { deviceDetection } = useDeviceDetection();
  const navigate = useNavigate();

  const { showLoader, hideLoader } = useLoaderContext();
  const { handleApiRejection, addToast } = useToastContext();

  useEffect(() => {
    document.title = TITLE_RECOVER_PASSWORD;
  }, []);

  async function handleOnSubmit(formValues: IRecoverPassForm) {
    try {
      showLoader();

      const payload = {
        email: formValues.emailUsuario,
      };

      const response = await post<any>("/auth/forgot-password", payload);

      if (response.data) {
        addToast({
          type: "success",
          title: "Sucesso!",
          description: response.message || "E-mail de recuperação enviado com sucesso!",
        });

        navigate(ROUTE_LOGIN);
      } else {
        addToast({
          type: "warning",
          title: "Oops!",
          description: response.message || "Erro ao enviar e-mail de recuperação.",
        });
      }
    } catch {
      handleApiRejection();
    } finally {
      hideLoader();
    }
  }

  return (
    <AnimatedPage>
      <AuthLayout deviceType={deviceDetection}>
        <Container>
          <Row className="mb-2">
            <Col>
              <S.Title>Recuperar Senha</S.Title>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <p className="text-muted text-center mb-0" style={{ fontSize: "0.9rem" }}>
                Digite seu e-mail abaixo e enviaremos instruções para redefinir sua senha.
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <Formik
                validateOnMount
                initialValues={initialValuesSchema}
                validationSchema={recoverPassValidationsSchema}
                onSubmit={(values) => {
                  handleOnSubmit(values);
                }}
              >
                {({ touched, errors, isValid, dirty }) => (
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

                    <Row className="mt-1">
                      <Col>
                        <SubmitButton
                          typeButton="submit"
                          text="Enviar"
                          disabled={!dirty || !isValid}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-1 mb-1">
                      <Col>
                        <SubmitButton
                          typeButton="button"
                          text="Cancelar"
                          onClick={() => {
                            navigate(ROUTE_LOGIN);
                          }}
                          warning
                        />
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
