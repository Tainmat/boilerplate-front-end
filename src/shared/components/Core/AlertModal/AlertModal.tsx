import * as S from "@shared/components/Core/AlertModal/AlertModal.styles";
import { Button } from "@shared/components/Core/Buttons/Button";
import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { IAlertType } from "@shared/contexts/Alert/Alert.interface";
import { Col, Row } from "react-bootstrap";

interface AlertProps {
  title?: string;
  icon?: string;
  iconType?: IAlertType;
  subtitle?: string;
  description?: string;
  buttonCancel?: string;
  buttonConfirm?: string;
}

interface Props {
  alert: AlertProps;
  visible: boolean;
  actionOnCancel: () => void;
  actionOnConfirm: () => void;
}

export function AlertModal({ alert, visible, actionOnCancel, actionOnConfirm }: Props) {
  return (
    <>
      {visible && (
        <S.Backdrop>
          <S.Dialog>
            <S.Content>
              <S.CloseButton>
                <ButtonIcon
                  size="md"
                  icon="close"
                  mode="warning"
                  onClick={() => actionOnCancel()}
                />
              </S.CloseButton>

              {alert.title && (
                <Row>
                  <Col xs="auto">
                    <div className="d-flex align-items-center gap-2">
                      {alert.icon && <Icon size="lg" icon={alert.icon} />}

                      <Heading size="xs">{alert.title}</Heading>
                    </div>
                  </Col>
                </Row>
              )}

              <Row className="justify-content-center text-center py-5">
                <Col xs={8}>
                  {alert.icon && (
                    <Row className="justify-content-center mb-4">
                      <Col xs="auto">
                        <S.AlertIcon type={alert.iconType || "success"}>
                          <span className="material-icons">{alert.icon}</span>
                        </S.AlertIcon>
                      </Col>
                    </Row>
                  )}

                  {alert.description && (
                    <Heading size="sm" className="mb-4">
                      {alert.description}
                    </Heading>
                  )}

                  {alert.subtitle && (
                    <Subtitle size="sm" className=" mb-4">
                      {alert.subtitle}
                    </Subtitle>
                  )}

                  <Row className="justify-content-center">
                    <Col>
                      <Button
                        type="button"
                        mode={alert.iconType || "success"}
                        styles="primary"
                        display="block"
                        onClick={() => {
                          actionOnConfirm();
                        }}
                      >
                        {alert.buttonConfirm || "Confirmar"}
                      </Button>
                    </Col>

                    <Col>
                      <Button
                        type="button"
                        styles="primary"
                        display="block"
                        onClick={() => {
                          actionOnCancel();
                        }}
                      >
                        {alert.buttonCancel || "Cancelar"}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </S.Content>
          </S.Dialog>
        </S.Backdrop>
      )}
    </>
  );
}
