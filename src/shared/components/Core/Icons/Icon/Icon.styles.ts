import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  size?: "xs" | "sm" | "md" | "lg";
  mode?: "success" | "helper" | "warning" | "light" | "primary" | "neutral";
  disabled?: boolean;
}

export const Container = styled.span<Props>`
  ${(props) => css`
    user-select: none;

    ${props.size === "xs" &&
    css`
      font-size: 0.875rem;
      height: 0.875rem;
      width: 0.875rem;
    `}

    ${props.size === "sm" &&
    css`
      font-size: 1rem;
      height: 1rem;
      width: 1rem;
    `}

    ${props.size === "sm" &&
    css`
      font-size: 1.3125rem;
      height: 1.3125rem;
      width: 1.3125rem;
    `}

    ${(!props.size || props.size === "md") &&
    css`
      font-size: 1.5rem;
      height: 1.5rem;
      width: 1.5rem;
    `}

    ${props.size === "lg" &&
    css`
      font-size: 2.25rem;
      height: 2.25rem;
      width: 2.25rem;
    `}

    ${props.disabled
      ? css`
          color: ${rgba(props.theme.colors.neutral.low.pure, props.theme.opacity.level.light)};
        `
      : css`
          ${props.mode === "success" &&
          css`
            color: ${props.theme.colors.feedback.success.pure};
          `}

          ${props.mode === "helper" &&
          css`
            color: ${props.theme.colors.feedback.helper.pure};
          `}

          ${props.mode === "light" &&
          css`
            color: ${props.theme.colors.neutral.high.pure};
          `}

          ${props.mode === "primary" &&
          css`
            color: ${props.theme.colors.neutral.low.light};
          `}

          

          ${props.mode === "warning" &&
          css`
            color: ${props.theme.colors.feedback.warning.pure};
          `}

          ${!props.mode &&
          css`
            color: ${props.theme.colors.neutral.low.pure};
          `}
        `}
  `}
`;
