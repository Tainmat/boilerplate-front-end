import { ReactNode } from "react";

import * as S from "./Card.styles";

interface Props {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: Props) {
  return <S.Container className={`card ${className}`}>{children}</S.Container>;
}
