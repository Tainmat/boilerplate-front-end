import {
  IChangePasswordForm,
  initialValuesSchema,
  validationsSchema,
} from "@modules/Auth/pages/FirstLogin/FirstLogin.form";
import { ROUTE_LOGIN } from "@modules/Auth/routes/Login.paths";
import { AuthInput } from "@modules/Auth/shared/components/Form/Fields/AuthInput";
import { AuthLayout } from "@modules/Auth/shared/components/Layout/AuthLayout";
import { SubmitButton } from "@modules/Auth/shared/components/SubmitButton";
import * as S from "@modules/Auth/shared/styles/Auth.styles";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { TITLE_FIRST_LOGIN } from "@shared/constants/title.browser";
/* import { URL_CHANGE_PASSWORD } from "@shared/constants/urls"; */
import { useAuthContext } from "@shared/contexts/Auth";
import { useLoaderContext } from "@shared/contexts/Loader";
import { useToastContext } from "@shared/contexts/Toast";
import { put } from "@shared/services/api/api.service";
import { Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function FirstLogin() {
  const { signOut, user } = useAuthContext();
  const navigate = useNavigate();

  const { showLoader, hideLoader } = useLoaderContext();
  const { handleApiRejection, addToast } = useToastContext();

  useEffect(() => {
    document.title = TITLE_FIRST_LOGIN;
  }, []);

  async function handleOnSubmit(formValues: IChangePasswordForm) {
    try {
      showLoader();

      const params = {
        currentPassword: formValues.passwordUsuario,
        newPassword: formValues.novaPasswordUsuario,
        /* confirmaPasswordUsuario: formValues.confirmaPasswordUsuario, */
      };

      const response = await put<any>(`${"auth/change-password"}/${user!.id}`, params);

      if (response.data) {
        addToast({
          type: "success",
          title: "Sucesso",
          description: response.message,
        });

        signOut();
      } else {
        addToast({
          type: "warning",
          title: "Oops",
          description: response.message,
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
      <AuthLayout>
        <Container>
          <Row className="mb-4">
            <Col>
              <S.Title>Alterar Senha</S.Title>
            </Col>
          </Row>
          <Row>
            <Col>
              <Formik
                validateOnMount
                initialValues={initialValuesSchema}
                validationSchema={validationsSchema}
                onSubmit={(values) => {
                  handleOnSubmit(values);
                }}
              >
                {({ touched, errors, dirty, isValid }) => (
                  <Form>
                    <Row className="mb-4">
                      <Col>
                        <Field
                          as={AuthInput}
                          name="passwordUsuario"
                          placeholder="Password Atual"
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

                    <Row className="mb-4">
                      <Col>
                        <Field
                          as={AuthInput}
                          name="novaPasswordUsuario"
                          placeholder="Novo Password"
                          type="password"
                          error={touched.novaPasswordUsuario && !!errors.novaPasswordUsuario}
                          helperText={
                            touched.novaPasswordUsuario && !!errors.novaPasswordUsuario
                              ? errors.novaPasswordUsuario
                              : ""
                          }
                        />
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col>
                        <Field
                          as={AuthInput}
                          name="confirmaPasswordUsuario"
                          placeholder="Confirmação Password"
                          type="password"
                          error={
                            touched.confirmaPasswordUsuario && !!errors.confirmaPasswordUsuario
                          }
                          helperText={
                            touched.confirmaPasswordUsuario && !!errors.confirmaPasswordUsuario
                              ? errors.confirmaPasswordUsuario
                              : ""
                          }
                        />
                      </Col>
                    </Row>

                    <Row className="mt-5">
                      <Col>
                        <SubmitButton
                          typeButton="submit"
                          text="Alterar Password"
                          disabled={!dirty || !isValid}
                        />
                      </Col>
                    </Row>

                    <Row className=" mt-4  mb-5">
                      <Col>
                        <SubmitButton
                          typeButton="button"
                          text="Cancelar"
                          onClick={() => {
                            if (user && !user.isFirstAccess) {
                              navigate(-1);
                            } else {
                              signOut();
                              navigate(ROUTE_LOGIN);
                            }
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
