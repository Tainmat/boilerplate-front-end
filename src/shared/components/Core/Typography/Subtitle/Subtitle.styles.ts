import styled, { css } from "styled-components";

interface Props {
  size: "xs" | "sm" | "lg";
  color?: "neutral" | "warning" | "success" | "primary";
}

export const Container = styled.div<Props>`
  ${(props) => css`
    color: ${props.theme.colors.neutral.low.pure};
    font-family: ${props.theme.font.family.highlight};
    font-weight: ${props.theme.font.weight.medium};
    line-height: ${props.theme.line.height.lg};

    ${props.size === "xs" &&
    css`
      font-size: ${props.theme.font.size.xs};
    `}

    ${props.size === "sm" &&
    css`
      font-size: ${props.theme.font.size.sm};
    `}

    ${props.size === "lg" &&
    css`
      font-size: ${props.theme.font.size.md};
    `}

    ${props.color === "primary" &&
    css`
      color: ${props.theme.colors.neutral.low.light};
    `}
  `}
`;
