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
import { usuarios } from "@shared/hooks/services/Admin/useUsers";
import { IUsers } from "@shared/hooks/services/Admin/useUsers";
import { fakeRequest, post, put } from "@shared/services/api/api.service";
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

  // Opções para o select de perfil
  const perfilOptions = perfis.map(perfil => ({
    value: perfil.uuidPerfil,
    label: perfil.dsPerfil
  }));

  const fakeGetUser = (uuid: string) => {
    return fakeRequest(500, { uuid }).then(() => {
      const user = usuarios.find((u) => u.uuidUsuario === uuid);

      if (!user) {
        return { data: null };
      }

      return { data: user };
    });
  };

  const fakePostUsuario = async (payload: any) => {
    const novoUsuario = {
      ...payload,
      idUsuario: usuarios.length + 1,
      uuidUsuario: uuidv4(),
      dataCadastroUsuario: new Date().toISOString(),
      nomeSocialUsuario: payload.nomeSocialUsuario || "",
      dataNascimento: payload.dataNascimento || null,
      idPerfil: payload.idPerfil,
      dsPerfil: perfis.find(p => p.uuidPerfil === payload.idPerfil)?.dsPerfil || "",
      dsStatusCadastroUsuario: payload.inStatusCadastroUsuario ? "Ativo" : "Inativo",
    };

    usuarios.push(novoUsuario);

    return fakeRequest(1000, {
      data: novoUsuario,
      message: "Usuário cadastrado com sucesso!",
    });
  };

  const fakePutUsuario = async (uuid: string, payload: any) => {
    const index = usuarios.findIndex((u) => u.uuidUsuario === uuid);

    if (index === -1) {
      throw new Error("Usuário não encontrado");
    }

    const atualizado = {
      ...usuarios[index],
      ...payload,
      nomeSocialUsuario: payload.nomeSocialUsuario || usuarios[index].nomeSocialUsuario || "",
      dataNascimento: payload.dataNascimento || usuarios[index].dataNascimento || null,
      idPerfil: payload.idPerfil || usuarios[index].idPerfil,
      dsPerfil: perfis.find(p => p.uuidPerfil === payload.idPerfil)?.dsPerfil || usuarios[index].dsPerfil || "",
      dsStatusCadastroUsuario: payload.inStatusCadastroUsuario ? "Ativo" : "Inativo",
    };

    usuarios[index] = atualizado;

    return fakeRequest(1000, {
      data: atualizado,
      message: "Usuário atualizado com sucesso!",
    });
  };

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
      fakeGetUser(uuid)
        .then((data) => {
          if (data.data) {
            setUser({
              nomeUsuario: data.data.nomeUsuario,
              nomeSocialUsuario: data.data.nomeSocialUsuario || "",
              dataNascimento: data.data.dataNascimento || "",
              idPerfil: data.data.idPerfil || "",
              emailUsuario: data.data.emailUsuario,
              inStatusCadastroUsuario: data.data.inStatusCadastroUsuario ? "true" : "false",
            });
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
            description: "Erro ao recuperar dados do Módulo.",
          });
          navigate(-1);
        });

      /* getOne<IUsers>(`${URL_LIST_USUA}/${uuid}`)
        .then((data) => {
          if (data.data) {
            setUser({
              nomeUsuario: data.data.nomeUsuario,
              emailUsuario: data.data.emailUsuario,
              uuidCargo: data.data.uuidCargo,
              uuidDepartamento: data.data.uuidDepartamento,
              inStatusCadastroUsuario: data.data.inStatusCadastroUsuario ? "true" : "false",
            });
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
            description: "Erro ao recuperar dados do Módulo.",
          });

          navigate(-1);
        }); */
    } else {
      setUser({
        nomeUsuario: "",
        emailUsuario: "",
        nomeSocialUsuario: "",
        dataNascimento: "",
        idPerfil: "",
        inStatusCadastroUsuario: "true",
      });
    }
  }, [setPageBreadcrumb, uuid, navigate, addToast]);

  async function handleOnSubmit(formValues: IUserRegisterForm) {
    const payload = {
      ...formValues,
      inStatusCadastroUsuario: formValues.inStatusCadastroUsuario === "true",
    };

    try {
      showLoader();
      let response;

      if (uuid) {
        response = await fakePutUsuario(uuid, payload);

        if (response.data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: response.message,
          });

          /* navigate(-1); */
        }

        /* const { data, message } = await put<IUsers>(`${URL_SAVE_USUA}/${uuid}`, payload);
        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Usuário atualizado com sucesso!",
          });

          navigate(-1);
        }
      } else {
        const { data, message } = await post<IUsers>(URL_SAVE_USUA, payload);
        if (data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: message || "Usuário cadastrado com sucesso!",
          });

          navigate(-1);
        }*/
      } else {
        response = await fakePostUsuario(payload);

        if (response.data) {
          addToast({
            type: "success",
            title: "Sucesso!",
            description: response.message,
          });

          /* navigate(-1); */
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
                perfilOptions={perfilOptions}
                onSubmit={(values) => handleOnSubmit(values)}
              />
            </Col>
          </Row>
        </Container>
      </Section>
    </AnimatedPage>
  );
}
