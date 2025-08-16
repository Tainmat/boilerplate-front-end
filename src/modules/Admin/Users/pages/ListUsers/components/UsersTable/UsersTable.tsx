import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Td, Tr } from "@shared/components/Core/Table";
import { Tag } from "@shared/components/Core/Tag";
import { Tooltip } from "@shared/components/Core/Tooltip";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { IUsers } from "@shared/hooks/services/Admin/useUsers";
import { Row, Col } from "react-bootstrap";

interface Props {
  data: IUsers;
  onEdit: () => void;
  onShowLogs?: () => void;
  onAddProfile?: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  isSmartphone?: boolean;
  isTablet?: boolean;
}

export function UsersTable({
  data,
  onEdit,
  onShowLogs,
  onAddProfile,
  expanded,
  onToggleExpand,
  isSmartphone,
  isTablet,
}: Props) {
  return (
    <>
      <Tr expandable={isSmartphone} expanded={expanded} onToggleExpand={onToggleExpand}>
        {/* <Td>
          <Paragraph size="sm">{data.id}</Paragraph>
        </Td> */}

        <Td>
          <Paragraph size="sm" title={data.name}>
            {data.name}
          </Paragraph>
        </Td>

        <Td hideOnMobile={true}>
          <Paragraph size="sm" title={data.socialName || "-"}>
            {data.socialName || "-"}
          </Paragraph>
        </Td>

        <Td hideOnMobile={isSmartphone}>
          <Paragraph size="sm" title={data.email}>
            {data.email}
          </Paragraph>
        </Td>

        <Td hideOnMobile={true}>
          <Paragraph size="sm" title={data.profileName || "-"}>
            {data.profileName || "-"}
          </Paragraph>
        </Td>

        <Td>
          <div className="d-flex justify-content-center">
            <Tag size="lg" status={data.isActive ? "success" : "warning"}>
              {data.isActive ? "Ativo" : "Inativo"}
            </Tag>
          </div>
        </Td>

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
                  <Heading size="xxs">E-mail:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.email}</Paragraph>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4}>
                  <Heading size="xxs">Nome Social:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.socialName || "-"}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <Heading size="xxs">Perfil:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.profileName || "-"}</Paragraph>
                </Col>
              </Row>
            </div>
          </Td>
        </Tr>
      )}
    </>
  );
}
