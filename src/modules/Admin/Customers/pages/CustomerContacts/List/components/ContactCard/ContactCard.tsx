import "./ContactCard.style.css";

import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";

import { ButtonIcon } from "@/shared/components/Core/Buttons/ButtonIcon";
import { Card } from "@/shared/components/Core/Card";
import { Switch } from "@/shared/components/Core/Form/Fields/Switch";
import { Icon } from "@/shared/components/Core/Icons/Icon";
import { Skeleton } from "@/shared/components/Core/Skeleton";
import { Tooltip } from "@/shared/components/Core/Tooltip";
import { Heading } from "@/shared/components/Core/Typography/Heading";
import { Paragraph } from "@/shared/components/Core/Typography/Paragraph";
import { ICustomerContacts } from "@/shared/hooks/services/Admin/useCustomerContacts";
import { put } from "@/shared/services/api/api.service";
import { phoneNumberMask } from "@/shared/utils/masks";

interface Props {
  item?: ICustomerContacts;
  onRefetch?: () => void;
  onEdit?: () => void;
}

export function ContactCard({ item, onRefetch, onEdit }: Props) {
  const { isSmartphone } = useDeviceDetection();
  const [expanded, setExpanded] = useState(false);

  async function handleOnActive(id: string) {
    try {
      await put(`${"parametrizations/customers/contacts"}/${id}`, {
        ...item,
        isActive: true,
      });
      onRefetch?.();
    } catch {
      // Error handling
    }
  }

  async function handleOnInactive(id: string) {
    try {
      await put(`${"parametrizations/customers/contacts"}/${id}`, {
        ...item,
        isActive: false,
      });
      onRefetch?.();
    } catch {
      // Error handling
    }
  }

  return (
    <Card className="card-contact">
      <Row className="mb-2">
        <Col className="d-flex align-items-center gap-2">
          {item ? (
            <>
              {/* <div className="d-flex align-items-center gap-2">
                <Tooltip title={"Responsável Legal"} place="top">
                  <Icon icon="admin_panel_settings" size="sm" disabled={!item.inResponsavelLegal} />
                </Tooltip>
              </div> */}

              {/* <div className="d-flex align-items-center gap-2">
                <Tooltip title={"Responsável Técnico"} place="top">
                  <Icon icon="engineering" size="sm" disabled={!item.inResponsavelTecnico} />
                </Tooltip>
              </div> */}

              <div className="d-flex align-items-center gap-2">
                <Tooltip title={"Recebe e-mail"} place="top">
                  <Icon icon="mail" size="sm" disabled={!item.receiveInspectionEmail} />
                </Tooltip>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Tooltip title={"WhatsApp"} place="top">
                  <Icon icon="whatsapp" size="sm" disabled={!item.isWhatsApp} />
                </Tooltip>
              </div>
            </>
          ) : (
            <Skeleton size="sm" />
          )}
        </Col>

        <Col className="justify-content-end align-items-center d-flex">
          {item ? (
            <>
              <Tooltip title={item.isActive ? "Inativar" : "Ativar"} place="top">
                <Switch
                  size="sm"
                  checked={item.isActive}
                  onChange={() => {
                    if (item.isActive) {
                      handleOnInactive(item.id);
                    } else {
                      handleOnActive(item.id);
                    }
                  }}
                />
              </Tooltip>
              <Tooltip title={"Editar"} place="top">
                <ButtonIcon icon="edit" onClick={() => onEdit && onEdit()} size="sm" />
              </Tooltip>
              {isSmartphone && (
                <Tooltip title={expanded ? "Recolher" : "Expandir"} place="top">
                  <ButtonIcon
                    icon={expanded ? "expand_less" : "expand_more"}
                    onClick={() => setExpanded(!expanded)}
                    size="sm"
                  />
                </Tooltip>
              )}
            </>
          ) : (
            <Skeleton size="sm" />
          )}
        </Col>
      </Row>

      <Row className="justify-content-between align-items-center mb-2">
        <Col className="d-flex align-items-center gap-2">
          {item ? (
            <Heading size="xs" title={item.name}>
              {item.name}
            </Heading>
          ) : (
            <Skeleton size="sm" />
          )}
        </Col>
      </Row>

      <Row className="justify-content-between mb-2">
        <Col className="d-flex align-items-center gap-2">
          {item ? (
            <>
              <Heading size="xxs">Telefone:</Heading>
              <Paragraph
                size="xs"
                title={`${item.phone}${item.phone ? ` (Ramal: ${item.extension})` : ""}`}
              >
                {phoneNumberMask(item.phone).formatted}
                {item.extension && ` (Ramal: ${item.extension})`}
              </Paragraph>
            </>
          ) : (
            <Skeleton size="sm" />
          )}
        </Col>
      </Row>

      {(!isSmartphone || expanded) && (
        <>
          <Row className="justify-content-between mb-2">
            <Col className="d-flex align-items-center gap-2">
              {item ? (
                <>
                  <Heading size="xxs">E-mail:</Heading>
                  <Paragraph size="xs" title={item.email}>
                    {item.email}
                  </Paragraph>
                </>
              ) : (
                <Skeleton size="sm" />
              )}
            </Col>
          </Row>

          <Row className="justify-content-between mb-2">
            <Col className="d-flex align-items-center gap-2">
              {item ? (
                <>
                  <Heading size="xxs">Celular:</Heading>
                  <Paragraph size="xs" title={item.mobile}>
                    {phoneNumberMask(item.mobile).formatted}
                  </Paragraph>
                </>
              ) : (
                <Skeleton size="sm" />
              )}
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
}
