import DesignSystem from "@shared/styles/design-system";
import GlobalStyle from "@shared/styles/global";
import Bootstrap from "@shared/styles/libs/bootstrap";
import MaterialIcons from "@shared/styles/libs/material-icons";
import ReactBigCalendar from "@shared/styles/libs/react-big-calendar";
import ReactDatepicker from "@shared/styles/libs/react-datepicker";
import ReactTooltip from "@shared/styles/libs/react-tooltip";

export function Styles() {
  return (
    <>
      <GlobalStyle />
      <DesignSystem />
      <Bootstrap />
      <MaterialIcons />
      <ReactBigCalendar />
      <ReactDatepicker />
      <ReactTooltip />
    </>
  );
}
