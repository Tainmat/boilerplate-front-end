import styled, { css } from "styled-components";

export const Container = styled.div`
  ${(props) => css`
    > * {
      color: ${props.theme.colors.neutral.high.pure};
      opacity: 1;
    }
  `}
`;
