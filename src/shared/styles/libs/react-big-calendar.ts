import { createGlobalStyle, css } from "styled-components";

export default createGlobalStyle`
  ${(props) => css`
    .rbc-calendar {
      .rbc-month-view {
        border: unset;

        .rbc-month-header {
          margin-bottom: 2rem;
        }
      }

      .rbc-allday-cell {
        display: none;
      }

      .rbc-header {
        border: 0px;
        padding: 0.5rem;
      }

      .rbc-month-row {
        border: unset;
        margin-bottom: 0.25rem;
      }

      .rbc-day-bg {
        border-color: ${props.theme.colors.neutral.low.pure};
        border-radius: ${props.theme.border.radius.sm};
        border-style: solid;
        border-width: ${props.theme.border.width.thin};

        cursor: default;

        margin: 0 0.125rem;

        &.rbc-today {
          background-color: ${props.theme.colors.neutral.high.pure};
        }

        &.rbc-off-range-bg {
          background-color: transparent;
          cursor: default;
          pointer-events: none;
        }

        &.selected {
          color: ${props.theme.colors.neutral.low.pure};
          background-color: ${props.theme.colors.neutral.high.light};
        }
      }

      .rbc-date-cell {
        padding: 0;
        text-align: center;

        button {
          color: ${props.theme.colors.neutral.low.pure};
          font-size: ${props.theme.font.size.xxs};

          margin-top: 0.5rem;
          pointer-events: none;
        }

        &.rbc-off-range {
          cursor: default;
          pointer-events: none;

          button {
            color: ${props.theme.colors.neutral.low.light};
          }
        }
      }

      .rbc-row-segment {
        padding: 0rem 0.5rem;
      }

      .custom-event {
        background-color: transparent;
        outline: unset;
        padding: 0.125rem 0.75rem 0rem 0.75rem;
        margin-bottom: 0.25rem;

        color: ${props.theme.colors.neutral.low.pure};
        font-family: ${props.theme.font.family.base};
        font-size: ${props.theme.font.size.xxs};

        display: flex;
        align-items: center;

        border-left: 4px solid #1e90ff;

        background-color: #add8e6;

        .rbc-event-content,
        .rbc-event-label {
          color: ${props.theme.colors.neutral.low.pure};
          font-size: ${props.theme.font.size.xxs};
        }

        &.selected {
          border-left: 4px solid #ff4500;
          background-color: #ffefd5;
        }
      }

      .rbc-time-view {
        border: 0px;

        .rbc-time-header-content {
          border: unset;
        }

        .rbc-time-content {
          border: 0px;

          .rbc-day-slot:last-child {
            border-right: 1px solid #ddd;
          }

          .rbc-time-gutter {
            .rbc-timeslot-group {
              &:nth-child(1) {
                color: transparent;
                background-color: transparent;
              }
              border: 0;
              margin-top: -0.75rem;
            }
          }
        }

        .rbc-time-content > .rbc-day-slot {
          border-top: 1px solid #ddd;
        }

        .custom-event {
          display: flex;
          align-items: flex-start;
          justify-content: center;

          border: 0.2px solid ${props.theme.colors.neutral.low.light};
          border-radius: ${props.theme.border.radius.sm};
          border-left: 4px solid #1e90ff;

          background-color: #add8e6;

          .rbc-event-content,
          .rbc-event-label {
            color: ${props.theme.colors.neutral.low.pure};
            font-size: ${props.theme.font.size.xxs};
          }

          &.selected {
            border-left: 4px solid #ff4500;
            background-color: #ffefd5;
          }
        }

        .rbc-current-time-indicator {
          position: absolute;
          left: 0;
          right: 0;
          width: 100%;
          height: 1px;
          background-color: ${props.theme.colors.neutral.low.light};
        }
      }

      &.month-view {
        height: 100dvh;

        .rbc-header {
          border-color: ${props.theme.colors.neutral.low.pure};
          border-radius: ${props.theme.border.radius.sm};
          border-style: solid;
          border-width: ${props.theme.border.width.thin};

          margin: 0 0.125rem;
        }
      }
    }
  `}
`;
