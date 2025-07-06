import LatiniLogoOpen from "@assets/images/logo.png";
import LatiniLogoClose from "@assets/images/logo-usincheck.png";
import styled, { css } from "styled-components";

interface ContainerProps {
  $hover: boolean;
  $isMobile?: boolean;
  $isTablet?: boolean;
}

interface ItemProps {
  $active?: boolean;
  $openSubItems?: boolean;
  $hasList?: boolean;
  $hover?: boolean;
}

export const Container = styled.nav<ContainerProps>`
  ${(props) => css`
    background-color: ${props.theme.colors.neutral.high.pure};
    border-right: 1px solid ${props.theme.colors.neutral.high.dark};
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: hidden;
    position: fixed;
    left: 0;
    top: 0;
    z-index: ${props.theme.zindex.ten};
    padding: 2rem 0rem;
    height: 100vh;
    width: ${props.theme.spacing.xxl};
    transition: transform 0.3s ease-in-out, width 0.3s ease-in-out, padding 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

    ${props.$hover &&
    css`
      width: 288px !important;
    `}

    ${!props.$hover &&
    css`
      justify-content: center;
      align-items: center;
    `}

    /* Mobile */
    @media (max-width: 767px) {
      width: 100%;
      max-width: 280px;
      transform: ${props.$hover ? "translateX(0)" : "translateX(-100%)"};
      box-shadow: ${props.$hover ? "2px 0 10px rgba(0, 0, 0, 0.1)" : "none"};
      padding: 1.25rem 0;

      ${props.$hover &&
      css`
        width: 280px !important;
      `}
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      width: 4rem;
      padding: 1.75rem 0;

      ${props.$hover &&
      css`
        width: 240px !important;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      `}
    }
  `}
`;

export const Brand = styled.div`
  display: block;
  background-image: url(${LatiniLogoClose});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  height: 100px;
  width: 60%;
  transition: all 0.3s ease;

  &.open {
    background-position: center;
    background-image: url(${LatiniLogoOpen});
    width: 224px;
    transition: all 0.3s ease;
  }

  /* Mobile */
  @media (max-width: 767px) {
    height: 80px;
    width: 80%;

    &.open {
      width: 200px;
    }
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    height: 60px;
    width: 70%;

    &.open {
      width: 180px;
    }
  }
`;

export const List = styled.ul`
  ${(props) => css`
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    margin-top: ${props.theme.spacing.xxs};
    height: 100%;
    width: 100%;
    transition: all 0.3s ease;

    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: ${props.theme.colors.neutral.low.light};
      border-radius: ${props.theme.border.radius.sm};
    }

    div {
      position: relative;

      &::after {
        font-family: "Material Icons";
        font-size: 0.75rem;
        color: ${props.theme.colors.neutral.high.pure};

        content: "keyboard_arrow_down";

        position: absolute;
        top: 0.65rem;
        right: 1.5rem;

        opacity: 0;
        visibility: hidden;

        transition:
          visibility 0s,
          opacity 500ms linear;
      }

      &:hover::after {
        opacity: 0;
        visibility: hidden;
        color: ${props.theme.colors.brand.primary.pure} !important;
      }
    }

    li {
      .link,
      a,
      div > div {
        span:nth-child(2) {
          opacity: 0;
          visibility: hidden;

          transition:
            visibility 0s,
            opacity 500ms linear;
        }
      }
    }

    &.open {
      width: 100%;

      li {
        .link,
        a,
        div > div {
          padding: 0 0 0 1.5rem;

          span:nth-child(2) {
            opacity: 1;
            visibility: visible;
          }

          /* Mobile */
          @media (max-width: 767px) {
            padding: 0 0 0 1rem;
          }

          /* Tablet */
          @media (min-width: 768px) and (max-width: 1023px) {
            padding: 0 0 0 1.25rem;
          }
        }

        div {
          &::after {
            opacity: 1;
            visibility: visible;

            /* Mobile */
            @media (max-width: 767px) {
              right: 1rem;
            }

            /* Tablet */
            @media (min-width: 768px) and (max-width: 1023px) {
              right: 1.25rem;
            }
          }
        }
      }
    }

    /* Mobile */
    @media (max-width: 767px) {
      margin-top: 1rem;
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      margin-top: 1.25rem;
    }
  `}
`;

