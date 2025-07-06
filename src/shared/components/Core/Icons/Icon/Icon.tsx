import { IconAppearence } from "@shared/components/Core/Icons/Icon/Icon.interface";
import * as S from "@shared/components/Core/Icons/Icon/Icon.styles";

interface Props {
  appearance?: IconAppearence;
  size?: "xs" | "sm" | "md" | "lg";
  mode?: "success" | "helper" | "warning" | "light" | "primary" | "neutral";
  icon: string;
  className?: string;
  disabled?: boolean;
}

export function Icon({ appearance, size, mode, icon, className, disabled }: Props) {
  function handleClassName(appearence: IconAppearence) {
    switch (appearence) {
      case "filled":
        return "material-icons";

      case "outlined":
        return "material-icons-outlined";

      case "round":
        return "material-icons-round";

      case "sharp":
        return "material-icons-sharp";

      case "two-tone":
        return "material-icons-two-tone";

      default:
        return "material-icons";
    }
  }

  return (
    <S.Container
      className={`${handleClassName(appearance)} ${className}`}
      size={size}
      mode={mode}
      disabled={disabled}
    >
      {icon}
    </S.Container>
  );
}
