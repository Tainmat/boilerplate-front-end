import { IAlertType } from "@shared/contexts/Alert/Alert.interface";
import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  type: IAlertType;
}

export const Backdrop = styled.div`
  ${(props) => css`
    background-color: ${rgba(
      props.theme.colors.neutral.low.pure,
      props.theme.opacity.level.medium,
    )};

    position: fixed;
    top: 0;
    left: 0;
    z-index: 1098;

    height: 100%;
    width: 100%;
  `}
`;

export const Dialog = styled.div`
  display: flex;
  align-items: center;

  margin-left: auto;
  margin-right: auto;

  min-height: calc(100% - (1.75rem * 2));
  width: 100%;
  max-width: 810px;
  padding: 0 1rem;

  position: relative;
  z-index: 1099;

  @media (max-width: 1023px) {
    /* Drawer mode para tablets e mobile */
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: auto;
    width: 100%;
    max-width: none;
    padding: 0;
    margin: 0;
    align-items: flex-end;
    min-height: auto;
    animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

export const Content = styled.div`
  ${(props) => css`
    backdrop-filter: blur(${props.theme.background.blur.level.two});
    background-color: ${rgba(
      props.theme.colors.neutral.high.pure,
      props.theme.opacity.level.semiopaque,
    )};
    border-radius: ${props.theme.border.radius.lg};
    padding: 2.5rem;
    width: 100%;
    position: relative;

    @media (max-width: 1023px) {
      /* Drawer style */
      background-color: ${props.theme.colors.neutral.high.pure};
      border-radius: ${props.theme.border.radius.lg} ${props.theme.border.radius.lg} 0 0;
      padding: 1.5rem 1rem 2rem;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
      min-height: auto;
      max-height: 80vh;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      padding: 1.25rem 1rem 1.5rem;
      border-radius: ${props.theme.border.radius.md} ${props.theme.border.radius.md} 0 0;
    }

    @media (max-width: 480px) {
      padding: 1rem 0.75rem 1.25rem;
      border-radius: ${props.theme.border.radius.sm} ${props.theme.border.radius.sm} 0 0;
    }
  `}
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;

  @media (max-width: 1023px) {
    top: 1rem;
    right: 1rem;
  }

  @media (max-width: 768px) {
    top: 0.75rem;
    right: 0.75rem;
  }

  @media (max-width: 480px) {
    top: 0.5rem;
    right: 0.5rem;
  }
`;

export const AlertIcon = styled.span<Props>`
  ${(props) => css`
    border-radius: ${props.theme.border.radius.circular};
    font-size: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;

    height: 4rem;
    width: 4rem;

    @media (max-width: 768px) {
      height: 3rem;
      width: 3rem;
      font-size: 1.5rem;
    }

    @media (max-width: 480px) {
      height: 2.5rem;
      width: 2.5rem;
      font-size: 1.25rem;
    }

    ${props.type === "success" &&
    css`
      background-color: ${props.theme.colors.feedback.success.light};

      > span {
        color: ${props.theme.colors.feedback.success.medium};
      }
    `}

    ${props.type === "helper" &&
    css`
      background-color: ${props.theme.colors.feedback.helper.light};

      > span {
        color: ${props.theme.colors.feedback.helper.medium};
      }
    `}

      ${props.type === "warning" &&
    css`
      background-color: ${props.theme.colors.feedback.warning.light};

      > span {
        color: ${props.theme.colors.feedback.warning.medium};
      }
    `}
  `}
`;

export const DrawerHandle = styled.div`
  ${(props) => css`
    display: none;

    @media (max-width: 1023px) {
      display: block;
      width: 2.5rem;
      height: 0.25rem;
      background-color: ${rgba(props.theme.colors.neutral.low.pure, 0.3)};
      border-radius: ${props.theme.border.radius.pill};
      margin: 0 auto 1rem;
      position: relative;
      top: -0.5rem;
    }
  `}
`;
