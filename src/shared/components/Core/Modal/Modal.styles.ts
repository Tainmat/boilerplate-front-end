import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  blur?: "sm" | "md" | "lg" | "xl";
  mw?: "sm" | "md" | "lg" | "xl";
  minHeight?: boolean;
}

export const Backdrop = styled.div<Props>`
  ${(props) => css`
    background-color: ${rgba(
      props.theme.colors.neutral.low.pure,
      props.theme.opacity.level.semiopaque,
    )};

    position: fixed;
    top: 0;
    left: 0;
    z-index: 1090;

    height: 100%;
    width: 100%;

    overflow-x: hidden;
    overflow-y: hidden;
  `}
`;

export const Dialog = styled.div<Props>`
  ${(props) => css`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;

    ${props.minHeight &&
    css`
      min-height: 80%;
    `}

    max-height: 95%;
    max-width: ${props.mw || "1000px"};

    overflow: hidden;

    background-color: ${props.theme.colors.neutral.high.pure};
    border-radius: ${props.theme.border.radius.md};
    padding: 1rem;
    width: 100%;
    position: relative;

    ${props.mw === "sm" &&
    css`
      max-width: 600px;
    `}
    ${props.mw === "md" &&
    css`
      max-width: 800px;
    `}
    ${props.mw === "lg" &&
    css`
      max-width: 1000px;
    `}
    ${props.mw === "xl" &&
    css`
      max-width: 1400px;
    `}

    /* Mobile */
    @media (max-width: 767px) {
      top: 0;
      left: 0;
      transform: none;
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
      border-radius: 0;
      padding: 0.75rem;

      ${props.minHeight &&
      css`
        min-height: 100vh;
      `}
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      max-width: 90vw;
      max-height: 90vh;
      padding: 0.875rem;

      ${props.mw === "sm" &&
      css`
        max-width: 500px;
      `}
      ${props.mw === "md" &&
      css`
        max-width: 700px;
      `}
      ${props.mw === "lg" &&
      css`
        max-width: 850px;
      `}
      ${props.mw === "xl" &&
      css`
        max-width: 90vw;
      `}

      ${props.minHeight &&
      css`
        min-height: 70%;
      `}
    }
  `}
`;

export const Content = styled.div<Props>`
  ${(props) => css`
    background-color: ${props.theme.colors.neutral.high.pure};
    border-radius: ${props.theme.border.radius.lg};
    padding: 1.5rem;
    width: 100%;
    position: relative;

    overflow: auto;

    ${(!props.blur || props.blur === "sm") &&
    css`
      backdrop-filter: blur(${props.theme.background.blur.level.one});
    `}

    ${props.blur === "md" &&
    css`
      backdrop-filter: blur(${props.theme.background.blur.level.two});
    `}

    ${props.blur === "lg" &&
    css`
      backdrop-filter: blur(${props.theme.background.blur.level.three});
    `}

    ${props.blur === "xl" &&
    css`
      backdrop-filter: blur(${props.theme.background.blur.level.four});
    `}

    &::-webkit-scrollbar {
      display: none;
    }

    /* Mobile */
    @media (max-width: 767px) {
      padding: 1rem;
      border-radius: ${props.theme.border.radius.sm};
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      padding: 1.25rem;
    }
  `}
`;

export const CloseButton = styled.div`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  z-index: 1091;

  /* Mobile */
  @media (max-width: 767px) {
    top: 0.5rem;
    right: 0.5rem;
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    top: 0.375rem;
    right: 0.375rem;
  }
`;
