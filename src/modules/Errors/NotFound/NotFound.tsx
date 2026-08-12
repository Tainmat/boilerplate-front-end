import NotFoundImage from "@assets/images/not-found.svg";
import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { Button } from "@shared/components/Core/Buttons/Button";
import { useNavigate } from "react-router-dom";

import { Container } from "./NotFound.styles";

export function NotFound() {
  const navigate = useNavigate();

  function handleGoHome() {
    navigate(ROUTE_HOME);
  }

  return (
    <Container>
      <img src={NotFoundImage} alt="Pagina nao encontrada" />

      <h1>Pagina nao encontrada</h1>

      <p>A rota acessada nao existe ou nao esta disponivel.</p>

      <Button styles="primary" onClick={handleGoHome}>
        Voltar para Home
      </Button>
    </Container>
  );
}
