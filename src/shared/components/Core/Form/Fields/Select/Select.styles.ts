import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  size?: "sm" | "lg";
  error?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  $itemsPerPage?: boolean;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    prop !== "error" && prop !== "readOnly" && prop !== "disabled" && prop !== "$itemsPerPage",
})<Props>`
  ${(props) => css`
    position: relative;
    min-width: 1rem;
    width: 100%;

    ${props.disabled &&
    css`
      opacity: ${props.theme.opacity.level.medium};
    `}

    div.select {
      background-color: transparent;

      border-color: ${props.theme.colors.neutral.low.light};
      border-radius: ${props.theme.border.radius.sm};
      border-style: solid;
      border-width: ${props.theme.border.width.hairline};

      cursor: pointer;

      color: ${props.theme.colors.neutral.low.pure};
      font-family: ${props.theme.font.family.base};
      font-weight: ${props.theme.font.weight.regular};

      span.has-value {
        position: relative;
        display: block;
        padding-right: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        ${props.$itemsPerPage &&
        css`
          padding-right: 0;
        `}
      }

      ${props.size === "sm" &&
      css`
        font-size: ${props.theme.font.size.xxs};
        line-height: ${props.theme.line.height.md};
        height: 2rem;
        padding: 0.5rem 1rem;
      `}

      ${(!props.size || props.size === "lg") &&
      css`
        font-size: ${props.theme.font.size.xs};
        line-height: ${props.theme.line.height.default};
        height: 3rem;
        padding: 0.95rem 1rem;
      `}

      ${props.error &&
      css`
        box-shadow: 0 0px 10px 0 rgba(255, 0, 0, 0.4);
        border-color: ${props.theme.colors.feedback.warning.pure};
      `}

      width: 100%;

      position: relative;

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

      &:hover {
        ${!props.error &&
        !props.disabled &&
        css`
          background-color: ${rgba(
            props.theme.colors.neutral.low.pure,
            props.theme.opacity.level.semitransparent,
          )};
        `}
      }

      & > div {
        & > span {
          color: ${rgba(props.theme.colors.neutral.low.pure, props.theme.opacity.level.semiopaque)};
          font-family: ${props.theme.font.family.base};
          font-weight: ${props.theme.font.weight.regular};

          ${props.size === "sm" &&
          css`
            font-size: ${props.theme.font.size.xxs};
            line-height: ${props.theme.line.height.md};
          `}

          ${(!props.size || props.size === "lg") &&
          css`
            font-size: ${props.theme.font.size.xs};
            line-height: ${props.theme.line.height.default};
          `}

        &.has-value {
            color: ${props.theme.colors.neutral.low.pure};
          }

          ${props.error &&
          css`
            color: ${props.theme.colors.neutral.low.pure};
          `}

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
            width: 100%;

            ${props.$itemsPerPage &&
            css`
              width: 3rem;
            `}

            ${props.size === "sm" &&
            css`
              padding: 0.5rem 1rem;
            `}

            ${(!props.size || props.size === "lg") &&
            css`
              padding: 1rem;
            `}
          }
        }
      }
    }

    div.icon {
      position: absolute;
      right: 1rem;

      ${props.size === "sm" &&
      css`
        top: 0.3125rem;
      `}

      ${(!props.size || props.size === "lg") &&
      css`
        top: 0.75rem;
      `}

      div {
        position: relative;

        &.reset {
          ${props.error &&
          css`
            &:hover {
              cursor: default;
            }
          `}
        }
      }

      ${!props.readOnly &&
      css`
        div {
          &.expand {
            cursor: pointer;

            position: relative;
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
        }
      `}
    }
  `}
`;
