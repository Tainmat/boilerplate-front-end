import styled, { css } from "styled-components";

interface Props {
  readOnly?: boolean;
  disabled?: boolean;
}

export const Wrapper = styled.div`
  position: relative;
`;

export const Container = styled.label<Props>`
  ${(props) => css`
    padding-left: 1.5rem;
    position: relative;
    user-select: none;

    ${!props.readOnly && !props.disabled
      ? css`
          cursor: pointer;
        `
      : css`
          cursor: default;
          pointer-events: none;
        `}

    .description {
      color: ${props.theme.colors.neutral.low.pure};
      font-family: ${props.theme.font.family.base};
      font-size: ${props.theme.font.size.xs};
      font-weight: ${props.theme.font.weight.regular};
      line-height: ${props.theme.line.height.sm};

      padding-left: 0.5rem;

      ${props.readOnly &&
      css`
        color: ${props.theme.colors.neutral.low.medium};
      `}
    }

    input {
      opacity: 0;
      height: 0;
      width: 0;
    }

    .checkmark {
      position: absolute;
      top: 0;
      left: 0;

      span {
        ${(props.readOnly || props.disabled) &&
        css`
          color: ${props.theme.colors.neutral.low.medium};
        `}
      }
    }
  `}
`;
