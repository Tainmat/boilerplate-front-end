import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 0;
  transition: all 0.3s ease;
  background-color: transparent;
  z-index: 1070;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;

  /* Mobile */
  @media (max-width: 767px) {
    padding: 0.5rem 0;
    width: 100%;
    
    &::-webkit-scrollbar {
      height: 0.25rem;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${(props) => props.theme.colors.neutral.low.light};
      border-radius: ${(props) => props.theme.border.radius.sm};
      opacity: 0.5;
    }
    -webkit-overflow-scrolling: touch;
  }
  
  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 0.4375rem 0;
    width: 100%;
  }
`;

export const Wrapper = styled.div`
  ${(props) => css`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    transition: all 0.3s ease;

    .current {
      color: ${props.theme.colors.brand.primary.pure};
      font-weight: ${props.theme.font.weight.medium};
    }

    .path {
      transition:
        color 0.1s ease,
        font-weight 0.1s ease;
      white-space: nowrap;

      &:hover {
        color: ${props.theme.colors.neutral.low.light};
        font-weight: ${props.theme.font.weight.medium};
      }
    }

    .separator {
      /* Mobile */
      @media (max-width: 767px) {
        font-size: 0.875rem;
      }

      /* Tablet */
      @media (min-width: 768px) and (max-width: 1023px) {
        font-size: 1rem;
      }
    }

    /* Mobile */
    @media (max-width: 767px) {
      .current,
      .path {
        font-size: ${props.theme.font.size.xxs};
      }
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      .current,
      .path {
        font-size: ${props.theme.font.size.xs};
      }
    }
  `}
`;