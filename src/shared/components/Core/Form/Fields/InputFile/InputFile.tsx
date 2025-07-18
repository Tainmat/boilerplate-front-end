import { useRef, useState } from "react";
import { v4 } from "uuid";
import { Container } from "@shared/components/Core/Form/Fields/InputFile/InputFile.styles";
import { HelperText } from "@shared/components/Core/Form/HelperText";
import { Label } from "@shared/components/Core/Form/Label";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { ReactNode } from "react";

interface Props {
  size?: "sm" | "lg";
  label?: string;
  tooltip?: string;
  name: string;
  accept?: string;
  addonText?: string | number | ReactNode;
  addonPlacement?: "left" | "right";
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function InputFile({
  size,
  label,
  tooltip,
  name,
  accept = "image/*",
  addonText,
  addonPlacement,
  error,
  helperText,
  readOnly,
  disabled,
  onChange,
  onBlur,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
    onChange?.(e);
  };

  return (
    <Container
      size={size}
      addonPlacement={addonText ? addonPlacement || "left" : undefined}
      hasValue={!!fileName}
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

        <input
          id={v4()}
          name={name}
          type="file"
          accept={accept}
          disabled={disabled}
          readOnly={readOnly}
          ref={inputRef}
          onChange={handleChange}
          onBlur={onBlur}
        />

        {fileName && (
          <span className="file-name" style={{ marginLeft: "0.5rem", fontSize: "0.9rem" }}>
            {fileName}
          </span>
        )}
      </div>

      {helperText && <HelperText text={helperText} />}
    </Container>
  );
}
