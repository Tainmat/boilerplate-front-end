import styled, { css } from "styled-components";

interface Props {
  size: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "display";
  color?: "primary";
}

export const Container = styled.div<Props>`
  ${(props) => css`
    color: ${props.theme.colors.neutral.low.pure};
    font-family: ${props.theme.font.family.highlight};
    font-weight: ${props.theme.font.weight.bold};
    line-height: ${props.theme.line.height.default};

    .absence {
      color: ${props.theme.colors.feedback.warning.dark};
    }

    ${props.color === "primary" &&
    css`
      color: ${props.theme.colors.neutral.low.light};
    `}

    ${props.size === "xxs" &&
    css`
      font-size: ${props.theme.font.size.xxs};
    `}

    ${props.size === "xs" &&
    css`
      font-size: ${props.theme.font.size.xs};
    `}

    ${props.size === "sm" &&
    css`
      font-size: ${props.theme.font.size.md};

      @media (max-width: 576px) {
        font-size: ${props.theme.font.size.sm};
      }

      @media (min-width: 992px) and (max-width: 1400px) {
        font-size: ${props.theme.font.size.sm};
      }
    `}

    ${props.size === "md" &&
    css`
      font-size: ${props.theme.font.size.lg};

      @media (max-width: 576px) {
        font-size: ${props.theme.font.size.md};
      }
    `}

    ${props.size === "lg" &&
    css`
      font-size: ${props.theme.font.size.xl};

      @media (max-width: 576px) {
        font-size: ${props.theme.font.size.lg};
      }
    `}

    ${props.size === "xl" &&
    css`
      font-size: ${props.theme.font.size.xxl};

      @media (max-width: 576px) {
        font-size: ${props.theme.font.size.lg};
      }

      @media (min-width: 992px) and (max-width: 1400px) {
        font-size: ${props.theme.font.size.xl};
      }
    `}

    ${props.size === "display" &&
    css`
      font-size: ${props.theme.font.size.display};

      @media (max-width: 576px) {
        font-size: ${props.theme.font.size.xxl};
      }
    `}
  `}
`;
