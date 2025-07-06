import { rgba } from "polished";
import styled, { css } from "styled-components";

interface WrapperProps {
  open: boolean;
}

interface ListProps {
  display?: "block";
}

interface ItemProps {
  danger?: boolean;
}

export const Wrapper = styled.div<WrapperProps>`
  ${(props) =>
    props.open &&
    css`
      position: relative;

      ul {
        visibility: visible;
        opacity: 1;
        max-height: 1000px;
      }
    `}
`;

export const Container = styled.div`
  ${(props) => css`
    position: absolute;
    z-index: ${props.theme.zindex.four};

    width: max-content;
  `}
`;

export const List = styled.ul<ListProps>`
  ${(props) => css`
    backdrop-filter: blur(${props.theme.background.blur.level.two});
    background-color: ${props.theme.colors.neutral.high.dark};
    border-radius: ${props.theme.border.radius.sm};
    box-shadow: ${props.theme.shadow.level.two};

    visibility: hidden;
    opacity: 0;

    overflow: hidden;
    max-height: 0;
    width: 100%;

    ${props.display === "block"
      ? css`
          min-width: 100%;
        `
      : css`
          min-width: 205px;
        `}

    transition: visibility 0s, opacity 250ms ease, max-height 250ms linear;
  `}
`;

export const Item = styled.li<ItemProps>`
  ${(props) => css`
    cursor: pointer;

    span,
    div {
      ${props.danger
        ? css`
            color: ${props.theme.colors.highlight.light} !important;
          `
        : css`
            color: ${props.theme.colors.neutral.low.dark} !important;
          `}
    }

    span {
      margin-right: 1rem;
    }

    a {
      display: flex;
      align-items: center;

      padding: 0.5rem 2.5rem;

      width: 100%;
    }

    + li {
      border-top-color: ${props.theme.colors.neutral.low.light};
      border-top-style: solid;
      border-top-width: 2px;
    }

    &:hover {
      background-color: ${rgba(
        props.theme.colors.neutral.low.dark,
        props.theme.opacity.level.semitransparent,
      )};
    }
  `}
`;

export const ItemWrapper = styled.div`
  display: flex;
  align-items: center;

  padding: 1rem 1.5rem;

  width: 100%;
`;

export const Label = styled.div`
  ${(props) => css`
    font-family: ${props.theme.font.family.base};
    font-size: ${props.theme.font.size.xs};
    font-weight: ${props.theme.font.weight.regular};
    line-height: ${props.theme.line.height.default};
  `}
`;
