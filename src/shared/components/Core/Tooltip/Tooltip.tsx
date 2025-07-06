import { ReactNode } from "react";
import ReactDOM from "react-dom";
import { PlacesType, Tooltip as ReactTooltip } from "react-tooltip";
import { v4 } from "uuid";

interface Props {
  place?: PlacesType;
  title: string | null;
  html?: boolean;
  scrollHide?: boolean;
  delayShow?: number;
  children: ReactNode;
}

const domNode = document.createElement("div");
domNode.style.zIndex = "9999";
document.body.appendChild(domNode);

function BodyPortal({ children }: { children: ReactNode }) {
  return ReactDOM.createPortal(children, domNode);
}

function CustomReactTooltip(props: any) {
  return (
    <BodyPortal>
      <ReactTooltip
        style={{
          zIndex: 9999,
        }}
        effect="solid"
        {...props}
      />
    </BodyPortal>
  );
}

export function Tooltip({ place, title, html, delayShow, scrollHide, children }: Props) {
  const uuid = v4();

  return (
    <>
      <div
        data-tooltip-id={uuid}
        data-tooltip-content={title}
        data-html={html}
        data-class="custom-tooltip"
        style={{ display: "flex" }}
      >
        {children}
      </div>

      <CustomReactTooltip id={uuid} place={place} delayShow={delayShow} scrollHide={scrollHide} />
    </>
  );
}
