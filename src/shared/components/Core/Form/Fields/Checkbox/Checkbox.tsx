import { Icon } from "../../../Icons/Icon";
import { Label } from "../../Label";
import { Container, Wrapper } from "./Checkbox.styles";

interface Props {
  label?: string;
  description?: string;
  name?: string;
  checked: boolean;
  value?: string;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function Checkbox({
  label,
  description,
  name,
  checked,
  value,
  readOnly,
  disabled,
  onChange,
  onBlur,
}: Props) {
  return (
    <Wrapper>
      {label && <Label htmlFor={name}>{label}</Label>}

      <Container readOnly={readOnly} disabled={disabled}>
        {description && <span className="description">{description}</span>}

        <input
          type="checkbox"
          name={name}
          checked={checked}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
        />

        <span className="checkmark">
          <Icon
            icon={checked ? "check_box" : "check_box_outline_blank"}
            mode={checked ? "success" : "neutral"}
          />
        </span>
      </Container>
    </Wrapper>
  );
}

Checkbox.defaultProps = {
  label: undefined,
  description: undefined,
  name: undefined,
  value: undefined,
  readOnly: undefined,
  disabled: undefined,
  onChange: undefined,
  onBlur: undefined,
};
