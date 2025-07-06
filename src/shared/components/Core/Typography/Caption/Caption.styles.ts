import styled, { css } from "styled-components";

interface Props {
  size: "sm" | "lg";
  fontWeigth: "bold" | undefined;
}

export const Container = styled.div<Props>`
  ${(props) => css`
    color: ${props.theme.colors.neutral.low.pure};
    font-family: ${props.theme.font.family.highlight};
    font-weight: ${props.theme.font.weight.regular};
    line-height: ${props.theme.line.height.md};

    ${props.fontWeigth === "bold" &&
    css`
      font-weight: ${props.theme.font.weight.bold};
    `}

    ${props.size === "sm" &&
    css`
      font-size: ${props.theme.font.size.xxxs};
    `}

    ${props.size === "lg" &&
    css`
      font-size: ${props.theme.font.size.xs};
    `}
  `}
`;
