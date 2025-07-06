import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  warning?: boolean;
}

export const Button = styled.button<Props>`
  ${(props) => css`
    background-color: ${props.theme.colors.feedback.success.pure};
    border: unset;
    border-radius: 500px;
    color: ${props.theme.colors.neutral.high.pure};
    font-family: ${props.theme.font.family.base};
    font-size: ${props.theme.font.size.xs};
    font-weight: ${props.theme.font.weight.bold};

    padding: 0.75rem;
    text-align: center;
    height: 3rem;
    width: 100%;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;

    &:disabled {
      border: 2px solid ${rgba(props.theme.colors.feedback.success.pure, 0.32)};
      background-color: ${rgba(props.theme.colors.neutral.low.pure, 0.32)};
      color: ${rgba(props.theme.colors.neutral.high.pure, 0.64)};

      cursor: not-allowed;
    }

    ${props.warning &&
    css`
      background-color: #ff2222 !important;
      color: ${props.theme.colors.neutral.high.pure};

      margin-top: 0.5rem;
      margin-bottom: 0.5rem;

      &:hover {
        background-color: #ff0000 !important;
      }
    `}
    
    /* Mobile pequeno (menor que 480px) */
    @media (max-width: 480px) {
      height: 2.75rem;
      font-size: 0.875rem;
      padding: 0.5rem;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    /* Mobile médio (481px até 768px) */
    @media (min-width: 481px) and (max-width: 768px) {
      height: 2.875rem;
      padding: 0.6875rem;
      margin-top: 0.875rem;
      margin-bottom: 0.875rem;
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
  `}
`;
