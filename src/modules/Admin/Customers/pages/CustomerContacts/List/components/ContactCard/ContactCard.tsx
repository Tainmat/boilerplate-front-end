import "./ContactCard.style.css";

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
import { fakeRequest } from "@/shared/services/api/api.service";
import { customerContacts } from "@/shared/hooks/services/Admin/useCustomerContacts";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { useState } from "react";

interface Props {
  item?: ICustomerContacts;
  onRefetch?: () => void;
  onEdit?: () => void;
}

export function ContactCard({ item, onRefetch, onEdit }: Props) {
  const { isSmartphone } = useDeviceDetection();
  const [expanded, setExpanded] = useState(false);

  async function handleOnActive(uuid: string) {
    try {
      const index = customerContacts.findIndex((c) => c.uuidContatoCliente === uuid);

      if (index === -1) {
        throw new Error("Contato não encontrado");
      }

      customerContacts[index] = {
        ...customerContacts[index],
        inStatusCadastroContatoCliente: true,
        dsStatusCadastroContatoCliente: "Ativo",
      };

      await fakeRequest(500); // simula atraso de requisição

      onRefetch && onRefetch();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleOnInactive(uuid: string) {
    try {
      const index = customerContacts.findIndex((c) => c.uuidContatoCliente === uuid);

      if (index === -1) {
        throw new Error("Contato não encontrado");
      }

      customerContacts[index] = {
        ...customerContacts[index],
        inStatusCadastroContatoCliente: false,
        dsStatusCadastroContatoCliente: "Inativo",
      };

      await fakeRequest(500); // simula atraso de requisição

      onRefetch && onRefetch();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card className="card-contact">
      <Row className="mb-2">
        <Col className="d-flex align-items-center gap-2">
          {item ? (
            <>
              <div className="d-flex align-items-center gap-2">
                <Tooltip title={"Responsável Legal"} place="top">
                  <Icon icon="admin_panel_settings" size="sm" disabled={!item.inResponsavelLegal} />
                </Tooltip>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Tooltip title={"Responsável Técnico"} place="top">
                  <Icon icon="engineering" size="sm" disabled={!item.inResponsavelTecnico} />
                </Tooltip>
              </div>

              <div className="d-flex align-items-center gap-2">
                <Tooltip title={"Recebe e-mail"} place="top">
                  <Icon icon="mail" size="sm" disabled={!item.inRecebeEmail} />
                </Tooltip>
              </div>
              
              <div className="d-flex align-items-center gap-2">
                <Tooltip title={"WhatsApp"} place="top">
                  <Icon icon="whatsapp" size="sm" disabled={!item.inWhatsAppContatoCliente} />
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
              <Tooltip
                title={item.inStatusCadastroContatoCliente ? "Inativar" : "Ativar"}
                place="top"
              >
                <Switch
                  size="sm"
                  checked={item.inStatusCadastroContatoCliente}
                  onChange={() => {
                    item.inStatusCadastroContatoCliente
                      ? handleOnInactive(item.uuidContatoCliente)
                      : handleOnActive(item.uuidContatoCliente);
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
          {item ? <Heading size="xs" title={item.nomeContatoCliente}>{item.nomeContatoCliente}</Heading> : <Skeleton size="sm" />}
        </Col>
      </Row>

      <Row className="justify-content-between mb-2">
        <Col className="d-flex align-items-center gap-2">
          {item ? (
            <>
              <Heading size="xxs">Telefone:</Heading>
              <Paragraph size="xs" title={`${item.numeroTelefoneContatoCliente}${item.numeroRamalContatoCliente ? ` (Ramal: ${item.numeroRamalContatoCliente})` : ''}`}>
                {item.numeroTelefoneContatoCliente}
                {item.numeroRamalContatoCliente && ` (Ramal: ${item.numeroRamalContatoCliente})`}
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
                  <Paragraph size="xs" title={item.dsEmailContatoCliente}>{item.dsEmailContatoCliente}</Paragraph>
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
                  <Paragraph size="xs" title={item.numeroCelularContatoCliente}>{item.numeroCelularContatoCliente}</Paragraph>
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