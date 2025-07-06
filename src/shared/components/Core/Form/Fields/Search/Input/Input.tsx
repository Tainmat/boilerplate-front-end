import { Container } from "@shared/components/Core/Form/Fields/Search/Input/Input.styles";
import { HelperText } from "@shared/components/Core/Form/HelperText";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

interface Props {
  name: string;
  inputMode?: "email" | "search" | "tel" | "text" | "url" | "none" | "numeric" | "decimal";
  type?:
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  placeholder?: string;
  initialValue?: string;
  value?: string;
  maxlength?: number;
  helperText?: string;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onReset?: () => void;
}

export function InputSearch({
  name,
  inputMode,
  type,
  placeholder,
  initialValue,
  value,
  maxlength,
  helperText,
  readOnly,
  disabled,
  onChange,
  onBlur,
  onReset,
}: Props) {
  const inputField = useRef<HTMLInputElement | null>(null);

  const [inputValue, setInputValue] = useState(initialValue || "");

  useEffect(() => {
    typeof value === "string" && setInputValue(value);
  }, [value]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange && onChange(e);

    setInputValue(e.target.value);
  }

  return (
    <Container readOnly={readOnly} disabled={disabled}>
      <input
        id={v4()}
        name={name}
        inputMode={inputMode}
        type={type}
        placeholder={placeholder}
        value={inputValue}
        maxLength={maxlength}
        disabled={disabled}
        onChange={handleOnChange}
        onBlur={onBlur}
        ref={inputField}
        autoComplete="one-time-code"
      />

      <div className="search">
        <Icon size="md" icon="search" mode="primary" />
      </div>

      {!!inputValue && (
        <div className="reset" onClick={onReset} aria-hidden="true">
          <Icon size="md" icon="close" mode="primary" />
        </div>
      )}

      {helperText && <HelperText text={helperText} />}
    </Container>
  );
}
