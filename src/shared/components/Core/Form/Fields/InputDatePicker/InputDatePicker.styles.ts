import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  size?: "sm" | "lg";
  error?: boolean;
  readOnly?: boolean;
}

export const Container = styled.div<Props>`
  ${(props) => css`
    position: relative;
    width: 100%;

    input {
      background-color: transparent;

      border-color: ${props.theme.colors.neutral.low.light};
      border-radius: ${props.theme.border.radius.sm};
      border-style: solid;
      border-width: ${props.theme.border.width.hairline};

      color: ${props.theme.colors.neutral.low.pure};
      font-family: ${props.theme.font.family.base};
      font-weight: ${props.theme.font.weight.regular};

      ${props.size === "sm" &&
      css`
        font-size: ${props.theme.font.size.xxs};
        line-height: ${props.theme.line.height.md};
        height: 2rem;
        padding: 0.5rem 1rem;
      `}

      ${(!props.size || props.size === "lg") &&
      css`
        font-size: ${props.theme.font.size.xs};
        line-height: ${props.theme.line.height.default};
        height: 3rem;
        padding: 1rem;
      `}

      cursor: pointer;

      width: 100%;

      transition-duration: 0.6s;
      transition-timing-function: cubic-bezier(0.37, 0, 0.63, 1);

      ${props.error &&
      css`
        background-color: ${props.theme.colors.feedback.helper.light};
        border-color: ${props.theme.colors.feedback.helper.pure};
      `}

      &::placeholder {
        color: ${rgba(props.theme.colors.neutral.low.pure, props.theme.opacity.level.semiopaque)};
      }

      &:read-only {
        background-color: ${rgba(
          props.theme.colors.neutral.low.pure,
          props.theme.opacity.level.semitransparent,
        )};
        border-color: ${rgba(
          props.theme.colors.neutral.low.pure,
          props.theme.opacity.level.medium,
        )};
        color: ${rgba(props.theme.colors.neutral.low.pure, props.theme.opacity.level.semiopaque)};
      }

      &:hover:not([disabled]) {
        ${props.error
          ? css`
              background-color: ${props.theme.colors.feedback.helper.light};
              border-color: ${props.theme.colors.feedback.helper.pure};
            `
          : css`
              background-color: ${rgba(
                props.theme.colors.neutral.low.pure,
                props.theme.opacity.level.semitransparent,
              )};

              &::placeholder {
                color: ${props.theme.colors.neutral.low.pure};
              }
            `}
      }

      &:focus-visible {
        outline: none;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: ${props.theme.opacity.level.medium};
      }

      &:read-only {
        cursor: default;
        pointer-events: none;
      }

      ${props.readOnly &&
      css`
        cursor: default;
        pointer-events: none;
      `}
    }

    div.icon {
      ${props.readOnly
        ? css`
            cursor: default;
          `
        : css`
            cursor: pointer;
          `}

      position: absolute;
      right: 1rem;

      ${props.size === "sm" &&
      css`
        top: 1.55rem;
      `}

      ${(!props.size || props.size === "lg") &&
      css`
        top: 2rem;
      `}
    }
  `}
`;
