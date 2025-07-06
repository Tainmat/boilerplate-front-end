import IconNotFound from "@assets/images/icon-not-found.png";
import { Button } from "@shared/components/Core/Buttons/Button";
import { Container } from "@shared/components/Core/EmptyResult/EmptyResult.styles";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";

export function EmptyResult() {
  const navigate = useNavigate();

  const [, setSearchParams] = useSearchParams();

  function handleOnClick() {
    setSearchParams([]);
    navigate(0);
  }

  return (
    <Container>
      <Row className="justify-content-center text-center pt-1 pb-5">
        <Col xs={5}>
          <Row className="mb-4">
            <Col>
              <img src={IconNotFound} alt="Nenhum resultado encontrado" />
            </Col>
          </Row>

          <Row className="mb-5">
            <Col>
              <Heading size="md">Nenhum resultado foi encontrado</Heading>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs="auto">
              <Button styles="secondary" onClick={() => handleOnClick()}>
                Nova Pesquisa
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
