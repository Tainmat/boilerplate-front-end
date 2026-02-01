import { Options } from "@shared/components/Core/Form/Fields/Select/Options";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Container } from "@shared/components/Core/Form/Fields/Select/Select.styles";
import { HelperText } from "@shared/components/Core/Form/HelperText";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { useEffect, useRef, useState } from "react";

interface Props {
  placeholder?: string;
  options: IOption[] | undefined | null;
  initialValue?: string | number;
  value?: string | number;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  disabled?: boolean;
  onChange: (option: IOption) => void;
  onReset?: () => void;
}

export function SelectSearch({
  placeholder,
  options,
  initialValue,
  value,
  error,
  helperText,
  readOnly,
  disabled,
  onChange,
  onReset,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchField = useRef<HTMLInputElement | null>(null);

  const [selectValue, setSelectValue] = useState<string | number>(initialValue || "");
  const [selectLabel, setSelectLabel] = useState("");

  const [filter, setFilter] = useState("");

  const [isShowingOptions, setIsShowingOptions] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsShowingOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (!isShowingOptions) {
      setFilter("");
      return;
    }

    searchField.current?.focus();
  }, [isShowingOptions]);

  useEffect(() => {
    if ((typeof initialValue === "string" || typeof initialValue === "number") && options) {
      const selected = options.find((option) => option.value === initialValue);

      if (selected) {
        setSelectValue(selected.value);
        setSelectLabel(selected.label);
      }
    }
  }, [initialValue, options]);

  useEffect(() => {
    if ((typeof value === "string" || typeof value === "number") && options) {
      const selected = options.find((option) => option.value === value);

      if (selected) {
        setSelectValue(selected.value);
        setSelectLabel(selected.label);
      } else {
        setSelectValue("");
        setSelectLabel("");
      }
    }
  }, [value, options]);

  function handleOnReset() {
    setSelectValue("");
    setSelectLabel("");

    setIsShowingOptions(false);

    onReset && onReset();
  }

  function handleIcon() {
    if (readOnly || disabled) {
      return (
        <div className="icon expand" style={{ cursor: "no-drop" }}>
          <Icon size="md" icon="expand_more" mode="primary" />
        </div>
      );
    }

    if (selectValue && !isShowingOptions && onReset) {
      return (
        <div className="icon reset" onClick={handleOnReset} aria-hidden="true">
          <Icon size="md" icon="close" mode="primary" />
        </div>
      );
    }

    if (isShowingOptions) {
      return (
        <div className="icon search">
          <Icon size="md" icon="search" mode="primary" />
        </div>
      );
    }

    return (
      <div className="icon expand" onClick={() => setIsShowingOptions(true)} aria-hidden="true">
        <Icon
          size="md"
          icon={`${isShowingOptions ? "expand_less" : "expand_more"}`}
          mode="primary"
        />
      </div>
    );
  }

  return (
    <Container ref={wrapperRef} error={error} readOnly={readOnly} disabled={disabled}>
      <div
        className={`select search ${isShowingOptions ? "open" : ""}`}
        onClick={() => {
          if (!readOnly && !disabled) {
            if (!isShowingOptions) {
              setIsShowingOptions((isShowing) => !isShowing);
            }
          }
        }}
        aria-hidden="true"
      >
        {isShowingOptions ? (
          <span>
            <input
              ref={searchField}
              value={filter}
              placeholder={!isShowingOptions ? selectLabel || placeholder : ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;

                setFilter(value);
              }}
            />
          </span>
        ) : (
          <span className={`${selectLabel ? "has-value" : ""}`}>{selectLabel || placeholder}</span>
        )}
      </div>

      <Options
        show={isShowingOptions}
        value={selectValue}
        options={
          !filter
            ? options
            : options?.filter(function (option) {
                return option.label
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .includes(
                    filter
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, ""),
                  );
              })
        }
        onChange={(option) => {
          setSelectValue(option.value);
          setSelectLabel(option.label);

          setFilter("");

          setIsShowingOptions(false);

          onChange(option);
        }}
        onClose={() => setIsShowingOptions(false)}
      />

      {handleIcon()}

      {helperText && <HelperText text={helperText} error={error} />}
    </Container>
  );
}
