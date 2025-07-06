import * as S from "@shared/components/Core/Containers/Section/Section.styles";
import { ReactNode } from "react";

interface Props {
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Section({ size, children }: Props) {
  return <S.Container size={size}>{children}</S.Container>;
}
