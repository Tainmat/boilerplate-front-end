import { Icon } from "@/shared/components/Core/Icons/Icon";
import { Subtitle } from "@/shared/components/Core/Typography/Subtitle";
import { useAuthContext } from "@/shared/contexts/Auth";
import { TITLE_HOME } from "@shared/constants/title.browser";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useEffect } from "react";
import { Card, CardBody, Col, Container, Row } from "react-bootstrap";

export function HomePage() {
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { user } = useAuthContext();

  useEffect(() => {
    document.title = TITLE_HOME;

    setPageBreadcrumb([{ text: "Home" }]);
  }, [setPageBreadcrumb]);

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow rounded-3 border-0">
            <CardBody>
              <div className="d-flex align-items-center mb-3">
                <Icon icon="home" size="md" className="me-2 text-primary" />
                <Subtitle size="sm">Bem-vindo ao Painel Administrativo</Subtitle>
              </div>

              <p className="text-muted">
                Olá, <strong>{user?.userName || "usuário"}</strong>! Utilize o menu lateral para
                navegar pelos módulos disponíveis.
              </p>

              <hr />

              <p className="mb-0">
                Este sistema é utilizado para gerenciar cadastros, contatos e fluxos internos da
                empresa. Caso tenha dúvidas, entre em contato com o administrador.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
