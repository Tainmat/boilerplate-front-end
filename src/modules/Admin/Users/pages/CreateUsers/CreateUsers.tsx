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
import fs from "fs";
import path, { resolve } from "path";

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
              isActive: response.isActive ? ("true" as const) : ("false" as const),
              signature: response.signature || "",
            };

            console.log("Chamando setUser com:", userData);
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
      console.error(`Erro ao ler imagem ${imagePath}:`, error);
      return "";
    }
  } */

  async function handleOnSubmit(formValues: IUserRegisterForm & { __isSignatureChanged?: boolean; __isSignatureDeleted?: boolean }) {
    const { __isSignatureChanged, __isSignatureDeleted, ...cleanFormValues } = formValues;
    
    // Construir payload base
    const payload: any = {
      ...cleanFormValues,
      isActive: cleanFormValues.isActive === "true",
    };

    // Lógica para signature e deleteSignature
    if (!uuid) {
      // Novo usuário: incluir signature se preenchida
      if (cleanFormValues.signature) {
        payload.signature = cleanFormValues.signature;
        console.log("✅ Signature incluída no payload (novo usuário)");
      }
    } else {
      // Edição de usuário existente
      if (__isSignatureDeleted) {
        // Signature foi deletada
        payload.deleteSignature = true;
        delete payload.signature; // Não enviar signature quando deletada
        console.log("🗑️ deleteSignature=true enviado (signature foi deletada)");
      } else if (__isSignatureChanged && cleanFormValues.signature) {
        // Signature foi alterada (nova imagem)
        payload.signature = cleanFormValues.signature;
        console.log("✅ Signature incluída no payload (signature foi alterada)");
      } else {
        // Signature não foi alterada
        delete payload.signature;
        console.log("⚠️ Signature removida do payload (não foi alterada em edição)");
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
