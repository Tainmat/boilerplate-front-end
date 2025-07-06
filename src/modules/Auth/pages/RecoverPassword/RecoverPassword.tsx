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
import { post, fakeRequest } from "@shared/services/api/api.service";
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

      /* const response = await post<any>(URL_RECOVER_PASSWORD, formValues); */
      const { data } = await fakeRequest(2000, formValues);

      /* if (response.data) {
        addToast({
          type: "success",
          title: "Sucesso",
          description: response.message,
        });

        navigate(ROUTE_LOGIN);
      } else {
        addToast({
          type: "warning",
          title: "Oops",
          description: response.message_description![0],
        });
      } */

      if (data) {
        navigate(ROUTE_LOGIN);
      }
    } catch (err) {
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
