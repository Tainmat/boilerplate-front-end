import { rgba } from "polished";
import styled, { css } from "styled-components";

export const Container = styled.div``;

export const Label = styled.div`
  ${(props) => css`
    color: ${props.theme.colors.neutral.low.pure};
    font-family: ${props.theme.font.family.base};
    font-size: ${props.theme.font.size.xs};
    font-weight: ${props.theme.font.weight.bold};
    line-height: ${props.theme.line.height.default};
  `}
`;

export const Value = styled.div`
  ${(props) => css`
    color: ${rgba(props.theme.colors.neutral.low.pure, props.theme.opacity.level.semiopaque)};
    font-family: ${props.theme.font.family.base};
    font-size: ${props.theme.font.size.xs};
    font-weight: ${props.theme.font.weight.regular};
    line-height: ${props.theme.line.height.lg};
  `}
`;
