import { Container } from "@shared/components/Core/Form/Fields/InputText/InputText.styles";
import { HelperText } from "@shared/components/Core/Form/HelperText";
import { Label } from "@shared/components/Core/Form/Label";
import { Icon } from "@shared/components/Core/Icons/Icon";
import {
  getPhoneTypeDescription,
  phoneInputMask,
  type PhoneNumberConfig,
  phoneNumberMask,
  type PhoneNumberResult,
} from "@shared/utils/masks/phoneMask";
import { ReactNode, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

interface Props {
  size?: "sm" | "lg";
  label?: string;
  tooltip?: string;
  name: string;
  placeholder?: string;
  addonText?: string | number | ReactNode;
  addonPlacement?: "left" | "right";
  initialValue?: string;
  value?: string;
  maxLength?: number;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  disabled?: boolean;
  country?: PhoneNumberConfig["country"];
  showValidation?: boolean;
  showPhoneType?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, phoneData: PhoneNumberResult) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onValidationChange?: (isValid: boolean, phoneData: PhoneNumberResult) => void;
}

export function InputPhone({
  size,
  label,
  tooltip,
  name,
  placeholder,
  addonText,
  addonPlacement,
  initialValue,
  value,
  maxLength,
  error,
  helperText,
  readOnly,
  disabled,
  country = "BR",
  showValidation = true,
  showPhoneType = false,
  onChange,
  onBlur,
  onValidationChange,
}: Props) {
  const inputField = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState(initialValue || "");
  const [phoneData, setPhoneData] = useState<PhoneNumberResult>({
    formatted: "",
    raw: "",
    isValid: false,
    type: "UNKNOWN",
    country: country || "BR",
  });

  useEffect(() => {
    if (typeof value === "string" || typeof value === "number") {
      const newValue = String(value);
      setInputValue(newValue);

      // Validate and format the phone number
      const result = phoneNumberMask(newValue, { country });
      setPhoneData(result);

      if (onValidationChange) {
        onValidationChange(result.isValid, result);
      }
    }
  }, [value, country, onValidationChange]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value;

    // Apply input mask for real-time formatting
    const maskedValue = phoneInputMask(rawValue, { country });
    setInputValue(maskedValue);

    // Update the input field value
    e.target.value = maskedValue;

    // Validate the phone number
    const result = phoneNumberMask(rawValue, { country });
    setPhoneData(result);

    // Call validation callback
    if (onValidationChange) {
      onValidationChange(result.isValid, result);
    }

    // Call onChange callback
    if (onChange) {
      onChange(e, result);
    }
  }

  function getValidationIcon() {
    if (!showValidation || !inputValue) return null;

    if (phoneData.isValid) {
      return <Icon size="sm" icon="check_circle" mode="success" />;
    } else if (inputValue.length > 3) {
      return <Icon size="sm" icon="error" mode="warning" />;
    }

    return null;
  }

  function getPhoneTypeText() {
    if (!showPhoneType || !phoneData.isValid) return "";
    return getPhoneTypeDescription(phoneData.type, phoneData.country);
  }

  const validationIcon = getValidationIcon();
  const phoneTypeText = getPhoneTypeText();
  const finalHelperText = phoneTypeText
    ? `${helperText || ""} ${phoneTypeText}`.trim()
    : helperText;

  return (
    <Container
      size={size}
      addonPlacement={addonText ? addonPlacement || "left" : undefined}
      hasValue={!!inputValue}
      error={error || (showValidation && inputValue.length > 3 && !phoneData.isValid)}
      readOnly={readOnly}
      disabled={disabled}
    >
      {label && (
        <Label htmlFor={name} tooltip={tooltip} size={size}>
          {label}
        </Label>
      )}

      {validationIcon && <div className="icon">{validationIcon}</div>}

      <div className="input">
        {addonText && <div className="addon">{addonText}</div>}

        <input
          id={v4()}
          name={name}
          type="tel"
          value={inputValue}
          placeholder={placeholder || (country === "BR" ? "(11) 99999-9999" : "(555) 123-4567")}
          maxLength={maxLength || (country === "BR" ? 15 : 14)}
          readOnly={readOnly}
          disabled={disabled}
          autoComplete="tel"
          onChange={handleOnChange}
          onBlur={onBlur}
          ref={inputField}
        />
      </div>

      {finalHelperText && <HelperText text={finalHelperText} />}
    </Container>
  );
}
