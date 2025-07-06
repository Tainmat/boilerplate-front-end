import notFound from "@assets/images/not-found.svg";
import * as S from "@modules/Errors/NotFound/NotFound.styles";
import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { Button } from "@shared/components/Core/Buttons/Button";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  function handleOnClickButton() {
    return navigate(ROUTE_HOME);
  }

  return (
    <S.Container>
      <Row>
        <Col>
          <img src={notFound} />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Button styles="primary" onClick={handleOnClickButton}>
            Voltar para Home
          </Button>
        </Col>
      </Row>
    </S.Container>
  );
}
