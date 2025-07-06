import styled, { css } from "styled-components";

interface Props {
  size?: "sm" | "lg";
  readOnly?: boolean;
  disabled?: boolean;
}

export const Wrapper = styled.div`
  position: relative;
`;

export const Container = styled.label<Props>`
  ${(props) => css`
    position: relative;
    user-select: none;

    ${props.size === "sm" &&
    css`
      height: 1.5rem;
      padding-left: 2rem;
    `}

    ${(!props.size || props.size === "lg") &&
    css`
      height: 2.25rem;
      padding-left: 2.75rem;
    `}

    ${!props.readOnly && !props.disabled
      ? css`
          cursor: pointer;
        `
      : css`
          cursor: default;
          pointer-events: none;
        `}

    .description {
      color: ${props.theme.colors.neutral.low.pure};
      font-family: ${props.theme.font.family.base};
      font-weight: ${props.theme.font.weight.regular};

      ${props.size === "sm" &&
      css`
        font-size: ${props.theme.font.size.xxs};
        line-height: ${props.theme.line.height.md};
        top: -1px;
      `}

      ${(!props.size || props.size === "lg") &&
      css`
        font-size: ${props.theme.font.size.xs};
        line-height: ${props.theme.line.height.lg};
        top: 6px;
      `}

      ${props.readOnly &&
      css`
        color: ${props.theme.colors.neutral.low.medium};
      `}

      position: relative;
    }

    input {
      opacity: 0;
      height: 0;
      width: 0;
    }

    .checkmark {
      display: flex;
      align-items: center;

      position: absolute;
      top: 0;
      left: 0;

      span {
        ${(props.readOnly || props.disabled) &&
        css`
          color: ${props.theme.colors.neutral.low.medium};
        `}
      }
    }
  `}
`;
