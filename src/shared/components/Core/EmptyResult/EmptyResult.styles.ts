import styled, { css } from "styled-components";

export const Container = styled.div`
  ${(props) => css`
    background-color: ${props.theme.colors.neutral.high.pure};
    border-radius: ${props.theme.border.radius.md};
    padding: 2.5rem 2rem;
  `}
`;
