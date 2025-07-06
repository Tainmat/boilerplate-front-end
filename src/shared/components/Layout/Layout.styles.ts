import styled from "styled-components";

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;

  min-height: 100%;
  width: 100%;
`;

export const Background = styled.div`
  background: ${(props) => props.theme.colors.neutral.high.light};

  position: fixed;
  top: 0;
  left: 0;
  z-index: 990;

  width: 100vw;
  height: 100vh;
`;
