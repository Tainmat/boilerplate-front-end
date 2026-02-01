import { css, styled } from "styled-components";

export const Title = styled.div`
  ${(props) => css`
    width: 100%;
    margin-bottom: 1rem;
    text-align: center;
    font-size: ${props.theme.font.size.lg};
    color: ${props.theme.colors.neutral.low.pure};

    /* Mobile pequeno (menor que 480px) */
    @media (max-width: 480px) {
      font-size: ${props.theme.font.size.md};
      margin-bottom: 0.75rem;
    }

    /* Mobile médio (481px até 768px) */
    @media (min-width: 481px) and (max-width: 768px) {
      font-size: ${props.theme.font.size.md};
      margin-bottom: 1.25rem;
    }
  `}
`;
