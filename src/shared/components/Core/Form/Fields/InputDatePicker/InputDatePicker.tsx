import { ptBR } from "date-fns/locale/pt-BR";
import { useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";

import { Icon } from "../../../Icons/Icon";
import { HelperText } from "../../HelperText";
import { Label } from "../../Label";
import { Container } from "./InputDatePicker.styles";

registerLocale("ptBR", ptBR);
setDefaultLocale("ptBR");

interface Props {
  size?: "sm" | "lg";
  label: string;
  name: string;
  placeholder?: string;
  value?: Date;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  onChange: (date: Date | null) => void;
}

export function InputDatePicker({
  size,
  label,
  name,
  placeholder,
  value,
  error,
  helperText,
  readOnly,
  onChange,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<Date | null>(value || null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (typeof value !== "undefined") {
      setInputValue(value);
    }
  }, [value]);

  function handleOnChange(date: Date | null) {
    setOpen(false);
    setInputValue(date);
    onChange(date);
  }

  return (
    <Container ref={wrapperRef} size={size} error={error} readOnly={readOnly}>
      <Label htmlFor={name} size={size}>
        {label}
      </Label>

      <DatePicker
        open={open}
        name={name}
        placeholderText={placeholder || "dd/mm/yyyy"}
        selected={inputValue}
        locale="ptBR"
        dateFormat="dd/MM/yyyy"
        readOnly={readOnly}
        onChange={(date) => handleOnChange(date)}
        onInputClick={() => setOpen((open) => !open)}
      />

      <div
        className="icon"
        onClick={() => {
          !readOnly && setOpen((open) => !open);
        }}
        aria-hidden="true"
      >
        <Icon size={`${!size || size === "lg" ? "md" : "sm"}`} icon="date_range" />
      </div>

      {helperText && <HelperText text={helperText} />}
    </Container>
  );
}
