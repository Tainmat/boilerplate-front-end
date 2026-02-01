import "react-quill/dist/quill.snow.css";

import { Container } from "@shared/components/Core/Form/Fields/InputText/InputText.styles";
import { HelperText } from "@shared/components/Core/Form/HelperText";
import { Label } from "@shared/components/Core/Form/Label";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { useField, useFormikContext } from "formik";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";

interface Props {
  size?: "sm" | "lg";
  name: string;
  label?: string;
  tooltip?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

export function InputRichText({
  size,
  name,
  label,
  tooltip,
  placeholder,
  readOnly,
  disabled,
}: Props) {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [value, setValue] = useState<string>(field.value || "");

  const hasError = !!meta.error && meta.touched;

  const editorRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    if (field.value !== value) {
      setValue(field.value);
    }
  }, [field.value, value]);

  function handleChange(content: string) {
    setValue(content);
    setFieldValue(name, content);
  }

  return (
    <Container
      size={size}
      addonPlacement={undefined} // ReactQuill não usa addon
      hasValue={!!value}
      error={hasError}
      readOnly={readOnly}
      disabled={disabled}
    >
      {label && (
        <Label htmlFor={name} tooltip={tooltip} size={size}>
          {label}
        </Label>
      )}

      {hasError && (
        <div className="icon">
          <Icon size="sm" icon="error_outline" mode="warning" appearance="outlined" />
        </div>
      )}

      <div className="input">
        <ReactQuill
          ref={editorRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder={placeholder}
          style={{
            backgroundColor: readOnly ? "rgba(255, 255, 255, 0.6)" : "transparent",
            minHeight: "150px",
            border: "none",
            fontSize: size === "sm" ? "0.75rem" : "0.875rem",
          }}
        />
      </div>

      {hasError && <HelperText text={meta.error as string} />}
    </Container>
  );
}
