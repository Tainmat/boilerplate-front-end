import styled, { css } from "styled-components";

interface Props {
  $isSmartphone?: boolean;
}

export const MainContainer = styled.div`
  background-image: linear-gradient(321.77deg, rgba(181, 219, 156, 0.85) 5.96%, #f5f5f5 114.96%);
  background-size: cover;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden !important;

  /* Mobile pequeno (menor que 480px) */
  @media (max-width: 480px) {
    background-image: none;
    background-color: ${props => props.theme.colors.neutral.high.pure};
    padding: 0;
  }
`;

export const LoginContainer = styled.div<Props>`
  ${(props) => css`
    background-color: ${props.theme.colors.neutral.high.pure};
    height: auto !important;
    max-height: 100vh !important;
    overflow: hidden !important;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${props.theme.border.radius.lg};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

    ${!props.$isSmartphone &&
    css`
      min-width: 420px;
    `}

    /* Mobile pequeno (menor que 480px) */
    @media (max-width: 480px) {
      width: 100%;
      height: 100%;
      border-radius: 0;
      box-shadow: none;
    }

    /* Mobile médio (481px até 768px) */
    @media (min-width: 481px) and (max-width: 768px) {
      width: 90%;
      max-width: 450px;
      border-radius: ${props.theme.border.radius.md};
    }

    /* Tablet e Desktop (acima de 769px) */
    @media (min-width: 769px) {
      width: 420px;
      max-width: 500px;
    }
  `}
`;

export const LoginContent = styled.div`
  ${(props) => css`
    display: flex;
    align-items: stretch;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    padding: ${props.theme.spacing.xs};
    overflow: hidden !important;

    .logo-usincheck {
      margin: 0 auto;
      max-width: 12rem;
      height: auto;
      margin-bottom: 2rem;
    }

    /* Mobile pequeno (menor que 480px) */
    @media (max-width: 480px) {
      padding: ${props.theme.spacing.xs} ${props.theme.spacing.nano};
      
      .logo-usincheck {
        max-width: 10rem;
        margin-bottom: 1.5rem;
      }
    }

    /* Mobile médio (481px até 768px) */
    @media (min-width: 481px) and (max-width: 768px) {
      padding: ${props.theme.spacing.xs} ${props.theme.spacing.nano};

      .logo-usincheck {
        max-width: 11rem;
        margin-bottom: 1.75rem;
      }
    }
  `}
`;