export const Item = styled.li<ItemProps>`
  ${(props) => css`
    min-height: 36px;
    width: 100%;

    + li {
      margin-top: 0.125rem;
    }

    .link,
    a,
    div > div {
      display: flex;
      align-items: center;

      min-height: 36px;
      width: 100%;

      padding: 0rem;
      padding-left: 1.875rem;

      outline: unset;

      span {
        color: ${props.theme.colors.brand.primary.pure} !important;

        ${props.$active &&
        css`
          color: ${props.theme.colors.neutral.high.pure} !important;
        `}
      }

      span:nth-child(2) {
        font-family: ${props.theme.font.family.base};
        font-size: ${props.theme.font.size.xs};
        font-weight: ${props.theme.font.weight.regular};
        line-height: ${props.theme.line.height.default};
        margin-left: 0.75rem;

        &.big {
          font-size: ${props.theme.font.size.xs};
        }

        /* Mobile */
        @media (max-width: 767px) {
          font-size: ${props.theme.font.size.xxs};
          margin-left: 0.5rem;
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          font-size: ${props.theme.font.size.xxs};
          margin-left: 0.625rem;
        }
      }

      span: nth-child(3) {
        display: inline-block;
        text-align: end;
      }

      /* Mobile */
      @media (max-width: 767px) {
        min-height: 40px;
        padding-left: 1.5rem;
      }

      /* Tablet */
      @media (min-width: 768px) and (max-width: 1023px) {
        min-height: 38px;
        padding-left: 1.625rem;
      }
    }

    a,
    .link {
      background-color: transparent;

      &:hover {
        background-color: ${props.theme.colors.brand.primary.pure};

        span,
        svg {
          color: ${props.theme.colors.neutral.high.pure} !important;
          font-weight: ${props.theme.font.weight.bold};
        }
      }

      ${props.$active &&
      css`
        background-color: ${props.theme.colors.brand.primary.pure};
        span {
          color: ${props.theme.colors.neutral.high.pure} !important;
        }

        svg {
          color: ${props.theme.colors.neutral.high.pure} !important;
        }
      `}
    }

    div {
      ${props.$hasList &&
      css`
        cursor: pointer;
      `}

      ${props.$openSubItems &&
      css`
        div {
          background-color: ${props.theme.colors.brand.primary.pure};
          span {
            color: ${props.theme.colors.neutral.high.pure} !important;
          }
        }
        ul {
          visibility: visible;
          opacity: 1;
          max-height: 100%;

          transition:
            visibility 0s,
            opacity 250ms ease,
            max-height 250ms linear;
        }
      `}

      &:hover {
        div {
          span {
            color: ${props.theme.colors.brand.primary.pure} !important;
            font-weight: ${props.theme.font.weight.bold};
          }
        }
      }

      &:hover,
      :focus-within {
        div {
          background-color: ${props.theme.colors.brand.primary.pure};
          span {
            color: ${props.theme.colors.neutral.high.pure} !important;
          }
        }
      }

      ${props.$openSubItems &&
      css`
        div {
          background-color: ${props.theme.colors.brand.primary.pure};
          span {
            color: ${props.theme.colors.neutral.high.pure} !important;
          }
        }
      `}
    }

    /* Mobile */
    @media (max-width: 767px) {
      min-height: 40px;

      + li {
        margin-top: 0.25rem;
      }
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      min-height: 38px;

      + li {
        margin-top: 0.1875rem;
      }
    }
  `}
`;

export const SubList = styled.ul<ItemProps>`
  ${(props) => css`
    visibility: hidden;
    opacity: 0;
    max-height: 0;
    height: auto;
    width: 100%;

    ${props.$openSubItems &&
    css`
      visibility: visible;
      opacity: 1;
      max-height: 100%;
      transition:
        visibility 0s,
        opacity 250ms ease,
        max-height 250ms linear;
    `}
  `}
`;

export const SubItem = styled.li<ItemProps>`
  ${(props) => css`
    background-color: transparent;

    height: 36px;
    width: 100%;

    a,
    .link {
      ${!props.$hover &&
      css`
        justify-content: center;
        padding: 0;
        span:nth-child(1) {
          margin-left: 0;
        }
        span:nth-child(2) {
          display: none;
        }
      `}
    }

    &.item-selected {
      a,
      .link {
        span {
          font-weight: ${props.theme.font.weight.bold};
        }
      }
      background-color: ${props.theme.colors.neutral.high.medium};
      border: 1px solid ${props.theme.colors.neutral.high.pure};
      border-right: 2px solid ${props.theme.colors.brand.primary.pure};
    }

    &:hover {
      ${!props.$active &&
      css`
        background-color: ${props.theme.colors.neutral.high.medium};
        border: 1px solid ${props.theme.colors.neutral.high.pure};
        border-right: 2px solid ${props.theme.colors.brand.primary.pure};
      `}
    }

    a,
    .link {
      span {
        color: ${props.theme.colors.brand.primary.pure} !important;
      }

      padding: 0 2.5rem 0 3rem;

      ${!props.$hover &&
      css`
        padding: 0 2rem 0 2.5rem;
      `}

      height: 100%;

      &:hover {
        background-color: transparent;
        span {
          font-weight: ${props.theme.font.weight.bold};
          color: ${props.theme.colors.brand.primary.pure} !important;
        }
      }

      /* Mobile */
      @media (max-width: 767px) {
        padding: 0 1.5rem 0 2.5rem;

        ${!props.$hover &&
        css`
          padding: 0 1.5rem 0 2rem;
        `}
      }

      /* Tablet */
      @media (min-width: 768px) and (max-width: 1023px) {
        padding: 0 2rem 0 2.75rem;

        ${!props.$hover &&
        css`
          padding: 0 1.75rem 0 2.25rem;
        `}
      }
    }

    ${props.$openSubItems &&
    css`
      padding-left: 0.75rem;

      /* Mobile */
      @media (max-width: 767px) {
        padding-left: 0.5rem;
      }

      /* Tablet */
      @media (min-width: 768px) and (max-width: 1023px) {
        padding-left: 0.625rem;
      }
    `}

    /* Mobile */
    @media (max-width: 767px) {
      height: 38px;
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      height: 36px;
    }
  `}
`;

// Mobile Overlay for when menu is open
export const MobileOverlay = styled.div<{ $visible: boolean }>`
  ${(props) => css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: ${props.theme.zindex.nine};
    opacity: ${props.$visible ? 1 : 0};
    visibility: ${props.$visible ? "visible" : "hidden"};
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    backdrop-filter: blur(2px);

    /* Only show on mobile */
    @media (min-width: 1024px) {
      display: none;
    }
  `}
`;