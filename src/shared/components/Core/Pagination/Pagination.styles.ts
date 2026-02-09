import styled, { css } from "styled-components";

interface ItemProps {
  active: boolean;
}

export const Container = styled.ul`
  ${(props) => css`
    display: flex;
    align-items: center;
    justify-content: end;

    width: 100%;

    span {
      color: ${props.theme.colors.neutral.low.light};
    }

    /* Mobile */
    @media (max-width: 767px) {
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      justify-content: center;
    }
  `}
`;

export const Controller = styled.li`
  padding: 0;

  /* Mobile */
  @media (max-width: 767px) {
    button {
      padding: 0.375rem;
    }
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    button {
      padding: 0.4375rem;
    }
  }
`;

export const Item = styled.li<ItemProps>`
  ${(props) => css`
    border-radius: ${props.theme.border.radius.sm};
    color: ${props.theme.colors.neutral.low.pure};
    font-family: ${props.theme.font.family.base};
    font-size: ${props.theme.font.size.xxs};
    font-weight: ${props.theme.font.weight.regular};
    line-height: ${props.theme.line.height.default};

    ${props.active &&
    css`
      border: 1px solid;
      border-color: ${props.theme.colors.neutral.low.light};
      color: ${props.theme.colors.neutral.low.light};
      font-weight: ${props.theme.font.weight.medium};
    `}

    margin: 0 0.125rem;
    min-width: 2rem;
    padding: 0.5rem 0.5rem;
    text-align: center;

    cursor: pointer;

    /* Mobile */
    @media (max-width: 767px) {
      font-size: ${props.theme.font.size.xxxs};
      min-width: 1.75rem;
      padding: 0.375rem 0.375rem;
      margin: 0 0.0625rem;
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      font-size: ${props.theme.font.size.xxs};
      min-width: 1.875rem;
      padding: 0.4375rem 0.4375rem;
      margin: 0 0.09375rem;
    }
  `}
`;
