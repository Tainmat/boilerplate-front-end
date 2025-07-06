import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  readOnly?: boolean;
  disabled?: boolean;
}

export const Container = styled.div<Props>`
  ${(props) => css`
    position: relative;
    width: 100%;

    input {
      background-color: transparent;

      border-color: ${props.theme.colors.neutral.low.light};
      border-radius: ${props.theme.border.radius.pill};
      border-style: solid;
      border-width: ${props.theme.border.width.hairline};

      color: ${props.theme.colors.neutral.low.pure};
      font-family: ${props.theme.font.family.base};
      font-size: ${props.theme.font.size.xs};
      font-weight: ${props.theme.font.weight.medium};
      line-height: ${props.theme.line.height.default};

      height: 3rem;
      padding: 0.5rem 2.75rem;
      width: 100%;

      transition-duration: 0.6s;
      transition-property: background-color;
      transition-timing-function: cubic-bezier(0.37, 0, 0.63, 1);

      &:hover:not([disabled]) {
        background-color: ${rgba(
          props.theme.colors.neutral.low.pure,
          props.theme.opacity.level.semitransparent,
        )};

        &::placeholder {
          color: ${props.theme.colors.neutral.low.pure};
        }
      }

      &:focus-visible {
        outline: none;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: ${props.theme.opacity.level.medium};
      }

      ${(props.readOnly || props.disabled) &&
      css`
        cursor: default;
        pointer-events: none;
      `}
    }

    div {
      user-select: none;

      height: 24px;
      width: 24px;

      position: absolute;
      top: 0.75rem;

      &.search {
        left: 1rem;
      }

      &.reset {
        cursor: pointer;
        right: 1rem;
      }

      ${props.disabled &&
      css`
        opacity: ${props.theme.opacity.level.medium};
      `}
    }
  `}
`;
