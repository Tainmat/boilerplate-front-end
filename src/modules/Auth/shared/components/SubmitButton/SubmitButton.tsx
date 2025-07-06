import * as S from "@modules/Auth/shared/components/SubmitButton/SubmitButton.styles";

interface Props {
  text: string;
  disabled?: boolean;
  typeButton: "submit" | "button";
  warning?: boolean;
  onClick?: () => void;
}

export function SubmitButton({ text, disabled, typeButton, onClick, warning }: Props) {
  return (
    <>
      {typeButton === "submit" && (
        <S.Button type="submit" disabled={disabled} warning={warning}>
          {text}
        </S.Button>
      )}

      {typeButton === "button" && (
        <S.Button
          type="button"
          disabled={disabled}
          warning={warning}
          onClick={() => onClick && onClick()}
        >
          {text}
        </S.Button>
      )}
    </>
  );
}
