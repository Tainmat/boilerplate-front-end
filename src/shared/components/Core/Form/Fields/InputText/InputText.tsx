import { Container } from "@shared/components/Core/Form/Fields/InputText/InputText.styles";
import { HelperText } from "@shared/components/Core/Form/HelperText";
import { Label } from "@shared/components/Core/Form/Label";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { ReactNode, useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask-next";
import { v4 } from "uuid";

import { Mask } from "./Input.mask";

interface Props {
  size?: "sm" | "lg";
  label?: string;
  tooltip?: string;
  name: string;
  placeholder?: string;
  addonText?: string | number | ReactNode;
  addonPlacement?: "left" | "right";
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
  initialValue?: string;
  value?: string;
  maxLength?: number;
  suffix?: string;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  disabled?: boolean;
  step?: string;
  min?: string;
  max?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  mask?: Mask | string;
}

export function InputText({
  size,
  label,
  tooltip,
  name,
  placeholder,
  addonText,
  addonPlacement,
  inputMode,
  type = "text",
  initialValue,
  value,
  maxLength,
  suffix,
  error,
  helperText,
  readOnly,
  disabled,
  step,
  min,
  max,
  onChange,
  onBlur,
  mask,
}: Props) {
  const inputField = useRef<HTMLInputElement | null>(null);

  const [inputValue, setInputValue] = useState(initialValue || "");

  const [isShowingPassword, setIsShowingPassword] = useState(false);

  useEffect(() => {
    if (typeof value === "string" || typeof value === "number") {
      setInputValue(String(value));
    }
  }, [value]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (inputMode === "numeric") {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    }

    setInputValue(e.target.value);

    onChange && onChange(e);
  }

  function handlePasswordIcon() {
    setIsShowingPassword(!isShowingPassword);
  }

  // Valor exibido (com suffix, se houver)
  const displayValue = suffix && inputValue.length > 0 ? `${inputValue}${suffix}` : inputValue;

  return (
    <Container
      size={size}
      addonPlacement={addonText ? addonPlacement || "left" : undefined}
      hasValue={!!inputValue}
      error={error}
      readOnly={readOnly}
      disabled={disabled}
    >
      {label && (
        <Label htmlFor={name} tooltip={tooltip} size={size}>
          {label}
        </Label>
      )}

      {error && (
        <div className="icon">
          <Icon size="sm" icon="error_outline" mode="warning" appearance="outlined" />
        </div>
      )}

      <div className="input">
        {addonText && <div className="addon">{addonText}</div>}

        {mask && mask.length > 0 ? (
          <InputMask
            mask={mask}
            id={v4()}
            name={name}
            inputMode={inputMode}
            type={type === "password" && isShowingPassword ? "text" : type}
            value={displayValue}
            placeholder={placeholder}
            maxLength={maxLength}
            readOnly={readOnly}
            disabled={disabled}
            step={step}
            min={min}
            max={max}
            autoComplete="new-password"
            onChange={handleOnChange}
            onBlur={onBlur}
          >
            {
              ((inputProps: any) => (
                <input {...inputProps} ref={inputField} />
              )) as unknown as React.ReactNode
            }
          </InputMask>
        ) : (
          <input
            id={v4()}
            name={name}
            inputMode={inputMode}
            type={type === "password" && isShowingPassword ? "text" : type}
            value={displayValue}
            placeholder={placeholder}
            maxLength={maxLength}
            readOnly={readOnly}
            disabled={disabled}
            step={step}
            min={min}
            max={max}
            autoComplete="new-password"
            onChange={handleOnChange}
            onBlur={onBlur}
            ref={inputField}
          />
        )}

        {type === "password" && (
          <div className="show-password" onClick={handlePasswordIcon} aria-hidden="true">
            <Icon size="md" icon={!isShowingPassword ? "visibility_on" : "visibility_off"} />
          </div>
        )}
      </div>

      {helperText && <HelperText text={helperText} />}
    </Container>
  );
}
