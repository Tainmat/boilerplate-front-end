import styled, { css } from "styled-components";

export const Container = styled.div`
  ${(props) => css`
    background-color: ${props.theme.colors.neutral.high.pure};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;

    position: absolute;
    top: 3.15rem;
    right: 1rem;
    width: 8rem;
    z-index: 1100;

    border-radius: ${props.theme.border.radius.sm};
    border: 1px solid ${props.theme.colors.neutral.low.light};

    &::before {
      content: "";
      position: absolute;
      top: -0.4rem;
      right: 1.1rem;
      width: 10px;
      height: 10px;
      transform: rotate(45deg);
      background-color: ${props.theme.colors.neutral.high.pure};
      border-left: 1px solid ${props.theme.colors.neutral.low.light};
      border-top: 1px solid ${props.theme.colors.neutral.low.light};
    }

    /* Mobile */
    @media (max-width: 767px) {
      top: 2.75rem;
      right: 0.5rem;
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      top: 3rem;
      right: 0.75rem;
    }
  `}
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Item = styled.li`
  ${(props) => css`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    cursor: pointer !important;
    width: 100%;
    padding: 0.5rem 1rem;
    transition: background-color 0.2s ease;

    p {
      color: ${props.theme.colors.neutral.low.dark};
      font-size: 0.875rem;
      font-weight: ${props.theme.font.weight.regular};
    }

    &.logout {
      border-top: 1px solid ${props.theme.colors.neutral.high.medium};
      p {
        color: ${props.theme.colors.feedback.warning.pure};
      }
    }

    &:hover {
      background-color: ${props.theme.colors.neutral.high.light};
    }

    &:nth-child(1) {
      border-top-right-radius: ${props.theme.border.radius.sm};
      border-top-left-radius: ${props.theme.border.radius.sm};
    }

    &:nth-child(2) {
      border-bottom-right-radius: ${props.theme.border.radius.sm};
      border-bottom-left-radius: ${props.theme.border.radius.sm};
    }
  `}
`;
