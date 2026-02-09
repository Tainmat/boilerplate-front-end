import { Container } from "@shared/components/Core/Tag/Tag.styles";
import { ReactNode } from "react";

interface Props {
  display?: "block" | "auto";
  disabled?: boolean;
  highlight?: boolean;
  size: "sm" | "lg";
  status?: "default" | "success" | "helper" | "warning" | "neutral" | "brand-secondary-pure";
  hover?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function Tag({
  display,
  disabled,
  highlight,
  size,
  status,
  hover,
  onClick,
  children,
  className,
}: Props) {
  return (
    <Container
      display={display}
      disabled={disabled}
      highlight={highlight}
      status={status}
      hover={hover}
      size={size}
      onClick={() => !disabled && onClick && onClick()}
      className={className}
    >
      {children}
    </Container>
  );
}
