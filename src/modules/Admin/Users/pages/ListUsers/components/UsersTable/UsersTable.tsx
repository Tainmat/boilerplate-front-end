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
          <Paragraph size="sm">{data.idUsuario}</Paragraph>
        </Td>

        <Td>
          <Paragraph size="sm" title={data.nomeUsuario}>{data.nomeUsuario}</Paragraph>
        </Td>

        <Td hideOnMobile={true}>
          <Paragraph size="sm" title={data.nomeSocialUsuario || "-"}>{data.nomeSocialUsuario || "-"}</Paragraph>
        </Td>

        <Td hideOnMobile={isSmartphone}>
          <Paragraph size="sm" title={data.emailUsuario}>{data.emailUsuario}</Paragraph>
        </Td>

        <Td hideOnMobile={true}>
          <Paragraph size="sm" title={data.dsPerfil || "-"}>{data.dsPerfil || "-"}</Paragraph>
        </Td>

        <Td>
          <div className="d-flex justify-content-center">
            <Tag size="lg" status={data.inStatusCadastroUsuario ? "success" : "warning"}>
              {data.dsStatusCadastroUsuario}
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
                  <Paragraph size="sm">{data.emailUsuario}</Paragraph>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={4}>
                  <Heading size="xxs">Nome Social:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.nomeSocialUsuario || "-"}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <Heading size="xxs">Perfil:</Heading>
                </Col>
                <Col xs={8}>
                  <Paragraph size="sm">{data.dsPerfil || "-"}</Paragraph>
                </Col>
              </Row>
            </div>
          </Td>
        </Tr>
      )}
    </>
  );
}