import { Container } from "@shared/components/Core/Skeleton/Skeleton.styles";
import Placeholder from "react-bootstrap/Placeholder";

interface Props {
  size?: "sm" | "md" | "lg";
}

export function Skeleton({ size }: Props) {
  return (
    <Container size={size}>
      <Placeholder as="p" animation="glow">
        <Placeholder xs={12} />
      </Placeholder>
    </Container>
  );
}
