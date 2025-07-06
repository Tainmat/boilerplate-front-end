import { Container, Wrapper } from "@shared/components/Core/Buttons/Button/Button.styles";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { IconAppearence } from "@shared/components/Core/Icons/Icon/Icon.interface";

interface Props extends React.HTMLProps<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
  styles: "primary" | "secondary" | "tertiary";
  mode?: "success" | "helper" | "warning";
  display?: "block";
  appearance?: IconAppearence;
  icon?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Button({
  type,
  styles,
  mode,
  appearance,
  icon,
  display,
  disabled,
  children,
  className,
  onClick,
}: Props) {
  return (
    <Wrapper styles={styles} mode={mode} display={display}>
      <Container
        type={type || "button"}
        styles={styles}
        mode={mode}
        display={display}
        disabled={disabled}
        className={className}
        onClick={onClick}
      >
        {icon && <Icon appearance={appearance} icon={icon} />}

        <div>{children}</div>
      </Container>
    </Wrapper>
  );
}
