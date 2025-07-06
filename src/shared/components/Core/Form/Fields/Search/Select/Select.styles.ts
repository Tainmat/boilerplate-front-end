import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  error?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

export const Container = styled.div<Props>`
  ${(props) => css`
    position: relative;

    width: 100%;

    ${props.disabled &&
    css`
      opacity: ${props.theme.opacity.level.medium};
    `}

    div.select {
      background-color: transparent;

      border-color: ${props.theme.colors.neutral.low.light};
      border-radius: ${props.theme.border.radius.pill};
      border-style: solid;
      border-width: ${props.theme.border.width.hairline};

      cursor: pointer;

      height: 3rem;
      padding: 0.65rem 2.75rem 0.65rem 1rem;
      width: 100%;

      transition:
        all 0.6s cubic-bezier(0.37, 0, 0.63, 1),
        padding 1ms;

      ${props.readOnly &&
      css`
        background-color: ${rgba(
          props.theme.colors.neutral.low.pure,
          props.theme.opacity.level.semitransparent,
        )};
        border-color: ${rgba(
          props.theme.colors.neutral.low.pure,
          props.theme.opacity.level.medium,
        )};
        color: ${rgba(props.theme.colors.neutral.low.pure, props.theme.opacity.level.semiopaque)};

        cursor: default;
      `}

      ${props.disabled &&
      css`
        cursor: not-allowed;
      `}

      &:hover {
        ${!props.disabled &&
        css`
          background-color: ${rgba(
            props.theme.colors.neutral.low.pure,
            props.theme.opacity.level.semitransparent,
          )};
        `}
      }

      & > span {
        color: ${rgba(props.theme.colors.neutral.low.pure, props.theme.opacity.level.semiopaque)};
        font-family: ${props.theme.font.family.base};
        font-size: ${props.theme.font.size.xs};
        font-weight: ${props.theme.font.weight.medium};
        line-height: ${props.theme.line.height.default};

        &.has-value {
          color: ${props.theme.colors.neutral.low.pure};
        }

        & > input {
          &::placeholder {
            color: ${props.theme.colors.neutral.low.pure};
          }
        }

        ${(!props.readOnly || !props.disabled) &&
        css`
          cursor: default;
          user-select: none;
        `}
      }

      &.search {
        &.open {
          padding: 0;
        }

        span {
          height: 100%;

          input {
            background-color: transparent;
            border: unset;
            height: 100%;
            outline: unset;
            padding: 0.65rem 2.75rem 0.65rem 1rem;
            width: 100%;
          }
        }
      }
    }

    div.icon {
      position: absolute;
      right: 1rem;
      top: 0.75rem;

      transition-duration: 0.6s;
      transition-timing-function: cubic-bezier(0.37, 0, 0.63, 1);

      ${!props.readOnly &&
      css`
        &.expand {
          cursor: pointer;
        }

        &.reset {
          cursor: pointer;

          ${props.error &&
          css`
            &:hover {
              cursor: default;
            }
          `}
        }
      `}
    }
  `}
`;
