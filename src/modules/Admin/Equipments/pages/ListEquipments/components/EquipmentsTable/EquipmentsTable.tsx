import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Td, Tr } from "@shared/components/Core/Table";
import { Tag } from "@shared/components/Core/Tag";
import { Tooltip } from "@shared/components/Core/Tooltip";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { IEquipment } from "@/shared/hooks/services/Admin/useEquipments";
import { Row, Col } from "react-bootstrap";

interface Props {
  data: IEquipment;
  onEdit: () => void;
  onShowLogs?: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  isSmartphone?: boolean;
  isTablet?: boolean;
}

export function EquipmentsTable({ 
  data, 
  onEdit, 
  onShowLogs, 
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
          <Paragraph size="sm">{data.idEquipamento}</Paragraph>
        </Td>

        <Td>
          <Paragraph size="sm" title={data.nomeEquipamento}>{data.nomeEquipamento}</Paragraph>
        </Td>

        <Td>
          <Paragraph size="sm" title={data.nmTipoPeca}>{data.nmTipoPeca}</Paragraph>
        </Td>

        <Td hideOnMobile={true}>
          <Paragraph size="sm" title={data.ttPontoInspecao.toString()}>{data.ttPontoInspecao}</Paragraph>
        </Td>

        <Td hideOnMobile={isSmartphone}>
          <Paragraph size="sm" title={data.nomeCliente}>{data.nomeCliente}</Paragraph>
        </Td>

        <Td>
          <div className="d-flex justify-content-center">
            <Tag size="lg" status={data.inStatusCadastroEquipamento ? "success" : "warning"}>
              {data.dsStatusCadastroEquipamento}
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

            {/* <Tooltip title="Visualizar Logs" place="top-start">
              <ButtonIcon size="sm" icon="open_in_new" onClick={() => onShowLogs()} />
            </Tooltip> */}
          </div>
        </Td>
      </Tr>
      
      {/* Mobile expanded details row */}
      {isSmartphone && expanded && (
        <Tr className="no-hover">
          <Td colSpan={7}>
            <div className="p-2 bg-light rounded">
              <Row className="mb-2">
                <Col xs={5}>
                  <Heading size="xxs">Pontos de Inspeção:</Heading>
                </Col>
                <Col xs={7}>
                  <Paragraph size="sm">{data.ttPontoInspecao}</Paragraph>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={5}>
                  <Heading size="xxs">Cliente:</Heading>
                </Col>
                <Col xs={7}>
                  <Paragraph size="sm">{data.nomeCliente}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col xs={5}>
                  <Heading size="xxs">Observação:</Heading>
                </Col>
                <Col xs={7}>
                  <Paragraph size="sm">{data.dsObservacao || "Nenhuma observação"}</Paragraph>
                </Col>
              </Row>
            </div>
          </Td>
        </Tr>
      )}
    </>
  );
}