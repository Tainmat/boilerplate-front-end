import { useEffect, useState } from "react";

import { IMultiSelectOption } from "../MultiSelect.interface";

import { Icon } from "@/shared/components/Core/Icons/Icon";
import { List, Option, Text, Wrapper } from "./Options.styles";

interface Props {
  size?: "sm" | "lg";
  show: boolean;
  value: string[];
  options: IMultiSelectOption[];
  onChange: (options: IMultiSelectOption[]) => void;
  onClose: () => void;
}

export function Options({ size, show, value, options, onChange, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  const [selectValue, setSelectValue] = useState<string[]>(value || []);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (value) {
      setSelectValue(value);
    }
  }, [value]);

  function handleOnClick(option: IMultiSelectOption) {
    if (selectValue.includes(option.value)) {
      const newSelectValue = selectValue.filter((v) => v !== option.value);

      setSelectValue(newSelectValue);

      const selectedOptions = options.filter((item) => newSelectValue.includes(item.value));

      onChange(selectedOptions);
    } else {
      const newSelectValue = [...selectValue, option.value];

      setSelectValue(newSelectValue);

      const selectedOptions = options.filter((item) => newSelectValue.includes(item.value));

      onChange(selectedOptions);
    }

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
              selected={selectValue.includes(option.value)}
              onClick={() => {
                handleOnClick(option);
              }}
            >
              <Icon
                size="sm"
                icon={selectValue.includes(option.value) ? "check_box" : "check_box_outline_blank"}
              />

              <Text size={size}>{option.label}</Text>
            </Option>
          ))}
      </List>
    </Wrapper>
  );
}
