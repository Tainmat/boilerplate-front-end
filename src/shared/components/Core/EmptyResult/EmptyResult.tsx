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
        <Col xs={11} sm={8} md={6} lg={5} xl={4}>
          <Row className="mb-3 mb-md-4">
            <Col>
              <img 
                src={IconNotFound} 
                alt="Nenhum resultado encontrado"
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  maxWidth: '200px',
                  maxHeight: '150px',
                  objectFit: 'contain'
                }}
              />
            </Col>
          </Row>

          <Row className="mb-4 mb-md-5">
            <Col>
              <Heading size="md" className="d-none d-md-block">
                Nenhum resultado foi encontrado
              </Heading>
              <Heading size="sm" className="d-block d-md-none">
                Nenhum resultado foi encontrado
              </Heading>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col xs="auto">
              <Button 
                styles="secondary" 
                onClick={() => handleOnClick()}
                className="d-block d-md-none"
              >
                Nova Pesquisa
              </Button>
              <Button 
                styles="secondary" 
                onClick={() => handleOnClick()}
                className="d-none d-md-block"
              >
                Nova Pesquisa
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
