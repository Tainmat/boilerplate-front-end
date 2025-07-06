import { rgba } from "polished";
import styled, { css } from "styled-components";

export const Container = styled.div`
  ${(props) => css`
    background-color: ${rgba(
      props.theme.colors.neutral.low.pure,
      props.theme.opacity.level.medium,
    )};

    display: flex;

    height: 100%;
    width: 100%;

    position: fixed;
    top: 0;
    left: 0;
    z-index: ${props.theme.zindex.ten};

    .loader,
    .loader:after {
      border-radius: 50%;
      width: 4rem;
      height: 4rem;
    }

    .loader {
      margin: auto;
      font-size: 10px;
      position: relative;
      text-indent: -9999em;
      border-top: 0.5rem solid
        ${rgba(props.theme.colors.neutral.low.medium, props.theme.opacity.level.intense)};
      border-right: 0.5rem solid
        ${rgba(props.theme.colors.neutral.low.medium, props.theme.opacity.level.intense)};
      border-bottom: 0.5rem solid
        ${rgba(props.theme.colors.neutral.low.medium, props.theme.opacity.level.intense)};
      border-left: 0.5rem solid ${props.theme.colors.neutral.low.dark};
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation: load8 1.1s infinite linear;
      animation: load8 1.1s infinite linear;
    }

    @-webkit-keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

    @keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
  `}
`;
