import { createGlobalStyle, css } from "styled-components";

export default createGlobalStyle`
  ${(props) => css`
    .custom-tooltip {
      background-color: ${props.theme.colors.neutral.low.dark} !important;
      border-radius: ${props.theme.border.radius.sm} !important;
      color: ${props.theme.colors.neutral.high.pure} !important;
      font-family: ${props.theme.font.family.base} !important;
      font-size: ${props.theme.font.size.xxs} !important;
      font-weight: ${props.theme.font.weight.regular} !important;
      line-height: ${props.theme.line.height.md} !important;

      padding: 1rem !important;

      z-index: ${props.theme.zindex.ten} !important;
    }
  `}
`;
