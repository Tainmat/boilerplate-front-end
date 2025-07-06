import styled, { css } from "styled-components";

interface Props {
  size: "xs" | "sm" | "lg";
  color?: "neutral" | "warning" | "success" | "primary";
}

export const Container = styled.div<Props>`
  ${(props) => css`
    color: ${props.theme.colors.neutral.low.pure};
    font-family: ${props.theme.font.family.base};
    font-weight: ${props.theme.font.weight.regular};
    opacity: ${props.theme.opacity.level.semiopaque};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;

    &.absence {
      color: ${props.theme.colors.feedback.warning.pure};
      font-weight: ${props.theme.font.weight.bold};
    }

    ${props.size === "xs" &&
    css`
      font-size: 0.85rem;
      line-height: ${props.theme.line.height.lg};
    `}

    ${props.size === "sm" &&
    css`
      font-size: ${props.theme.font.size.xs};
      line-height: ${props.theme.line.height.lg};
    `}

    ${props.size === "lg" &&
    css`
      font-size: ${props.theme.font.size.sm};
      line-height: ${props.theme.line.height.sm};
    `}

    ${props.color === "warning" &&
    css`
      color: ${props.theme.colors.feedback.warning.pure};
    `}

    ${props.color === "success" &&
    css`
      color: ${props.theme.colors.feedback.success.pure};
    `}

    ${props.color === "primary" &&
    css`
      color: ${props.theme.colors.neutral.low.light};
    `}
  `}
`;
