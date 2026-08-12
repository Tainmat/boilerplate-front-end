import LatiniLogoOpen from "@assets/images/logo-blue-vertical.svg";
import LatiniLogoClose from "@assets/images/logo-blue-vertical.svg";
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
    height: 100vh;

    /* =================================
       MOBILE PHONES (320px - 767px)
       ================================= */
    @media (max-width: 767px) {
      width: 320px;
      max-width: 320px;
      padding: 1.25rem 0;
      transform: ${props.$hover ? "translateX(0)" : "translateX(-100%)"};
      transition:
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.3s ease;
      box-shadow: ${props.$hover ? "8px 0 25px rgba(0, 0, 0, 0.25)" : "none"};

      ${props.$hover &&
      css`
        transform: translateX(0) !important;
      `}
    }

    /* =================================
       TABLETS (768px - 1023px)
       ================================= */
    @media (min-width: 768px) and (max-width: 1023px) {
      width: 280px;
      padding: 1.75rem 0;
      transform: ${props.$hover ? "translateX(0)" : "translateX(-100%)"};
      transition:
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.3s ease;
      box-shadow: ${props.$hover ? "8px 0 25px rgba(0, 0, 0, 0.25)" : "none"};

      ${props.$hover &&
      css`
        transform: translateX(0) !important;
      `}
    }

    /* =================================
       SMALL DESKTOP (1024px - 1199px)
       ================================= */
    @media (min-width: 1024px) and (max-width: 1199px) {
      width: 280px;
      padding: 2rem 0;
      transform: ${props.$hover ? "translateX(0)" : "translateX(-100%)"};
      transition:
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.3s ease;
      box-shadow: ${props.$hover ? "6px 0 20px rgba(0, 0, 0, 0.15)" : "none"};

      ${props.$hover &&
      css`
        transform: translateX(0) !important;
      `}
    }

    /* =================================
       LARGE DESKTOP (1200px+)
       ================================= */
    @media (min-width: 1200px) {
      width: 320px;
      padding: 2rem 0;
      transform: ${props.$hover ? "translateX(0)" : "translateX(-100%)"};
      transition:
        transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.3s ease;
      box-shadow: ${props.$hover ? "4px 0 15px rgba(0, 0, 0, 0.1)" : "none"};

      ${props.$hover &&
      css`
        transform: translateX(0) !important;
      `}
    }

    /* =================================
       EXTRA LARGE DESKTOP (1400px+)
       ================================= */
    @media (min-width: 1400px) {
      width: 350px;

      ${props.$hover &&
      css`
        transform: translateX(0) !important;
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
    min-height: 42px;
    width: 100%;

    + li {
      margin-top: 0.125rem;
    }

    .link,
    a,
    div > div {
      display: flex;
      align-items: center;

      min-height: 42px;
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
        font-size: ${props.theme.font.size.sm};
        font-weight: ${props.theme.font.weight.regular};
        line-height: ${props.theme.line.height.default};
        margin-left: 0.75rem;

        &.big {
          font-size: ${props.theme.font.size.sm};
        }

        /* Mobile */
        @media (max-width: 767px) {
          font-size: ${props.theme.font.size.xs};
          margin-left: 0.5rem;
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          font-size: ${props.theme.font.size.xs};
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
    overflow: hidden;
    position: relative;
    z-index: 1;

    ${props.$openSubItems &&
    css`
      visibility: visible;
      opacity: 1;
      max-height: 500px; /* Valor fixo ao invés de 100% */
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
    position: relative;
    min-height: 40px;
    width: 100%;
    clear: both;

    a,
    .link {
      /* SubItems sempre mostram ícone e texto */
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
        font-family: ${props.theme.font.family.base};
        font-size: ${props.theme.font.size.sm};
        font-weight: ${props.theme.font.weight.regular};
        line-height: ${props.theme.line.height.default};

        /* Mobile */
        @media (max-width: 767px) {
          font-size: ${props.theme.font.size.xs};
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1023px) {
          font-size: ${props.theme.font.size.xs};
        }
      }

      padding: 0 2.5rem 0 3rem;

      ${!props.$hover &&
      css`
        padding: 0 2rem 0 2.5rem;
      `}

      min-height: 40px;
      display: flex;
      align-items: center;

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
      min-height: 38px;
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      min-height: 38px;
    }
  `}
`;

// Overlay for when menu is open - now for all screen sizes
export const MenuOverlay = styled.div<{ $visible: boolean }>`
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
    transition:
      opacity 0.3s ease-in-out,
      visibility 0.3s ease-in-out;
    backdrop-filter: blur(2px);

    /* Different overlay opacity for different screen sizes */
    @media (max-width: 767px) {
      background-color: rgba(0, 0, 0, 0.6);
    }

    @media (min-width: 768px) and (max-width: 1023px) {
      background-color: rgba(0, 0, 0, 0.4);
    }

    @media (min-width: 1024px) {
      background-color: rgba(0, 0, 0, 0.3);
    }
  `}
`;

// Close Button for all screen sizes
export const CloseButton = styled.button`
  ${(props) => css`
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: ${props.theme.zindex.ten};
    background-color: ${props.theme.colors.brand.primary.pure};
    border: none;
    border-radius: ${props.theme.border.radius.circular};
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    &:hover {
      background-color: ${props.theme.colors.brand.primary.dark};
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      color: ${props.theme.colors.neutral.high.pure};
    }

    /* Mobile adjustments */
    @media (max-width: 767px) {
      top: 0.75rem;
      right: 0.75rem;
      width: 36px;
      height: 36px;
    }

    /* Tablet adjustments */
    @media (min-width: 768px) and (max-width: 1023px) {
      top: 0.875rem;
      right: 0.875rem;
      width: 38px;
      height: 38px;
    }

    /* Desktop adjustments */
    @media (min-width: 1024px) {
      top: 1rem;
      right: 1rem;
      width: 42px;
      height: 42px;
    }
  `}
`;
