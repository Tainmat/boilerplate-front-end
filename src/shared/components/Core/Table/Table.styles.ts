import { rgba } from "polished";
import styled, { css } from "styled-components";

interface Props {
  $isLoading?: boolean;
  $responsive?: boolean;
  scrollable?: boolean;
  $bordered?: boolean;
  $hover?: boolean;
}

export const Wrapper = styled.div<Props>`
  ${(props) => css`
    border-color: transparent;
    border-radius: ${props.theme.border.radius.md};
    border-style: solid;
    border-width: ${props.theme.border.width.hairline};
    padding: 0.5rem;
    transition: all 0.3s ease;

    ${props.$responsive &&
    css`
      overflow-x: auto;
      max-width: 100%;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        height: 0.5rem;
        width: ${props.theme.spacing.nano};
      }

      &::-webkit-scrollbar-track {
        background-color: transparent;
        border-radius: ${props.theme.border.radius.sm};
      }

      &::-webkit-scrollbar-thumb {
        background-color: ${props.theme.colors.neutral.low.medium};
        border-radius: ${props.theme.border.radius.sm};
        transition: background-color 250ms ease;
      }

      &::-webkit-scrollbar-thumb:hover {
        background-image: linear-gradient(
          -321.77deg,
          rgba(13, 5, 61, 1) 20.96%,
          rgba(4, 65, 145, 1) 114.96%
        );
        background-size: cover;
      }
    `}

    ${props.$bordered &&
    css`
      border-color: ${props.theme.colors.neutral.low.light};
    `}

    /* Mobile */
    @media (max-width: 767px) {
      padding: 0 0.25rem;
      border-radius: ${props.theme.border.radius.sm};

      ${props.$responsive &&
      css`
        &::-webkit-scrollbar {
          height: 0.375rem;
        }
      `}
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      padding: 0 0.375rem;

      ${props.$responsive &&
      css`
        &::-webkit-scrollbar {
          height: 0.4375rem;
        }
      `}
    }
  `}
`;

export const Scrollable = styled.div`
  ${(props) => css`
    overflow-y: visible;
    max-height: 70vh;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      width: 0.25rem;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
      border-radius: ${props.theme.border.radius.sm};
      margin: 1.35rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${rgba(
        props.theme.colors.neutral.low.dark,
        props.theme.opacity.level.intense,
      )};
      border-radius: ${props.theme.border.radius.sm};
    }

    /* Mobile */
    @media (max-width: 767px) {
      max-height: 280px;

      &::-webkit-scrollbar {
        width: 0.1875rem;
      }

      &::-webkit-scrollbar-track {
        margin: 1rem;
      }
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      max-height: 320px;

      &::-webkit-scrollbar {
        width: 0.21875rem;
      }

      &::-webkit-scrollbar-track {
        margin: 1.2rem;
      }
    }
  `}
`;

