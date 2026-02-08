import styled, { css } from "styled-components";

interface Props {
  $hasMessages: boolean;
}

export const Container = styled.div<Props>`
  ${(props) => css`
    position: absolute;
    right: 0;
    top: 0;

    padding: 2rem;

    overflow: hidden;
    z-index: ${props.theme.zindex.ten};
    max-height: 100vh;

    @media (max-width: 480px) and (orientation: portrait) {
      left: 0;
      right: 0;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    ${!props.$hasMessages &&
    css`
      display: none;
    `}
  `}
`;
