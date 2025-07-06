import { rgba } from "polished";
import styled, { css } from "styled-components";

export const Container = styled.div`
  ${(props) => css`
    background-color: ${rgba(
      props.theme.colors.neutral.high.dark,
      props.theme.opacity.level.intense,
    )};
    border-radius: ${props.theme.border.radius.md};
    box-shadow: ${props.theme.shadow.level.one};
    margin-bottom: 1.5rem;
    padding: 1.25rem;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    /* Ensure text truncation works inside cards */
    p, h1, h2, h3, h4, h5, h6, div:not(.d-flex) {
      max-width: 100%;
    }
    
    /* Mobile */
    @media (max-width: 767px) {
      padding: 1rem;
      margin-bottom: 1rem;
    }
  `}
`;
