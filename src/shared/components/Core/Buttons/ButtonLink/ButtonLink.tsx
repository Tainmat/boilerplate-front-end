import { Button, LinkButton } from "@shared/components/Core/Buttons/ButtonLink/ButtonLink.styles";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { useNavigate } from "react-router-dom";

interface Props {
  size?: "sm" | "md";
  route?: string;
  children: string;
  disabled?: boolean;
  mode: "light" | "dark";
  icon?: string;
  externalLink?: boolean;
  onClick?: () => void;
}

export function ButtonLink({
  size,
  route,
  children,
  disabled,
  mode,
  icon,
  onClick,
  externalLink = false,
}: Props) {
  const navigate = useNavigate();

  function handleOnClick() {
    if (route) navigate(route);
    onClick?.();
  }

  return !externalLink ? (
    <Button
      type="button"
      size={size}
      disabled={disabled}
      icon={icon}
      mode={mode}
      onClick={() => handleOnClick()}
    >
      {icon && <Icon icon={icon} />}
      {children}
    </Button>
  ) : (
    <LinkButton href={route} className="LinkButton" target="blank" size={size} mode={mode}>
      {children}
    </LinkButton>
  );
}
