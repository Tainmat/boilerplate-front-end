import { Container } from "@shared/components/Core/Table/Totals/Totals.styles";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Totals({ children }: Props) {
  return <Container>{children}</Container>;
}
