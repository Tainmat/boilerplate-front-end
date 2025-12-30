import { rgba } from "polished";
import styled, { css } from "styled-components";

interface WrapperProps {
  size?: "sm" | "lg";
}

interface OptionProps {
  size?: "sm" | "lg";
  selected: boolean;
}

interface TextProps {
  size?: "sm" | "lg";
}

export const Wrapper = styled.div<WrapperProps>`
  ${(props) => css`
    background-color: ${props.theme.colors.neutral.low.dark};
    border-radius: ${props.theme.border.radius.sm};
    box-shadow: ${props.theme.shadow.level.two};

    position: absolute;
    top: calc(100% + 5px);
    z-index: 1010;

    overflow: hidden;

    min-width: 250px;
    width: 100%;

    &.visible {
      max-height: 15.5rem;

      ul {
        max-height: 15.5rem;
        overflow-y: auto;
        overflow-x: hidden;
        pointer-events: all;
      }

      li {
        height: auto;
        opacity: 1;

        transition: opacity 5ms ease-in;

        & + li {
          border-top-color: ${props.theme.colors.neutral.low.light};
          border-top-style: solid;

          ${props.size === "sm" &&
          css`
            border-top-width: ${props.theme.border.width.hairline};
          `}

          ${(!props.size || props.size === "lg") &&
          css`
            border-top-width: ${props.theme.border.width.thin};
          `}
        }
      }
    }
  `}
`;

export const List = styled.ul`
  ${(props) => css`
    user-select: none;

    max-height: 0;
    pointer-events: none;

    width: 100%;

    transition: max-height 150ms ease-out;

    &::-webkit-scrollbar {
      width: 0.25rem;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
      border-radius: ${props.theme.border.radius.sm};
      margin: 1.35rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${rgba(
        props.theme.colors.neutral.high.pure,
        props.theme.opacity.level.intense,
      )};
      border-radius: ${props.theme.border.radius.sm};
    }

    li {
      height: 0;
    }
  `}
`;

export const Option = styled.li<OptionProps>`
  ${(props) => css`
    ${props.size === "sm" &&
    css`
      padding: 0.75rem 1rem;
    `}

    ${(!props.size || props.size === "lg") &&
    css`
      padding: 1rem 1.5rem;
    `}

    display: flex;
    align-items: center;

    cursor: pointer;
    opacity: 0;

    + li {
      border-top-color: ${props.theme.colors.neutral.low.light};
      border-top-style: solid;
      border-top-width: 2px;
    }

    &:hover {
      background-color: ${rgba(
        props.theme.colors.neutral.low.pure,
        props.theme.opacity.level.intense,
      )};
    }

    & > span {
      color: ${props.theme.colors.neutral.high.pure};
    }

    ${props.selected &&
    css`
      background-color: ${props.theme.colors.neutral.low.medium};
      color: ${props.theme.colors.neutral.high.pure};

      &:hover {
        background-color: ${rgba(
          props.theme.colors.neutral.low.medium,
          props.theme.opacity.level.intense,
        )};
      }
    `}
  `}
`;

export const Text = styled.span<TextProps>`
  ${(props) => css`
    color: ${props.theme.colors.neutral.high.pure};
    font-family: ${props.theme.font.family.base};
    font-weight: ${props.theme.font.weight.regular};
    line-height: ${props.theme.line.height.default};
    margin-left: 0.5rem;
    user-select: none;

    ${props.size === "sm" &&
    css`
      font-size: ${props.theme.font.size.xxs};
    `}

    ${(!props.size || props.size === "lg") &&
    css`
      font-size: ${props.theme.font.size.xs};
    `}
  `}
`;
