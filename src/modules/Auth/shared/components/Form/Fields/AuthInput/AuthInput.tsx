import * as S from "@modules/Auth/shared/components/Form/Fields/AuthInput/AuthInput.styles";
import { HelperText } from "@shared/components/Core/Form/HelperText";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";

interface Props {
  name: string;
  type: "email" | "password";
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  maxLength?: number;
  value?: string;
  initialValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function AuthInput({
  name,
  type,
  placeholder,
  error,
  helperText,
  maxLength,
  value,
  initialValue,
  onChange,
  onBlur,
}: Props) {
  const inputField = useRef<HTMLInputElement | null>(null);

  const [inputValue, setInputValue] = useState(initialValue || "");

  const [isShowingPassword, setIsShowingPassword] = useState(false);

  useEffect(() => {
    if (typeof value === "string" || typeof value === "number") {
      setInputValue(value);
    }
  }, [value]);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);

    onChange && onChange(e);
  }

  function handlePasswordIcon() {
    if (inputField.current) {
      if (isShowingPassword) {
        setIsShowingPassword(false);
        inputField.current.type = "password";
      } else {
        setIsShowingPassword(true);
        inputField.current.type = "text";
      }
    }
  }

  return (
    <S.Container $error={error}>
      <div className="icon">
        <Icon
          size="xs"
          icon={type === "email" ? "email" : "lock"}
          mode="primary"
          appearance="outlined"
        />
      </div>

      <div className="input">
        <input
          ref={inputField}
          id={uuidV4()}
          name={name}
          type={type}
          value={inputValue}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete="new-password"
          onChange={handleOnChange}
          onBlur={onBlur}
        />

        {type === "password" && inputValue.length > 0 && (
          <div className="show-password" onClick={handlePasswordIcon} aria-hidden="true">
            <Icon
              size="sm"
              icon={!isShowingPassword ? "visibility_on" : "visibility_off"}
              mode="primary"
            />
          </div>
        )}
      </div>

      {helperText && <HelperText text={helperText} />}
    </S.Container>
  );
}
