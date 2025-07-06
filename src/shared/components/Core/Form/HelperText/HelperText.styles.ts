import styled, { css } from "styled-components";

export const Container = styled.div`
  ${(props) => css`
    color: ${props.theme.colors.feedback.warning.pure};
    font-family: ${props.theme.font.family.base};
    font-size: 0.875rem;
    font-weight: ${props.theme.font.weight.regular};
    line-height: ${props.theme.line.height.default};
    margin-top: 0.5rem;
  `}
`;
