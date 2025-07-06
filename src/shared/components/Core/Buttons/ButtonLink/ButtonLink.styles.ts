import styled, { css } from "styled-components";

interface Props {
  mode?: "light" | "dark";
  size?: "sm" | "md";
  icon?: string;
}

const ButtonStyles = css<Props>`
  ${(props) => css`
    ${props.mode === "light" &&
    css`
      color: ${props.theme.colors.neutral.low.light};
      border-bottom-color: ${props.theme.colors.neutral.low.light};
    `}

    ${props.mode === "dark" &&
    css`
      color: ${props.theme.colors.neutral.low.pure};
      border-bottom-color: ${props.theme.colors.neutral.low.pure};
    `}

    font-family: ${props.theme.font.family.base};
    font-weight: ${props.theme.font.weight.medium};
    line-height: ${props.theme.line.height.default};

    ${props.size === "sm" &&
    css`
      font-size: ${props.theme.font.size.xxs};
      height: 1rem;
    `}

    ${(!props.size || props.size === "md") &&
    css`
      font-size: ${props.theme.font.size.xs};
      height: 1.5rem;
    `}

    &:hover {
      color: ${props.theme.colors.brand.primary.pure};
      border-bottom-color: ${props.theme.colors.brand.primary.pure};
    }

    &:disabled {
      cursor: default;
      opacity: ${props.theme.opacity.level.medium};
    }
  `}
`;

export const Button = styled.button<Props>`
  ${(props) => css`
    background-color: transparent;

    border-top: unset;
    border-left: unset;
    border-right: unset;

    ${!props.icon
      ? css`
          border-bottom-color: ${props.theme.colors.neutral.low.pure};
          border-bottom-style: solid;
          border-bottom-width: ${props.theme.border.width.thin};
        `
      : css`
          display: flex;
          align-items: center;
          border-bottom-color: unset;
          border-bottom-style: unset;
          border-bottom-width: unset;
        `}

    ${ButtonStyles}
  `}
`;

export const LinkButton = styled.a<Props>`
  ${ButtonStyles}

  ${(props) => css`
    border-bottom: solid ${props.theme.border.width.thin};
  `}
`;
