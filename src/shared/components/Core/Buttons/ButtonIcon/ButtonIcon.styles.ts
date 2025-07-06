import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  size: "sm" | "md" | "lg";
  mode?: "success" | "warning" | "helper";
}

export const Wrapper = styled.div<Props>`
  ${(props) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    ${props.size === "sm" &&
    css`
      height: 2.5rem;
      width: 2.5rem;
    `}

    ${props.size === "md" &&
    css`
      height: 3rem;
      width: 3rem;
    `}

    ${props.size === "lg" &&
    css`
      height: 3.5rem;
      width: 3.5rem;
    `}

    button {
      &::after {
        border-radius: ${props.theme.border.radius.circular};
        content: "";
        position: absolute;
        transition: all 250ms ease;

        ${props.size === "sm" &&
        css`
          height: 2.5rem;
          width: 2.5rem;
        `}

        ${props.size === "md" &&
        css`
          height: 3rem;
          width: 3rem;
        `}

        ${props.size === "lg" &&
        css`
          height: 3.5rem;
          width: 3.5rem;
        `}
      }

      &:hover:not([disabled]) {
        &::after {
          background-color: ${rgba(
            props.theme.colors.neutral.low.pure,
            props.theme.opacity.level.semitransparent,
          )};
          border-radius: ${props.theme.border.radius.circular};
        }
      }
    }
  `}
`;

export const Button = styled.button`
  ${(props) => css`
    background-color: transparent;
    border-radius: ${props.theme.border.radius.circular};
    border-width: ${props.theme.border.width.none};

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    outline: unset;

    &:disabled {
      cursor: not-allowed;
      opacity: ${props.theme.opacity.level.medium};
    }
  `}
`;
