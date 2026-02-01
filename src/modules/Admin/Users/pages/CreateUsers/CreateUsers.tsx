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
          if (data.data) {
            const response = data.data.data;

            const userData: IUserRegisterForm = {
              id: response.id,
              name: response.name,
              socialName: response.socialName,
              password: response.password,
              birthDate: response.birthDate,
              email: response.email,
              profileId: response.profileId,
              profileName: response.profileName || "",
              isActive: response.isActive ? ("true" as const) : ("false" as const),
              signature: response.signature || "",
              customersIds: response.customersIds || [],
            };

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
        profileName: "",
        isActive: "true",
        signature: "",
        customersIds: [],
      });
    }
  }, [setPageBreadcrumb, uuid, navigate, addToast]);

  /* function getImageDataUrl(imagePath: string): string {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const imageBase64 = imageBuffer.toString("base64");
      const ext = path.extname(imagePath).toLowerCase();

      const mimeType =
        {
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".gif": "image/gif",
          ".webp": "image/webp",
          ".svg": "image/svg+xml",
          ".bmp": "image/bmp",
        }[ext] || "image/png";

      const dataUrl = `data:${mimeType};base64,${imageBase64}`;

      return dataUrl;
    } catch (error) {
      return "";
    }
  } */

  async function handleOnSubmit(
    formValues: IUserRegisterForm & {
      __isSignatureChanged?: boolean;
      __isSignatureDeleted?: boolean;
    },
  ) {
    const { __isSignatureChanged, __isSignatureDeleted, ...cleanFormValues } = formValues;

    const payload: any = {
      ...cleanFormValues,
      isActive: cleanFormValues.isActive === "true",
    };

    if (!uuid) {
      if (cleanFormValues.signature) {
        payload.signature = cleanFormValues.signature;
      }
    } else {
      if (__isSignatureDeleted) {
        payload.deleteSignature = true;
        delete payload.signature;
      } else if (__isSignatureChanged && cleanFormValues.signature) {
        payload.signature = cleanFormValues.signature;
      } else {
        delete payload.signature;
      }
    }

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
    } catch {
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
          {/* <img
            src={
              user?.signature && typeof user.signature === "string"
                ? getImageDataUrl(user.signature)
                : ""
            }
            alt="Description"
          /> */}
        </Container>
      </Section>
    </AnimatedPage>
  );
}
