import * as S from "@shared/components/Core/Typography/Heading/Heading.styles";
import { ReactNode } from "react";

interface Props {
  size: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "display";
  className?: string;
  title?: string;
  children: string | number | ReactNode;
  color?: "primary";
}

export function Heading({ size, className, children, color, title }: Props) {
  return (
    <S.Container size={size} className={className} color={color} title={title}>
      {children}
    </S.Container>
  );
}