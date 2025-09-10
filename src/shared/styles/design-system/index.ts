import { createGlobalStyle, css } from "styled-components";

export default createGlobalStyle`
  ${(props) => css`
    .text-neutral-high-pure {
      color: ${props.theme.colors.neutral.high.medium};
    }
    .text-neutral-high-medium {
      color: ${props.theme.colors.neutral.high.medium};
    }

    .text-neutral-low-light {
      color: ${props.theme.colors.neutral.low.light};
    }

    .text-success-pure {
      color: ${props.theme.colors.feedback.success.pure};
    }

    .text-helper-pure {
      color: ${props.theme.colors.feedback.helper.pure};
    }

    .text-warning-pure {
      color: ${props.theme.colors.feedback.warning.pure};
    }

    .text-highlight-pure {
      color: ${props.theme.colors.highlight.pure};
    }

    .text-highlight-light {
      color: ${props.theme.colors.highlight.light};
    }

    .text-editor {
      .ql-toolbar {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;

        background-color: ${props.theme.colors.neutral.high.light};
      }

      .ql-container {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }

      .ql-editor {
        font-family: Arial, sans-serif !important;
        font-size: 11px !important; /* Equivale a 8pt */
        line-height: 1.2 !important;

        *,
        p {
          font-family: Arial, sans-serif !important;
          font-size: 11px !important;
        }
      }
    }
  `}
`;
