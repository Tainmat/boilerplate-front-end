import styled, { css } from "styled-components";

export const Container = styled.div`
  ${(props) => css`
    background-color: ${props.theme.colors.neutral.high.pure};
    border-radius: ${props.theme.border.radius.md};
    padding: 2.5rem 2rem;

    @media (max-width: 768px) {
      padding: 1.5rem 1rem;
      border-radius: ${props.theme.border.radius.sm};
    }

    @media (max-width: 480px) {
      padding: 1.25rem 0.75rem;
    }
  `}
`;