export const Container = styled.table<Props>`
  ${(props) => css`
    border-collapse: separate;
    border-spacing: 0 0.5rem;
    width: 100%;
    table-layout: fixed;
    transition: all 0.3s ease;

    ${props.$bordered &&
    css`
      thead th {
        border-bottom: 1px solid ${props.theme.colors.neutral.low.light}; !important;
      }
    `}

    tr {
      height: 2.75rem;
      transition: all 0.3s ease;
      word-wrap: break-word;
    }

    th {
      padding: 0.25rem 0.75rem;
      transition: all 0.3s ease;

      &:first-child {
        padding-left: 1rem;
      }

      &:last-child {
        padding-right: 1rem;
      }
    }

    td {
      padding: 0.1rem 0.75rem;
      vertical-align: middle;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: all 0.3s ease;

      &:first-child {
        padding-left: 1rem;
      }

      &:last-child {
        padding-right: 1rem;
      }
      
      /* For nested components that need to show text with ellipsis */
      p, div:not(.d-flex) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    }

    tbody {
      tr {
        height: 1rem;
        background-color: transparent;
        word-wrap: break-word;
        transition: all 0.3s ease;

        td:first-child {
          border-top-left-radius: ${props.theme.border.radius.sm};
          border-bottom-left-radius: ${props.theme.border.radius.sm};
        }

        td:last-child {
          border-top-right-radius: ${props.theme.border.radius.sm};
          border-bottom-right-radius: ${props.theme.border.radius.sm};
        }

        td {
          border: 1px solid transparent;
          transition: border-color 250ms, background-color 250ms;

          > div.show-on-hover {
            opacity: 0;
            visibility: hidden;
            transition:
              visibility 0s,
              opacity 250ms linear;
          }
        }

        transition: background-color 250ms ease-in;

        ${!props.$isLoading &&
        css`
          ${
            props.$hover !== false &&
            css`
            &:hover {
            background-color: ${rgba(
              props.theme.colors.neutral.low.pure,
              props.theme.opacity.level.semitransparent,
            )};
          `
          }

            td {
              > div.show-on-hover {
                opacity: 1;
                visibility: visible;
              }
            }
          }
        `}

        transition: background-color 250ms ease;

        &.highlight-success {
          background-color: ${rgba(
            props.theme.colors.feedback.success.light,
            props.theme.opacity.level.light,
          )};

          td {
            border-top-color: ${props.theme.colors.feedback.success.pure};
            border-bottom-color: ${props.theme.colors.feedback.success.pure};
          }

          td:first-child {
            border-left-color: ${props.theme.colors.feedback.success.pure};
          }

          td:last-child {
            border-right-color: ${props.theme.colors.feedback.success.pure};
          }
        }

        &.highlight-warning {
          background-color: ${rgba(
            props.theme.colors.feedback.warning.light,
            props.theme.opacity.level.light,
          )};

          td {
            border-top-color: ${props.theme.colors.feedback.warning.pure};
            border-bottom-color: ${props.theme.colors.feedback.warning.pure};
          }

          td:first-child {
            border-left-color: ${props.theme.colors.feedback.warning.pure};
          }

          td:last-child {
            border-right-color: ${props.theme.colors.feedback.warning.pure};
          }
        }

        &.stroke-warning {
          td {
            border-top-color: ${props.theme.colors.feedback.warning.pure};
            border-bottom-color: ${props.theme.colors.feedback.warning.pure};
          }

          td:first-child {
            border-left-color: ${props.theme.colors.feedback.warning.pure};
          }

          td:last-child {
            border-right-color: ${props.theme.colors.feedback.warning.pure};
          }
        }

        &.expandable {
          cursor: pointer;

          .hidden {
            display: none;
            height: 0;
            overflow: visible;
            transition: height 0.3s ease;
          }

          &.show {
            background-color: ${rgba(
              props.theme.colors.neutral.low.pure,
              props.theme.opacity.level.semitransparent,
            )};

            .hidden {
              display: block;
              height: auto;
              overflow: visible;
            }
          }
        }

        &.no-hover {
          cursor: default !important;
        }
      }
    }

    tfoot {
      tr {
        background-color: ${props.theme.colors.brand.secondary.pure};

        td:first-child {
          border-top-left-radius: ${props.theme.border.radius.sm};
          border-bottom-left-radius: ${props.theme.border.radius.sm};
        }

        td:last-child {
          border-top-right-radius: ${props.theme.border.radius.sm};
          border-bottom-right-radius: ${props.theme.border.radius.sm};
        }
      }

      &.size-md {
        tr {
          height: 3.5rem;
        }
      }

      &.size-lg {
        tr {
          height: 5rem;
        }
      }
    }

    ${props.scrollable &&
    css`
      border-collapse: collapse;
      width: 100%;

      thead {
        tr {
          th {
            position: sticky;
            top: 0;
            z-index: 999;

            div {
              color: ${props.theme.colors.neutral.high.pure};
            }
          }

          th:first-child {
            border-top-left-radius: ${props.theme.border.radius.sm};
            border-bottom-left-radius: ${props.theme.border.radius.sm};
          }

          th:last-child {
            border-top-right-radius: ${props.theme.border.radius.sm};
            border-bottom-right-radius: ${props.theme.border.radius.sm};
          }
        }
      }

      tfoot td {
        position: sticky;
        bottom: 0;
        z-index: 999;
      }

      th {
        background-color: ${props.theme.colors.brand.secondary.pure};
      }
    `}

    /* Mobile */
    @media (max-width: 767px) {
      border-spacing: 0 0.25rem;

      tr {
        height: 2.5rem;
      }

      th {
        padding: 0.1875rem 0.5rem;
        font-size: ${props.theme.font.size.xxs};

        &:first-child {
          padding-left: 0.75rem;
        }

        &:last-child {
          padding-right: 0.75rem;
        }
      }

      td {
        padding: 0.0625rem 0.5rem;
        font-size: ${props.theme.font.size.xxs};

        &:first-child {
          padding-left: 0.75rem;
        }

        &:last-child {
          padding-right: 0.75rem;
        }
        
        /* Adjust max-width for mobile */
        max-width: 150px;
      }

      tbody tr {
        height: 0.875rem;
      }

      tfoot {
        &.size-md tr {
          height: 3rem;
        }

        &.size-lg tr {
          height: 4.5rem;
        }
      }
    }

    /* Tablet */
    @media (min-width: 768px) and (max-width: 1023px) {
      border-spacing: 0 0.375rem;

      tr {
        height: 2.625rem;
      }

      th {
        padding: 0.21875rem 0.625rem;
        font-size: ${props.theme.font.size.xs};

        &:first-child {
          padding-left: 0.875rem;
        }

        &:last-child {
          padding-right: 0.875rem;
        }
      }

      td {
        padding: 0.09375rem 0.625rem;
        font-size: ${props.theme.font.size.xs};

        &:first-child {
          padding-left: 0.875rem;
        }

        &:last-child {
          padding-right: 0.875rem;
        }
        
        /* Adjust max-width for tablet */
        max-width: 200px;
      }

      tbody tr {
        height: 0.9375rem;
      }

      tfoot {
        &.size-md tr {
          height: 3.25rem;
        }

        &.size-lg tr {
          height: 4.75rem;
        }
      }
    }
  `}
`;