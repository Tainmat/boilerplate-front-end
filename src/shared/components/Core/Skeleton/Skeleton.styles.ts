import styled, { css } from "styled-components";

interface Props {
  size?: "sm" | "md" | "lg";
}

export const Container = styled.div<Props>`
  ${(props) => css`
    display: flex;
    align-items: center;

    width: 100%;

    ${props.size === "sm" &&
    css`
      height: 1.5rem;
    `}

    ${(!props.size || props.size === "md") &&
    css`
      height: 2.5rem;
    `}

    ${props.size === "lg" &&
    css`
      height: 3rem;
    `}

    p {
      width: 100%;

      .placeholder {
        border-radius: ${props.theme.border.radius.sm};
        opacity: ${props.theme.opacity.level.semitransparent};

        ${props.size === "sm" &&
        css`
          height: 1rem;
        `}

        ${(!props.size || props.size === "md") &&
        css`
          height: 1.5rem;
        `}

    ${props.size === "lg" &&
        css`
          height: 2.5rem;
        `}
      }
    }
  `}
`;
