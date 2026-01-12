import { cnpjMask, phoneNumberMask } from "@/shared/utils/masks";
import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Td, Tr } from "@shared/components/Core/Table";
import { Tag } from "@shared/components/Core/Tag";
import { Tooltip } from "@shared/components/Core/Tooltip";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { Col, Row } from "react-bootstrap";

import { ICustomer } from "@/shared/hooks/services/Admin/useCustomers";

interface Props {
  data: ICustomer;
  onEdit: () => void;
  onOpenContacts: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  isSmartphone?: boolean;
  isRegister: boolean;
}

export function CustomersTable({
  data,
  onEdit,
  onOpenContacts,
  expanded,
  onToggleExpand,
  isSmartphone,
  isRegister,
}: Props) {
  return (
    <>
      <Tr expandable={isSmartphone} expanded={expanded} onToggleExpand={onToggleExpand}>
        <Td>
          <Paragraph size="sm">{cnpjMask(data.cnpj)}</Paragraph>
        </Td>

        <Td>
          <Paragraph size="sm" title={data.corporateName}>
            {data.corporateName}
          </Paragraph>
        </Td>

        {/* <Td>
          <Paragraph size="sm" title={data.fantasyName}>
            {data.corporateName}
          </Paragraph>
        </Td> */}

        <Td hideOnMobile={isSmartphone}>
          <Paragraph size="sm" title={data.city}>
            {data.city}
          </Paragraph>
        </Td>

        {/* <Td hideOnMobile={true}>
          <Paragraph size="sm" title={data.state}>
            {data.state}
          </Paragraph>
        </Td> */}

        <Td hideOnMobile={isSmartphone}>
          <Paragraph size="sm" title={data.phone}>
            {phoneNumberMask(data.phone).formatted}
          </Paragraph>
        </Td>

        <Td hideOnMobile={isSmartphone}>
          <Paragraph size="sm" title={data.email}>
            {data.email}
          </Paragraph>
        </Td>

        <Td>
          <div className="d-flex justify-content-center">
            <Tag size="lg" status={data.isActive ? "success" : "warning"}>
              {data.isActive ? "Ativo" : "Inativo"}
            </Tag>
          </div>
        </Td>

        {isRegister && (
          <Td>
            <div className="d-flex justify-content-center">
              <Tooltip title="Editar" place="top-start">
                <ButtonIcon
                  size="sm"
                  icon="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                />
              </Tooltip>

              <Tooltip title="Contatos" place="top-start">
                <ButtonIcon
                  size="sm"
                  icon="contacts"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenContacts();
                  }}
                />
              </Tooltip>
            </div>
          </Td>
        )}
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
                  <Paragraph size="sm">{data.city}</Paragraph>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4}>
                  <Heading size="xxs">UF:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.state}</Paragraph>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4}>
                  <Heading size="xxs">E-mail:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.email}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <Heading size="xxs">Telefone:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.phone}</Paragraph>
                </Col>
              </Row>
            </div>
          </Td>
        </Tr>
      )}
    </>
  );
}
