import {
  Color,
  List,
  Option,
  Wrapper,
} from "@shared/components/Core/Form/Fields/Select/Options/Options.styles";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { useEffect, useState } from "react";

interface Props {
  size?: "sm" | "lg";
  show: boolean;
  value: string | number;
  options: IOption[] | undefined | null;
  colorMode?: boolean;
  onChange: (option: IOption) => void;
  onClose: () => void;
  resetable?: boolean;
}

export function Options({
  size,
  show,
  value,
  options,
  colorMode,
  onChange,
  onClose,
  resetable,
}: Props) {
  const [visible, setVisible] = useState(false);

  const [selectValue, setSelectValue] = useState<string | number>(value || "");

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (!options) return;

    if (typeof value === "string" || typeof value === "number") {
      const selected = options.find((option) => option.value === value);

      if (selected) {
        setSelectValue(selected.value);
      } else {
        setSelectValue("");
      }
    }
  }, [value, options]);

  function handleOnClick(option: IOption) {
    if (resetable && selectValue === option.value) {
      onChange({ value: "", label: "" });
      setSelectValue("");
    } else {
      onChange(option);
      setSelectValue(option.value);
    }

    setVisible(false);
    onClose();
  }

  return (
    <Wrapper size={size} className={`${visible && "visible"}`}>
      <List>
        {options &&
          options.map((option) => (
            <Option
              key={option.value}
              size={size}
              selected={selectValue === option.value}
              onClick={() => {
                handleOnClick(option);
              }}
            >
              {colorMode ? <Color color={String(option.value)} /> : option.label}
            </Option>
          ))}
      </List>
    </Wrapper>
  );
}
