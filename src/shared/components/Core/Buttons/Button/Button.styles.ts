import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  styles: "primary" | "secondary" | "tertiary";
  mode?: "success" | "helper" | "warning";
  display?: "block";
}

export const Wrapper = styled.div<Props>`
  ${(props) => css`
    ${props.display !== "block" &&
    css`
      width: fit-content;
    `}

    &:focus-within {
      button {
        ${props.styles === "primary" &&
        css`
          &:not([disabled]) {
            ${props.mode === "success" &&
            css`
              background-color: ${rgba(
                props.theme.colors.feedback.success.pure,
                props.theme.opacity.level.semiopaque,
              )};
              color: ${props.theme.colors.neutral.high.pure};
            `}

            ${props.mode === "helper" && css``}

            ${props.mode === "warning" &&
            css`
              background-color: ${rgba(
                props.theme.colors.feedback.warning.pure,
                props.theme.opacity.level.semiopaque,
              )};
            `}

            ${!props.mode &&
            css`
              background-color: ${rgba(
                props.theme.colors.brand.primary.pure,
                props.theme.opacity.level.semiopaque,
              )};
            `}
          }
        `}

        ${props.styles === "secondary" &&
        css`
          &:not([disabled]) {
            ${props.mode === "success" && css``}

            ${props.mode === "helper" && css``}

            ${props.mode === "warning" &&
            css`
              background-color: ${rgba(
                props.theme.colors.feedback.warning.pure,
                props.theme.opacity.level.semitransparent,
              )};
            `}

            ${!props.mode &&
            css`
              background-color: ${rgba(
                props.theme.colors.neutral.low.pure,
                props.theme.opacity.level.semitransparent,
              )};
            `}
          }
        `}

    ${props.styles === "tertiary" &&
        css`
          &:not([disabled]) {
            ${props.mode === "success" && css``}

            ${props.mode === "helper" && css``}

            ${props.mode === "warning" && css``}

            ${!props.mode &&
            css`
              background-color: ${rgba(
                props.theme.colors.neutral.low.pure,
                props.theme.opacity.level.semitransparent,
              )};
            `}
          }
        `}
      }
    }
  `}
`;

export const Container = styled.button<Props>`
  ${(props) => css`
    background-color: transparent;
    border-color: transparent;
    border-radius: ${props.theme.border.radius.sm};
    border-width: ${props.theme.border.width.hairline};

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0 1.5rem;

    height: 2.9375rem;

    ${props.display === "block" &&
    css`
      width: 100%;
    `}

    span {
      margin-right: 0.5rem;
    }

    div {
      font-family: ${props.theme.font.family.base};
      font-size: ${props.theme.font.size.xs};
      font-weight: ${props.theme.font.weight.bold};
      line-height: ${props.theme.line.height.lg};
    }

    transition: background-color 250ms ease;

    ${props.styles === "primary" &&
    css`
      ${props.mode === "success" &&
      css`
        background-color: ${props.theme.colors.feedback.success.pure};
        color: ${props.theme.colors.neutral.high.pure};

        &:hover:not([disabled]) {
          background-color: ${rgba(
            props.theme.colors.feedback.success.pure,
            props.theme.opacity.level.semiopaque,
          )};
        }

        span {
          color: ${props.theme.colors.neutral.high.pure};
        }
      `}

      ${props.mode === "helper" && css``}

      ${props.mode === "warning" &&
      css`
        background-color: ${props.theme.colors.feedback.warning.pure};
        color: ${props.theme.colors.neutral.high.pure};

        span {
          color: ${props.theme.colors.neutral.high.pure};
        }

        &:hover:not([disabled]) {
          background-color: ${rgba(
            props.theme.colors.feedback.warning.pure,
            props.theme.opacity.level.semiopaque,
          )};
        }
      `}

      ${!props.mode &&
      css`
        background-color: ${props.theme.colors.brand.primary.pure};
        color: ${props.theme.colors.neutral.high.pure};

        span {
          color: ${props.theme.colors.neutral.high.pure};
        }

        &:hover:not([disabled]) {
          background-color: ${rgba(
            props.theme.colors.brand.primary.pure,
            props.theme.opacity.level.semiopaque,
          )};
        }
      `}
    `}

    ${props.styles === "secondary" &&
    css`
      ${props.mode === "success" && css``}

      ${props.mode === "helper" && css``}

      ${props.mode === "warning" &&
      css`
        border-color: ${props.theme.colors.feedback.warning.pure};
        color: ${props.theme.colors.feedback.warning.pure};

        span {
          color: ${props.theme.colors.feedback.warning.pure};
        }

        &:hover:not([disabled]) {
          background-color: ${rgba(
            props.theme.colors.feedback.warning.pure,
            props.theme.opacity.level.semitransparent,
          )};
        }
      `}

      ${!props.mode &&
      css`
        border-color: ${props.theme.colors.neutral.low.pure};
        color: ${props.theme.colors.neutral.low.pure};

        span {
          color: ${props.theme.colors.neutral.low.pure};
        }

        &:hover:not([disabled]) {
          background-color: ${rgba(
            props.theme.colors.neutral.low.pure,
            props.theme.opacity.level.semitransparent,
          )};
        }
      `}

      &:disabled {
        border-color: transparent;
      }
    `}

    ${props.styles === "tertiary" &&
    css`
      color: ${props.theme.colors.neutral.low.pure};

      &:hover:not([disabled]) {
        background-color: ${rgba(
          props.theme.colors.neutral.low.pure,
          props.theme.opacity.level.semitransparent,
        )};
      }
    `}

    &:focus {
      outline: unset;
    }

    &:disabled {
      background-color: ${rgba(
        props.theme.colors.neutral.low.pure,
        props.theme.opacity.level.semitransparent,
      )};
      color: ${props.theme.colors.neutral.low.pure};

      cursor: not-allowed;

      span,
      div {
        color: ${props.theme.colors.neutral.low.pure};
        opacity: ${props.theme.opacity.level.medium};
      }
    }
  `}
`;
