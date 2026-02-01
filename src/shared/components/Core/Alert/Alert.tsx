import {
  AlertIcon,
  Backdrop,
  CloseButton,
  Content,
  Dialog,
  DrawerHandle,
} from "@shared/components/Core/Alert/Alert.styles";
import { Button } from "@shared/components/Core/Buttons/Button";
import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { useAlertContext } from "@shared/contexts/Alert";
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

export function Alert() {
  const { alert, removeAlert } = useAlertContext();

  useEffect(() => {
    if (alert) {
      document.body.classList.add("no-overflow");
    } else {
      const hasOtherModals = document.getElementsByClassName("custom-modal");

      if (hasOtherModals.length === 0) {
        document.body.classList.remove("no-overflow");
      }
    }
  }, [alert]);

  function handleIconType() {
    if (alert) {
      switch (alert.iconType) {
        case "success":
          return "done";

        case "helper":
          return "warning";

        case "warning":
          return "error";

        default:
          return "";
      }
    }

    return "";
  }

  if (!alert) return null;

  return (
    <Backdrop>
      <Dialog>
        <Content>
          <DrawerHandle />
          <CloseButton>
            <ButtonIcon size="md" icon="close" onClick={removeAlert} />
          </CloseButton>

          {alert.iconModal && alert.titleModal && (
            <Row>
              <Col xs="auto">
                <div className="d-flex align-items-center gap-2">
                  <Icon size="lg" icon={alert.iconModal} />

                  <Heading size="xs">{alert.titleModal}</Heading>
                </div>
              </Col>
            </Row>
          )}

          <Row className="justify-content-center text-center py-2 py-md-5">
            <Col xs={12} sm={10} md={8}>
              <Row className="justify-content-center mb-2 mb-md-4">
                <Col xs="auto">
                  <AlertIcon type={alert.iconType}>
                    <span className="material-icons">{handleIconType()}</span>
                  </AlertIcon>
                </Col>
              </Row>

              <Heading size="sm" className="mb-2 mb-md-3">
                {alert.title}
              </Heading>

              {alert.subtitle && (
                <Paragraph size="sm" className="mt-1 mt-md-2">
                  {alert.subtitle}
                </Paragraph>
              )}

              <Subtitle size="sm" className="mt-2 mt-md-5 mb-3 mb-md-4">
                {alert.description}
              </Subtitle>

              <Row className="justify-content-center g-2">
                <Col xs={12} sm={6} md="auto">
                  <Button
                    type="button"
                    styles="tertiary"
                    display="block"
                    onClick={() => {
                      alert.onCancel?.();
                      removeAlert();
                    }}
                  >
                    {alert.cancelTxt}
                  </Button>
                </Col>

                <Col xs={12} sm={6} md="auto">
                  <Button
                    type="button"
                    styles="primary"
                    mode={alert.buttonType}
                    display="block"
                    onClick={() => {
                      alert.onConfirm?.();
                      removeAlert();
                    }}
                  >
                    {alert.confirmTxt}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
      </Dialog>
    </Backdrop>
  );
}
