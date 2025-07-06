import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Td, Tr } from "@shared/components/Core/Table";
import { Tag } from "@shared/components/Core/Tag";
import { Tooltip } from "@shared/components/Core/Tooltip";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Row, Col } from "react-bootstrap";

import { ICustomer } from "@/shared/hooks/services/Admin/useCustomers";

interface Props {
  data: ICustomer;
  onEdit: () => void;
  onShowLogs?: () => void;
  onOpenContacts: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  isSmartphone?: boolean;
  isTablet?: boolean;
}

export function CustomersTable({ 
  data, 
  onEdit, 
  onShowLogs, 
  onOpenContacts,
  expanded,
  onToggleExpand,
  isSmartphone,
  isTablet
}: Props) {
  return (
    <>
      <Tr 
        expandable={isSmartphone} 
        expanded={expanded}
        onToggleExpand={onToggleExpand}
      >
        <Td>
          <Paragraph size="sm">{data.idCliente}</Paragraph>
        </Td>

        <Td>
          <Paragraph size="sm" title={data.nomeRazaoSocialCliente}>{data.nomeRazaoSocialCliente}</Paragraph>
        </Td>

        <Td hideOnMobile={isSmartphone}>
          <Paragraph size="sm" title={data.dsMunicipioCliente}>{data.dsMunicipioCliente}</Paragraph>
        </Td>

        <Td hideOnMobile={true}>
          <Paragraph size="sm" title={data.dsUfCliente}>{data.dsUfCliente}</Paragraph>
        </Td>
        
        <Td hideOnMobile={isSmartphone}>
          <Paragraph size="sm" title={data.dsEmailCliente}>{data.dsEmailCliente}</Paragraph>
        </Td>

        <Td>
          <div className="d-flex justify-content-center">
            <Tag size="lg" status={data.inStatusCadastroCliente ? "success" : "warning"}>
              {data.dsStatusCadastroCliente}
            </Tag>
          </div>
        </Td>

        <Td>
          <div className="d-flex justify-content-center">
            <Tooltip title="Editar" place="top-start">
              <ButtonIcon size="sm" icon="edit" onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }} />
            </Tooltip>

            <Tooltip title="Contatos" place="top-start">
              <ButtonIcon size="sm" icon="contacts" onClick={(e) => {
                e.stopPropagation();
                onOpenContacts();
              }} />
            </Tooltip>
          </div>
        </Td>
      </Tr>
      
      {/* Mobile expanded details row */}
      {isSmartphone && expanded && (
        <Tr className="no-hover">
          <Td colSpan={7}>
            <div className="p-2 bg-light rounded">
              <Row className="mb-2">
                <Col xs={4}>
                  <Heading size="xxs">Município:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.dsMunicipioCliente}</Paragraph>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4}>
                  <Heading size="xxs">UF:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.dsUfCliente}</Paragraph>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4}>
                  <Heading size="xxs">E-mail:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.dsEmailCliente}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <Heading size="xxs">Telefone:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.numeroTelefoneCliente}</Paragraph>
                </Col>
              </Row>
            </div>
          </Td>
        </Tr>
      )}
    </>
  );
}