import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  size?: "sm" | "lg";
  addonPlacement: "left" | "right" | undefined;
  hasValue: boolean;
  error?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

export const Container = styled.div<Props>`
  ${(props) => css`
    position: relative;
    width: 100%;

    div.icon {
      user-select: none;
      position: absolute;
      right: 1.15rem;
      top: 2rem;
    }

    .input {
      position: relative;

      ${props.disabled &&
      css`
        opacity: ${props.theme.opacity.level.medium};
      `}

      input::-ms-reveal,
      input::-ms-clear {
        display: none;
      }

      input {
        background-color: transparent;

        border-color: ${props.theme.colors.neutral.low.light};
        border-radius: ${props.theme.border.radius.sm};
        border-style: solid;
        border-width: ${props.theme.border.width.hairline};

        color: ${props.theme.colors.neutral.low.pure};
        font-family: ${props.theme.font.family.base};
        font-size: ${props.theme.font.size.xs};
        font-weight: ${props.theme.font.weight.regular};

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

          ${!props.addonPlacement &&
          css`
            padding: 1rem;
          `}

          ${props.addonPlacement === "left" &&
          css`
            padding: 1rem 1rem 1rem 5rem;
          `}

          ${props.addonPlacement === "right" &&
          css`
            padding: 1rem 5rem 1rem 1rem;
          `}
        `}

        width: 100%;

        transition-property: background-color, border-color;
        transition-duration: 0.6s;
        transition-timing-function: cubic-bezier(0.37, 0, 0.63, 1);

        ${props.error &&
        css`
          box-shadow: 0 0px 10px 0 rgba(255, 0, 0, 0.4);
          border-color: ${props.theme.colors.feedback.warning.pure};
        `}

        &::placeholder {
          font-size: ${props.theme.font.size.xxs};
          color: ${props.theme.colors.neutral.low.light};
        }

        &:read-only {
          background-color: ${rgba(
            props.theme.colors.neutral.low.pure,
            props.theme.opacity.level.semitransparent,
          )};
          border-color: ${rgba(
            props.theme.colors.neutral.low.pure,
            props.theme.opacity.level.medium,
          )};
          color: ${rgba(props.theme.colors.neutral.low.pure, props.theme.opacity.level.semiopaque)};
        }

        &:hover:not([disabled]) {
          ${props.error
            ? css`
                box-shadow: 0 0px 10px 0 rgba(255, 0, 0, 0.4);
                border-color: ${props.theme.colors.feedback.warning.pure};
              `
            : css`
                background-color: ${rgba(
                  props.theme.colors.neutral.low.pure,
                  props.theme.opacity.level.semitransparent,
                )};

                &::placeholder {
                  color: ${props.theme.colors.neutral.low.light};
                }
              `}
        }

        &:focus-visible {
          outline: none;
        }

        &:disabled {
          cursor: not-allowed;
        }

        ${(props.readOnly || props.disabled) &&
        css`
          cursor: default;
          pointer-events: none;
        `}
      }

      div.addon {
        background-color: ${rgba(
          props.theme.colors.neutral.low.pure,
          props.readOnly ? props.theme.opacity.level.medium : 1,
        )};
        color: ${props.theme.colors.neutral.high.pure};

        font-weight: ${props.theme.font.weight.bold};

        display: flex;
        align-items: center;
        justify-content: center;

        height: 3rem;
        width: 4rem;

        position: absolute;
        top: 0;

        ${props.addonPlacement === "left" &&
        css`
          border-top-left-radius: ${props.theme.border.radius.sm};
          border-bottom-left-radius: ${props.theme.border.radius.sm};
        `}

        ${props.addonPlacement === "right" &&
        css`
          border-top-right-radius: ${props.theme.border.radius.sm};
          border-bottom-right-radius: ${props.theme.border.radius.sm};
        `}

        > span, div {
          color: ${props.theme.colors.neutral.high.pure};
        }
      }

      div.show-password {
        cursor: pointer;
        user-select: none;
        position: absolute;
        right: 1rem;
        top: 0.75rem;
      }
    }
  `}
`;
