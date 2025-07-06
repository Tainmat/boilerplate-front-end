import { Container } from "@shared/components/Core/Typography/Subtitle/Subtitle.styles";
import { ReactNode } from "react";

interface Props {
  size: "xs" | "sm" | "lg";
  className?: string;
  children: string | number | ReactNode;
  color?: "neutral" | "warning" | "success" | "primary";
}

export function Subtitle({ size, className, children, color }: Props) {
  return (
    <Container size={size} className={className} color={color}>
      {children}
    </Container>
  );
}
