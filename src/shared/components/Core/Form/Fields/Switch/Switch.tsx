import { Icon } from "../../../Icons/Icon";
import { Label } from "../../Label";
import { Container, Wrapper } from "./Switch.styles";

interface Props {
  size?: "sm" | "lg";
  label?: string;
  description?: string;
  name?: string;
  checked: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function Switch({
  size,
  label,
  description,
  name,
  checked,
  readOnly,
  disabled,
  onChange,
  onBlur,
}: Props) {
  return (
    <Wrapper>
      {label && <Label htmlFor={name}>{label}</Label>}

      <Container size={size} readOnly={readOnly} disabled={disabled}>
        {description && <span className="description">{description}</span>}

        <input
          type="checkbox"
          name={name}
          checked={checked}
          readOnly={readOnly}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
        />

        <span className="checkmark">
          <Icon
            mode={checked ? "success" : "primary"}
            appearance={!checked ? "outlined" : undefined}
            icon={checked ? "toggle_on" : "toggle_off"}
            size={!size || size === "lg" ? "lg" : "md"}
          />
        </span>
      </Container>
    </Wrapper>
  );
}

Switch.defaultProps = {
  size: undefined,
  label: undefined,
  description: undefined,
  name: undefined,
  disabled: undefined,
  readOnly: undefined,
  onChange: undefined,
  onBlur: undefined,
};
