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

  @media (max-width: 768px) {
    padding: 0 0.75rem;
    align-items: flex-start;
    padding-top: 2rem;
  }
`;

export const Content = styled.div`
  ${(props) => css`
    backdrop-filter: blur(${props.theme.background.blur.level.two});
    background-color: ${rgba(
      props.theme.colors.neutral.high.pure,
      props.theme.opacity.level.semiopaque,
    )};
    border-radius: ${props.theme.border.radius.md};
    padding: 2.5rem;
    width: 100%;
    position: relative;

    @media (max-width: 768px) {
      padding: 1.5rem 1rem;
      border-radius: ${props.theme.border.radius.sm};
    }

    @media (max-width: 480px) {
      padding: 1.25rem 0.75rem;
    }
  `}
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
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
