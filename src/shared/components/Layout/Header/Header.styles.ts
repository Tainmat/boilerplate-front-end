import styled, { css } from "styled-components";

interface ContainerProps {
  $sideMenuIsOpen: boolean;
}

const defaultContainerProps = styled.div<ContainerProps>`
  ${(props) => css`
    position: fixed;

    margin: 0 0 0 5rem;
    padding: 0 0.5rem;
    transition: margin 0.3s ease, width 0.3s ease;

    ${props.$sideMenuIsOpen &&
    css`
      margin-left: 18rem;
    `}

    width: calc(100vw - ${props.$sideMenuIsOpen ? "18rem" : "5rem"});

    /* Mobile */
    @media (max-width: 767px) {
      margin: 0;
      padding: 0 1rem;
      width: 100vw;
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      margin: 0 0 0 4rem;
      width: calc(100vw - 4rem);
      
      ${props.$sideMenuIsOpen &&
      css`
        margin-left: 240px;
        width: calc(100vw - 240px);
      `}
    }
  `}
`;

export const Container = styled(defaultContainerProps)<ContainerProps>`
  ${(props) => css`
    position: fixed;
    z-index: 1080;
    height: ${props.theme.spacing.xl};
    width: calc(100% - ${props.$sideMenuIsOpen ? "18rem" : "5rem"});
    background-color: ${props.theme.colors.neutral.high.pure};
    border-bottom: 1px solid ${props.theme.colors.neutral.low.light};
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
    transition: height 0.3s ease, margin 0.3s ease, width 0.3s ease;

    .col1 {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 0.5rem;
      transition: all 0.3s ease;

      .username {
        display: flex;
        align-items: start;
        gap: 0.5rem;
        transition: all 0.3s ease;

        .hello {
          color: ${props.theme.colors.neutral.low.dark};
          transition: font-size 0.3s ease;
        }

        /* Mobile */
        @media (max-width: 767px) {
          .hello {
            font-size: ${props.theme.font.size.xxs};
          }
        }
      }
    }

    .col2 {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.375rem;
      margin-right: 1rem;
      transition: all 0.3s ease;

      div {
        cursor: pointer;
      }

      /* Mobile */
      @media (max-width: 767px) {
        margin-right: 0.5rem;
        gap: 0.25rem;
      }
    }

    /* Mobile */
    @media (max-width: 767px) {
      height: 3.5rem;
      width: 100%;
      padding: 0 0.75rem;
      
      .col1 {
        gap: 0.375rem;
        
        .username {
          gap: 0.25rem;
          
          .hello {
            font-size: ${props.theme.font.size.xxs};
          }
        }
      }
      
      .col2 {
        gap: 0.25rem;
        margin-right: 0.5rem;
      }
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      height: 3.75rem;
      width: calc(100% - ${props.$sideMenuIsOpen ? "240px" : "4rem"});
      
      .col1 {
        gap: 0.4375rem;
        
        .username {
          gap: 0.375rem;
          
          .hello {
            font-size: ${props.theme.font.size.xs};
          }
        }
      }
      
      .col2 {
        gap: 0.3125rem;
        margin-right: 0.75rem;
      }
    }
  `}
`;

export const BreadcrumbContainer = styled(defaultContainerProps)`
  ${(props) => css`
    height: ${props.theme.spacing.xxxs};
    margin-top: ${props.theme.spacing.xl};
    position: fixed;
    z-index: 1070;
    background-color: transparent;
    transition: margin-top 0.3s ease, padding 0.3s ease;

    /* Mobile */
    @media (max-width: 767px) {
      margin-top: 3.5rem;
      padding: 0 0.75rem;
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      margin-top: 3.75rem;
      padding: 0 0.875rem;
    }
  `}
`;

export const Avatar = styled.div`
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  
  img {
    border-radius: 50%;
    height: 2.5rem;
    width: 2.5rem;
    transition: height 0.3s ease, width 0.3s ease;
    border: 2px solid transparent;
    
    &:hover {
      border-color: ${props => props.theme.colors.brand.primary.pure};
    }

    /* Mobile */
    @media (max-width: 767px) {
      height: 2rem;
      width: 2rem;
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      height: 2.25rem;
      width: 2.25rem;
    }
  }
`;