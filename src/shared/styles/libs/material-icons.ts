import { createGlobalStyle, css } from "styled-components";

export default createGlobalStyle`
  ${(props) => css`
    .material-icons {
      font-family: "Material Icons";
      font-weight: normal;
      font-style: normal;
      display: inline-block;
      line-height: ${props.theme.line.height.default};
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
    }

    .material-icons-outlined {
      font-family: "Material Icons Outlined";
      font-weight: normal;
      font-style: normal;
      display: inline-block;
      line-height: ${props.theme.line.height.default};
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
    }

    .material-icons-round {
      font-family: "Material Icons Round";
      font-weight: normal;
      font-style: normal;
      display: inline-block;
      line-height: ${props.theme.line.height.default};
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
    }

    .material-icons-sharp {
      font-family: "Material Icons Sharp";
      font-weight: normal;
      font-style: normal;
      display: inline-block;
      line-height: ${props.theme.line.height.default};
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
    }

    .material-icons-two-tone {
      font-family: "Material Icons Two Tone";
      font-weight: normal;
      font-style: normal;
      display: inline-block;
      line-height: ${props.theme.line.height.default};
      text-transform: none;
      letter-spacing: normal;
      word-wrap: normal;
      white-space: nowrap;
      direction: ltr;
    }
  `}
`;
