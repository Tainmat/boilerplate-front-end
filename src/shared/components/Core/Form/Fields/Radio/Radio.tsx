import { Icon } from "../../../Icons/Icon";
import { Container } from "./Radio.styles";

interface Props {
  label?: string;
  name: string;
  value?: string;
  checked: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function Radio({
  label,
  name,
  value,
  checked,
  readOnly,
  disabled,
  onChange,
  onBlur,
}: Props) {
  return (
    <Container readOnly={readOnly} disabled={disabled}>
      {label && <span className="label">{label}</span>}

      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        readOnly={readOnly}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
      />

      <span className="checkmark">
        <Icon
          icon={checked ? "radio_button_checked" : "radio_button_unchecked"}
          mode={checked ? "success" : "primary"}
        />
      </span>
    </Container>
  );
}

Radio.defaultProps = {
  label: undefined,
  value: undefined,
  readOnly: undefined,
  disabled: undefined,
  onChange: undefined,
  onBlur: undefined,
};
