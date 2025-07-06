import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  $error?: boolean;
}

export const Container = styled.div<Props>`
  ${(props) => css`
    position: relative;
    width: 100%;
    margin-bottom: 1.25rem;

    div.icon {
      user-select: none;
      position: absolute;
      left: 0.25rem;
      top: 0.5rem;
      
      /* Mobile pequeno (menor que 480px) */
      @media (max-width: 480px) {
        top: 0.375rem;
      }
    }

    .input {
      position: relative;

      input::-ms-reveal,
      input::-ms-clear {
        display: none;
      }

      input {
        background: transparent;

        padding-left: 2.25rem;
        padding-right: 0.5rem;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        height: 3rem;
        width: 100%;

        border: none;
        border-bottom: ${(props) => props.theme.colors.neutral.low.medium} solid
          ${(props) => props.theme.border.width.hairline};

        color: ${props.theme.colors.neutral.low.pure};
        font-family: ${props.theme.font.family.base};
        font-size: ${props.theme.font.size.xs};
        font-weight: ${props.theme.font.weight.regular};

        transition-property: background-color, border-color;
        transition-duration: 0.6s;
        transition-timing-function: cubic-bezier(0.37, 0, 0.63, 1);

        ${props.$error &&
        css`
          border-color: ${props.theme.colors.feedback.helper.pure};
        `}

        &::placeholder {
          color: ${props.theme.colors.neutral.low.light};
        }
        
        /* Mobile pequeno (menor que 480px) */
        @media (max-width: 480px) {
          height: 2.75rem;
          font-size: 0.875rem;
          padding-top: 0.625rem;
          padding-bottom: 0.625rem;
        }
        
        /* Mobile médio (481px até 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
          height: 2.875rem;
          padding-top: 0.6875rem;
          padding-bottom: 0.6875rem;
        }

        &:hover:not([disabled]) {
          ${props.$error
            ? css`
                border-color: ${props.theme.colors.feedback.helper.pure};
              `
            : css`
                background-color: ${rgba(
                  props.theme.colors.neutral.low.pure,
                  props.theme.opacity.level.semitransparent,
                )};
              `}
        }

        &:focus-visible {
          outline: none;
          color: ${props.theme.colors.neutral.low.pure};
        }
      }

      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
        box-shadow: 0 0 0px 1000px transparent inset !important;
        -webkit-text-fill-color: ${props.theme.colors.neutral.low.pure} !important;
        background-color: transparent !important;
        caret-color: ${props.theme.colors.neutral.low.pure};
        transition: background-color 5000s ease-in-out 0s;
      }

      /* Mobile pequeno (menor que 480px) */
      @media (max-width: 480px) {
        height: 2.75rem;
        font-size: ${props.theme.font.size.xxs};
      }

      /* Mobile médio (481px até 768px) */
      @media (min-width: 481px) and (max-width: 768px) {
        height: 2.875rem;
      }

      div.show-password {
        cursor: pointer;
        user-select: none;
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        
        /* Mobile pequeno (menor que 480px) */
        @media (max-width: 480px) {
          top: 0.375rem;
        }
        
        /* Mobile médio (481px até 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
          top: 0.4375rem;
        }

        /* Mobile pequeno (menor que 480px) */
        @media (max-width: 480px) {
          top: -0.125rem;
        }

        /* Mobile médio (481px até 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
          top: -0.0625rem;
        }
      }
    }
  `}
`;
