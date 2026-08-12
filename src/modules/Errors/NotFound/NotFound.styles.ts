import styled, { css } from "styled-components";

export const Container = styled.main`
  ${(props) => css`
    align-items: center;
    background-color: ${props.theme.colors.neutral.high.pure};
    color: ${props.theme.colors.neutral.low.pure};
    display: flex;
    flex-direction: column;
    font-family: ${props.theme.font.family.base};
    justify-content: center;
    min-height: 100vh;
    padding: ${props.theme.spacing.xs};
    text-align: center;

    img {
      height: auto;
      margin-bottom: ${props.theme.spacing.xxs};
      max-width: 28rem;
      width: 100%;
    }

    h1 {
      font-size: ${props.theme.font.size.lg};
      font-weight: ${props.theme.font.weight.bold};
      line-height: ${props.theme.line.height.md};
      margin: 0 0 ${props.theme.spacing.nano};
    }

    p {
      font-size: ${props.theme.font.size.xs};
      font-weight: ${props.theme.font.weight.regular};
      line-height: ${props.theme.line.height.lg};
      margin: 0 0 ${props.theme.spacing.xxs};
      opacity: ${props.theme.opacity.level.semiopaque};
    }

    @media (max-width: ${props.theme.breakpoints.md}) {
      padding: ${props.theme.spacing.xxs};

      h1 {
        font-size: ${props.theme.font.size.md};
      }
    }
  `}
`;
