import styled, { css } from "styled-components";

export const Container = styled.div`
  ${(props) => css`
    background-color: ${props.theme.colors.neutral.high.pure};
    border-radius: ${props.theme.border.radius.md};
    height: 100%;
    max-height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `}
`;
