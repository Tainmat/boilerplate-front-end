import { Button, Wrapper } from "@shared/components/Core/Buttons/ButtonIcon/ButtonIcon.styles";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { IconAppearence } from "@shared/components/Core/Icons/Icon/Icon.interface";

interface Props {
  type?: "button" | "submit" | "reset";
  appearance?: IconAppearence;
  size: "sm" | "md" | "lg";
  mode?: "success" | "helper" | "warning" | "light" | "primary";
  icon: string;
  disabled?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function ButtonIcon({
  type,
  appearance,
  size,
  icon,
  disabled,
  className,
  onClick,
  mode,
}: Props) {
  return (
    <Wrapper size={size}>
      <Button type={type || "button"} disabled={disabled} onClick={onClick}>
        <Icon mode={mode} appearance={appearance} size={size} icon={icon} className={className} />
      </Button>
    </Wrapper>
  );
}
