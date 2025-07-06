import { rgba } from "polished";
import { createGlobalStyle, css } from "styled-components";

export default createGlobalStyle`
  ${(props) => css`
    .react-datepicker-popper[data-placement^="bottom"] {
      padding-top: 0.5rem;
    }

    .react-datepicker {
      .react-datepicker__triangle {
        display: none;
      }

      background-color: ${props.theme.colors.neutral.low.dark};
      border: unset;
      border-radius: ${props.theme.border.radius.sm};
      box-shadow: ${props.theme.shadow.level.two};

      color: ${props.theme.colors.neutral.high.pure};
      font-family: ${props.theme.font.family.base};
      font-size: ${props.theme.font.size.xxs};
      font-weight: ${props.theme.font.weight.regular};

      .react-datepicker__navigation {
        top: 10px;
      }

      .react-datepicker__header {
        background-color: ${rgba(
          props.theme.colors.neutral.low.pure,
          props.theme.opacity.level.intense,
        )};

        .react-datepicker__current-month,
        .react-datepicker-time__header,
        .react-datepicker-year-header {
          color: ${props.theme.colors.neutral.high.pure};
          font-family: ${props.theme.font.family.base};
          font-size: ${props.theme.font.size.xs};
          font-weight: ${props.theme.font.weight.bold};
        }
      }

      .react-datepicker__day-name,
      .react-datepicker__day,
      .react-datepicker__time-name {
        color: ${props.theme.colors.neutral.high.pure};

        &:hover {
          background-color: ${rgba(
            props.theme.colors.neutral.low.pure,
            props.theme.opacity.level.intense,
          )};
        }
      }

      .react-datepicker__day--today,
      .react-datepicker__month-text--today,
      .react-datepicker__quarter-text--today,
      .react-datepicker__year-text--today {
        background-color: ${rgba(
          props.theme.colors.neutral.low.pure,
          props.theme.opacity.level.intense,
        )};
        border-radius: 0.3rem;
        color: ${props.theme.colors.brand.primary.pure};
        font-weight: ${props.theme.font.weight.bold};
      }

      .react-datepicker__day--selected,
      .react-datepicker__day--in-selecting-range,
      .react-datepicker__day--in-range,
      .react-datepicker__month-text--selected,
      .react-datepicker__month-text--in-selecting-range,
      .react-datepicker__month-text--in-range,
      .react-datepicker__quarter-text--selected,
      .react-datepicker__quarter-text--in-selecting-range,
      .react-datepicker__quarter-text--in-range,
      .react-datepicker__year-text--selected,
      .react-datepicker__year-text--in-selecting-range,
      .react-datepicker__year-text--in-range {
        background-color: ${props.theme.colors.brand.primary.pure};
        color: ${props.theme.colors.neutral.high.pure};
      }

      .react-datepicker__day--keyboard-selected,
      .react-datepicker__month-text--keyboard-selected,
      .react-datepicker__quarter-text--keyboard-selected,
      .react-datepicker__year-text--keyboard-selected {
        background-color: transparent;
      }

      .react-datepicker__time-container {
        background-color: ${props.theme.colors.neutral.low.dark};
        border-left: 1px solid ${props.theme.colors.neutral.low.pure};
        overflow: hidden;
      }

      .react-datepicker__time-list {
        scrollbar-width: none;
        overflow: hidden;
        background-color: ${props.theme.colors.neutral.low.dark};
        /* border-radius: ${props.theme.border.radius.sm}; */
      }

      .react-datepicker__time-list-item {
        color: ${props.theme.colors.neutral.high.pure};
        font-family: ${props.theme.font.family.base};
        font-size: ${props.theme.font.size.xxs};
        padding: 0.5rem;

        &:hover {
          background-color: ${rgba(
            props.theme.colors.neutral.low.pure,
            props.theme.opacity.level.intense,
          )};
          color: ${props.theme.colors.neutral.low.pure};
        }
      }

      .react-datepicker__time-list-item--selected {
        background-color: ${props.theme.colors.brand.primary.pure};
        color: ${props.theme.colors.neutral.high.pure};
        font-weight: ${props.theme.font.weight.bold};
      }
    }
  `}
`;
