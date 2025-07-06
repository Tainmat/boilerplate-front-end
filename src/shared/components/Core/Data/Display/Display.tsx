import { Skeleton } from "../../Skeleton";
import { Container, Label, Value } from "./Display.styles";

interface Props {
  label: string;
  value: string | number;
  loading?: boolean;
}

export function DataDisplay({ label, value, loading }: Props) {
  return (
    <Container>
      <Label>{label}</Label>

      {loading ? <Skeleton /> : <Value>{value}</Value>}
    </Container>
  );
}

DataDisplay.defaultProps = {
  loading: undefined,
};
