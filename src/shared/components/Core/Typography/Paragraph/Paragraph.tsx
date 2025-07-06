import * as S from "@shared/components/Core/Typography/Paragraph/Paragraph.styles";
import { ReactNode } from "react";

interface Props {
  size: "xs" | "sm" | "lg";
  color?: "neutral" | "warning" | "success" | "primary";
  title?: string;
  className?: string;
  children: string | number | ReactNode;
}

export function Paragraph({ size, color, className, children, title }: Props) {
  return (
    <S.Container size={size} className={className} color={color} title={title}>
      {children}
    </S.Container>
  );
}