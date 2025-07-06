import { rgba } from "polished";
import styled, { css } from "styled-components";

export const Container = styled.div`
  ${(props) => css`
    .nav-tabs {
      border-bottom-color: transparent;
      .nav-item {
        .nav-link {
          background-color: transparent;

          border-color: transparent;
          border-radius: ${props.theme.border.radius.none};

          border-top-width: ${props.theme.border.width.none};
          border-left-width: ${props.theme.border.width.none};
          border-right-width: ${props.theme.border.width.none};
          border-bottom-width: ${props.theme.border.width.thin};

          color: ${rgba(props.theme.colors.neutral.low.pure, props.theme.opacity.level.semiopaque)};
          font-family: ${props.theme.font.family.base};
          font-size: ${props.theme.font.size.xs};
          font-weight: ${props.theme.font.weight.regular};
          line-height: ${props.theme.line.height.default};

          height: 2.625rem;
          padding: 0.5rem 1rem;

          &.active {
            border-bottom-color: ${props.theme.colors.neutral.low.pure};

            color: ${props.theme.colors.neutral.low.pure};
          }

          &:hover {
            background-color: ${rgba(
              props.theme.colors.neutral.low.pure,
              props.theme.opacity.level.semitransparent,
            )};
            border-bottom-color: ${props.theme.colors.neutral.low.pure};
            color: ${props.theme.colors.neutral.low.pure};
          }

          &:focus {
            /* box-shadow: 0 0 0 2px ${props.theme.colors.highlight.pure}; */
            outline: unset;
          }
        }
      }
    }

    .tab-content {
      padding-top: 1.5rem;
    }
  `}
`;
