import { UserRegisterForm } from "@modules/Admin/Users/pages/CreateUsers/RegisterForm";
import { IUserRegisterForm } from "@modules/Admin/Users/pages/CreateUsers/RegisterForm/RegisterForm.form";
import { ROUTE_LIST_USERS } from "@modules/Admin/Users/routes/Users.paths";
import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { Section } from "@shared/components/Core/Containers/Section";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { TITLE_ADMIN_USERS } from "@shared/constants/title.browser";
/* import { URL_LIST_USUA, URL_SAVE_USUA } from "@shared/constants/urls"; */
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useLoaderContext } from "@shared/contexts/Loader";
import { useToastContext } from "@shared/contexts/Toast";
/* import { usuarios } from "@shared/hooks/services/Admin/useUsers"; */
import { IUsers } from "@shared/hooks/services/Admin/useUsers";
import { get, post, put } from "@shared/services/api/api.service";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// Dados fictícios para perfis
const perfis = [
  { id: 1, uuidPerfil: "perf-1111", dsPerfil: "Administrador", dsSiglaPerfil: "ADM" },
  { id: 2, uuidPerfil: "perf-2222", dsPerfil: "Inspetor", dsSiglaPerfil: "INS" },
  { id: 3, uuidPerfil: "perf-3333", dsPerfil: "Cliente", dsSiglaPerfil: "CLI" },
];

export function CreateUsers() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { uuid } = useParams();

  const [user, setUser] = useState<IUserRegisterForm | null>(null);

  useEffect(() => {
    document.title = TITLE_ADMIN_USERS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Admin" },
      { text: "Cadastros", route: ROUTE_LIST_USERS },
      { text: "Usuários" },
    ]);

    if (uuid) {
      get<IUsers>(`${"/parametrizations/profile-management/users"}/${uuid}`)
        .then((data) => {
          console.log('Dados recebidos da API:', data);
          if (data.data) {
            const response = data.data.data;
            console.log('Response data:', response);
            console.log('Signature do backend:', response.signature);
            
            const userData: IUserRegisterForm = {
              id: response.id,
              name: response.name,
              socialName: response.socialName,
              password: response.password,
              birthDate: response.birthDate,
              email: response.email,
              profileId: response.profileId,
              isActive: response.isActive ? "true" as const : "false" as const,
              signature: response.signature || "",
            };
            
            console.log('Chamando setUser com:', userData);
            setUser(userData);
          } else {
            addToast({
              type: "helper",
              title: "Ooops.",
              description: "Módulo não encontrado.",
            });

            navigate(-1);
          }
        })
        .catch(() => {
          addToast({
            type: "helper",
            title: "Ooops.",
            description: "Dados de usuário não encontrados.",
          });

          navigate(-1);
        });
    } else {
      setUser({
        name: "",
        socialName: "",
        password: "",
        birthDate: "",
        email: "",
        profileId: "",
        isActive: "false",
        signature: "",
      });
    }
  }, [setPageBreadcrumb, uuid, navigate, addToast]);

  async function handleOnSubmit(formValues: IUserRegisterForm) {
    const payload = {
      ...formValues,
      isActive: formValues.isActive === "true",
    };

    try {
      showLoader();

      if (uuid) {
        const { data, message } = await put<IUsers>(
          `${"/parametrizations/profile-management/users"}/${uuid}`,
          payload,
        );

        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Usuário atualizado com sucesso!",
          });
        }
      } else {
        const { data, message } = await post<IUsers>(
          "/parametrizations/profile-management/users",
          payload,
        );
        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Usuário cadastrado com sucesso!",
          });
        }
      }
      navigate(-1);
    } catch (error) {
      handleApiRejection();
    } finally {
      hideLoader();
    }
  }

  return (
    <AnimatedPage>
      <Section>
        <Container fluid>
          <Row>
            <Col lg={9} xxl={12}>
              <div className="d-flex align-items-center gap-2 mb-4">
                <Icon icon="post_add" />

                <Subtitle size="sm">Cadastrar Usuário</Subtitle>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <UserRegisterForm
                initialValues={user && user}
                onSubmit={(values) => handleOnSubmit(values)}
              />
            </Col>
          </Row>
        </Container>
      </Section>
    </AnimatedPage>
  );
}
