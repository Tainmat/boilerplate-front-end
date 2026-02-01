import styled, { css } from "styled-components";

interface ContainerProps {
  $sideMenuIsOpen: boolean;
}

export const Container = styled.div<ContainerProps>`
  ${(props) => css`
    position: fixed;
    z-index: 1000;
    margin: 8.5rem 0 0 0;
    padding: 0 1rem 1rem 1rem;
    transition: none; /* Remove transitions since menu no longer affects layout */

    height: calc(100% - 8.5rem);
    width: 100vw;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      width: 0.5rem;
      transition: width 0.3s ease;
    }

    &::-webkit-scrollbar-track {
      background: ${props.theme.colors.neutral.high.dark};
      border-radius: ${props.theme.border.radius.lg};
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${props.theme.colors.neutral.high.pure};
      border-radius: ${props.theme.border.radius.lg};
      border: 1px solid ${props.theme.colors.neutral.low.light};
    }

    &::-webkit-scrollbar-thumb:hover {
      background-image: linear-gradient(
        -321.77deg,
        rgba(13, 5, 61, 1) 20.96%,
        rgba(4, 65, 145, 1) 114.96%
      );
      background-size: cover;
    }

    /* Mobile */
    @media (max-width: 767px) {
      margin: 5.5rem 0 0 0;
      padding: 0 0.75rem 1rem 0.75rem;
      width: 100vw;
      height: calc(100vh - 5rem);

      &::-webkit-scrollbar {
        width: 0.25rem;
      }
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      margin: 6rem 0 0 0;
      padding: 0 0.875rem 1rem 0.875rem;
      width: 100vw;
      height: calc(100vh - 5.5rem);

      &::-webkit-scrollbar {
        width: 0.375rem;
      }
    }

    /* Desktop */
    @media (min-width: 1024px) {
      margin: 8.5rem 0 0 0;
      padding: 0 1rem 1rem 1rem;
      width: 100vw;
      height: calc(100vh - 8rem);

      &::-webkit-scrollbar {
        width: 0.5rem;
      }
    }
  `}
`;
