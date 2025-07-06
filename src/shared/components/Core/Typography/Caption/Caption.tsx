import { Container } from "@shared/components/Core/Typography/Caption/Caption.styles";
import { ReactNode } from "react";

interface Props {
  size: "sm" | "lg";
  fontWeigth?: "bold";
  className?: string;
  children: string | number | ReactNode;
}

export function Caption({ size, fontWeigth, className, children }: Props) {
  return (
    <Container fontWeigth={fontWeigth} size={size} className={className}>
      {children}
    </Container>
  );
}
