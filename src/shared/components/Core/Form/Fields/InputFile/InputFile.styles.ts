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

interface DropZoneProps {
  isDragging: boolean;
  hasFile: boolean;
  error?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

export const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !["hasValue", "error", "readOnly", "disabled"].includes(prop),
})<Props>`
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

export const DropZone = styled.div.withConfig({
  shouldForwardProp: (prop) =>
    !["isDragging", "hasFile", "error", "disabled", "readOnly"].includes(prop),
})<DropZoneProps>`
  ${(props) => css`
    position: relative;
    min-height: 120px;
    border: 2px dashed ${props.theme.colors.neutral.low.light};
    border-radius: ${props.theme.border.radius.md};
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: ${rgba(props.theme.colors.neutral.low.pure, 0.02)};

    @media (max-width: 768px) {
      min-height: 100px;
      border-width: 1px;
    }

    ${props.isDragging &&
    css`
      border-color: ${props.theme.colors.feedback.success.pure};
      background-color: ${rgba(props.theme.colors.feedback.success.pure, 0.1)};
      transform: scale(1.02);
    `}

    ${props.error &&
    css`
      border-color: ${props.theme.colors.feedback.warning.pure};
      background-color: ${rgba(props.theme.colors.feedback.warning.pure, 0.05)};
    `}

    ${props.disabled &&
    css`
      opacity: ${props.theme.opacity.level.medium};
      cursor: not-allowed;
    `}

    ${props.readOnly &&
    css`
      cursor: default;
      pointer-events: none;
    `}

    &:hover:not([disabled]) {
      ${!props.error &&
      css`
        border-color: ${props.theme.colors.brand.primary.pure};
        background-color: ${rgba(props.theme.colors.brand.primary.pure, 0.05)};
      `}
    }

    .drop-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1rem;
      height: 100%;
      min-height: 120px;

      @media (max-width: 768px) {
        padding: 1rem 0.5rem;
        min-height: 100px;
      }

      .text {
        margin-top: 1rem;
        text-align: center;

        @media (max-width: 768px) {
          margin-top: 0.5rem;
        }

        .primary {
          display: block;
          font-size: ${props.theme.font.size.sm};
          font-weight: ${props.theme.font.weight.medium};
          color: ${props.theme.colors.neutral.low.pure};
          margin-bottom: 0.5rem;

          @media (max-width: 768px) {
            font-size: ${props.theme.font.size.xs};
          }
        }

        .secondary {
          display: block;
          font-size: ${props.theme.font.size.xxs};
          color: ${props.theme.colors.neutral.low.light};

          @media (max-width: 768px) {
            font-size: 10px;
            line-height: 1.3;
          }
        }
      }
    }

    .error-icon {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
    }
  `}
`;

export const ImagePreview = styled.div.withConfig({
  shouldForwardProp: () => true,
})`
  ${(props) => css`
    position: relative;
    width: 100%;
    height: 120px;
    border-radius: ${props.theme.border.radius.md};
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: ${props.theme.border.radius.md};
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 0.7) 100%
      );
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0.75rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover .overlay {
      opacity: 1;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      font-size: ${props.theme.font.size.xxs};
      font-weight: ${props.theme.font.weight.medium};

      span {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .remove-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s ease;
      color: white;

      &:hover {
        background: rgba(255, 0, 0, 0.7);
      }
    }
  `}
`;
