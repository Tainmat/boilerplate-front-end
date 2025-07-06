import styled, { css } from "styled-components";

interface Props {
  size?: "sm" | "lg";
}

export const Container = styled.label<Props>`
  ${(props) => css`
    display: flex;
    align-items: center;

    ${props.size === "sm" &&
    css`
      margin-bottom: 0.125rem;
    `}

    ${(!props.size || props.size === "lg") &&
    css`
      margin-bottom: 0.25rem;
    `}

    > div {
      margin-right: 0.5rem;

      opacity: 1;
    }
  `}
`;
