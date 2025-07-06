import styled, { css } from "styled-components";

interface Props {
  size?: "sm" | "md" | "lg";
}

export const Container = styled.div<Props>`
  ${(props) => css`
    background-color: ${props.theme.colors.neutral.high.pure};
    border-radius: ${props.theme.border.radius.md};
    min-height: calc(100vh - 9rem);
    height: auto;
    overflow: visible;
    transition: padding 0.3s ease, border-radius 0.3s ease;

    ${props.size === "sm" &&
    css`
      padding: 1rem 0.75rem;
    `}
    ${(!props.size || props.size === "md") &&
    css`
      padding: 2rem 1.5rem;
    `}
      ${props.size === "lg" &&
    css`
      padding: 2.5rem 2rem;
    `};

    /* Mobile */
    @media (max-width: 767px) {
      min-height: calc(100vh - 6rem);
      height: auto;
      border-radius: ${props.theme.border.radius.sm};

      ${props.size === "sm" &&
      css`
        padding: 0.75rem 0.5rem;
      `}
      ${(!props.size || props.size === "md") &&
      css`
        padding: 1rem 0.75rem;
      `}
        ${props.size === "lg" &&
      css`
        padding: 1.5rem 1rem;
      `};
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      min-height: calc(100vh - 6.5rem);
      height: auto;

      ${props.size === "sm" &&
      css`
        padding: 0.875rem 0.625rem;
      `}
      ${(!props.size || props.size === "md") &&
      css`
        padding: 1.5rem 1.125rem;
      `}
        ${props.size === "lg" &&
      css`
        padding: 2rem 1.5rem;
      `};
    }
  `}
`;