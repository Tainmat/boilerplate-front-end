import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

import { Caption } from "../../../Typography/Caption";
import { HelperText } from "../../HelperText";
import { Label } from "../../Label";
import * as S from "./TextArea.styles";

interface Props {
  label?: string;
  name: string;
  placeholder?: string;
  initialValue?: string;
  value?: string;
  maxlength: number;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export function TextArea({
  label,
  name,
  placeholder,
  initialValue,
  value,
  maxlength,
  error,
  helperText,
  readOnly,
  disabled,
  onChange,
  onBlur,
}: Props) {
  const textAreaField = useRef<HTMLTextAreaElement | null>(null);

  const [textAreaValue, setTextAreaValue] = useState(initialValue || "");

  useEffect(() => {
    typeof value === "string" && setTextAreaValue(value);
  }, [value]);

  function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange && onChange(e);

    setTextAreaValue(e.target.value);
  }

  return (
    <S.Container hasValue={!!textAreaValue} error={error} readOnly={readOnly} disabled={disabled}>
      <div className="text-area">
        {label && <Label htmlFor={name}>{label}</Label>}

        <textarea
          id={v4()}
          name={name}
          value={textAreaValue}
          placeholder={placeholder}
          maxLength={maxlength}
          readOnly={readOnly}
          disabled={disabled}
          onChange={handleOnChange}
          onBlur={onBlur}
          ref={textAreaField}
          autoComplete="one-time-code"
        />
      </div>

      <S.Footer error={error} readOnly={readOnly} disabled={disabled}>
        {helperText && <HelperText text={helperText} error={error} />}
        <Caption size="sm" className={textAreaValue.length === maxlength ? "text-area-size" : ""}>
          {textAreaValue.length}/{maxlength}
        </Caption>
      </S.Footer>
    </S.Container>
  );
}
