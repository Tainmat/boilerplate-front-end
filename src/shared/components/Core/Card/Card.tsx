import { ReactNode } from "react";

import * as S from "./Card.styles";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: Props) {
  return (
    <S.Container className={`card ${className}`} onClick={onClick}>
      {children}
    </S.Container>
  );
}
