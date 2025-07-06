import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "@assets/fonts/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { createGlobalStyle, css } from "styled-components";

export default createGlobalStyle`
  ${(props) => css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
      height: 100%;
      overflow-y: auto;
    }

    body {
      font-family: ${props.theme.font.family.base};
      font-size: ${props.theme.font.size.xs};
      height: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;

      &.no-overflow {
        overflow: hidden;
        padding-right: 17px;
      }

      /* Ensure scrollbars are always visible on supported browsers */
      &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: ${props.theme.colors.neutral.high.dark};
        border-radius: ${props.theme.border.radius.sm};
      }

      &::-webkit-scrollbar-thumb {
        background-color: ${props.theme.colors.neutral.low.light};
        border-radius: ${props.theme.border.radius.sm};
        border: 1px solid ${props.theme.colors.neutral.high.dark};
      }

      &::-webkit-scrollbar-thumb:hover {
        background-color: ${props.theme.colors.neutral.low.medium};
      }

      /* Breadcrumb styling */
      .breadcrumb-link {
        text-decoration: none;
        transition: opacity 0.2s ease;
        
        &:hover {
          opacity: 0.8;
        }
      }
      
      &.is-smartphone {
        font-size: ${props.theme.font.size.xxs};
      }
      
      &.is-tablet {
        font-size: ${props.theme.font.size.xs};
      }
    }

    ol,
    ul,
    dl {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    p {
      margin: 0;
    }

    button {
      cursor: pointer;
    }

    a {
      text-decoration: unset;
    }

    b {
      font-weight: 600;
    }

    strong {
      font-weight: 700;
    }

    /* Fix for animated page container */
    .animated-page-container {
      min-height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    /* Responsive utility classes */
    .d-xs-none {
      @media (max-width: 767px) {
        display: none !important;
      }
    }
    
    .d-sm-none {
      @media (min-width: 768px) and (max-width: 1023px) {
        display: none !important;
      }
    }
    
    .d-md-none {
      @media (min-width: 1024px) and (max-width: 1399px) {
        display: none !important;
      }
    }
    
    .d-lg-none {
      @media (min-width: 1400px) {
        display: none !important;
      }
    }
  `}
`;
