import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Backdrop, CloseButton, Content, Dialog } from "@shared/components/Core/Modal/Modal.styles";
import { useModalContext } from "@shared/contexts/Layout/Modal";
import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface Props {
  blur?: "sm" | "md" | "lg" | "xl";
  mw?: "sm" | "md" | "lg" | "xl";
  visible: boolean;
  children: ReactNode;
  onClose?: () => void;
  minHeight?: boolean;
}

const domNode = document.createElement("div");
domNode.setAttribute("id", "modal");
document.body.appendChild(domNode);

function BodyPortal({ children }: { children: ReactNode }) {
  return ReactDOM.createPortal(children, domNode);
}

export function Modal({ blur, mw, minHeight, visible, children, onClose }: Props) {
  const { amount } = useModalContext();

  if (!visible) return null;

  return (
    <BodyPortal>
      <Backdrop>
        <Dialog
          className="custom-modal"
          style={{ zIndex: 1090 + amount }}
          mw={mw}
          minHeight={minHeight}
        >
          <CloseButton>
            <ButtonIcon size="md" icon="close" onClick={onClose} mode="warning" />
          </CloseButton>
          <Content blur={blur}>{children}</Content>
        </Dialog>
      </Backdrop>
    </BodyPortal>
  );
}

Modal.defaultProps = {
  blur: undefined,
  mw: undefined,
  onClose: undefined,
};
