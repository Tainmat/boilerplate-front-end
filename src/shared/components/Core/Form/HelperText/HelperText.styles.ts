import styled, { css } from "styled-components";

export const Container = styled.div<{ $error?: boolean }>`
  ${(props) => css`
    color: ${props.$error
      ? props.theme.colors.feedback.warning.pure
      : props.theme.colors.neutral.low.light};
    font-family: ${props.theme.font.family.base};
    font-size: 0.875rem;
    font-weight: ${props.theme.font.weight.regular};
    line-height: ${props.theme.line.height.default};
    margin-top: 0.5rem;
  `}
`;
