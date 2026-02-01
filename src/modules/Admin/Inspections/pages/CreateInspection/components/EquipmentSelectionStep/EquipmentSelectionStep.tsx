import { Button } from "@shared/components/Core/Buttons/Button";
import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { InputText } from "@shared/components/Core/Form/Fields/InputText";
import { Table, Tbody, Td, Th, Thead, Tr } from "@shared/components/Core/Table";
import { Empty } from "@shared/components/Core/Table/Empty";
import { LoadingLines } from "@shared/components/Core/Table/LoadingLines";
import { Tag } from "@shared/components/Core/Tag";
import { Tooltip } from "@shared/components/Core/Tooltip";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { IEquipment, useEquipments } from "@shared/hooks/services/Admin/useEquipments";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

interface Props {
  onEquipmentSelect: (equipment: IEquipment) => void;
  onCancel: () => void;
}

export function EquipmentSelectionStep({ onEquipmentSelect, onCancel }: Props) {
  const { result, setParams } = useEquipments();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setParams({
      searchIn: "name",
      value: searchValue,
      status: "active",
      items: 10,
      page: 1,
      order: "name",
    });
  }, [searchValue, setParams]);

  return (
    <div>
      <Row className="mb-4">
        <Col lg={8} md={12}>
          <InputText
            name="search"
            label="Buscar equipamento"
            placeholder="Digite o nome do equipamento"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            helperText="Apenas equipamentos ativos são exibidos"
          />
        </Col>
      </Row>

      <Table $responsive>
        <Thead>
          <Tr>
            <Th>
              <Heading size="xs">Nome</Heading>
            </Th>
            <Th className="d-none d-md-table-cell">
              <Heading size="xs">Descrição</Heading>
            </Th>
            <Th className="d-none d-lg-table-cell">
              <div className="d-flex justify-content-center">
                <Heading size="xs">Pontos de Inspeção</Heading>
              </div>
            </Th>
            <Th className="d-none d-sm-table-cell">
              <div className="d-flex justify-content-center">
                <Heading size="xs">Status</Heading>
              </div>
            </Th>
            <Th>
              <div className="d-flex justify-content-center">
                <Heading size="xs">Ações</Heading>
              </div>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {!result ? (
            <LoadingLines lines={5} columns={5} />
          ) : result.data.length > 0 ? (
            result.data.map((equipment) => (
              <Tr key={equipment.id}>
                <Td>
                  <div>
                    <Paragraph size="sm" title={equipment.name}>
                      {equipment.name}
                    </Paragraph>
                    <small className="text-muted d-md-none">
                      {equipment.description || "Nenhuma descrição"}
                    </small>
                  </div>
                </Td>
                <Td className="d-none d-md-table-cell">
                  <Paragraph size="sm" title={equipment.description}>
                    {equipment.description || "Nenhuma descrição"}
                  </Paragraph>
                </Td>
                <Td className="d-none d-lg-table-cell">
                  <div className="d-flex justify-content-center">
                    <Paragraph size="sm" title={equipment.totalInspectionPoints.toString()}>
                      {equipment.totalInspectionPoints}
                    </Paragraph>
                  </div>
                </Td>
                <Td className="d-none d-sm-table-cell">
                  <div className="d-flex justify-content-center">
                    <Tag size="lg" status="success">
                      Ativo
                    </Tag>
                  </div>
                </Td>
                <Td>
                  <div className="d-flex justify-content-center">
                    <Tooltip title="Selecionar equipamento" place="top-start">
                      <ButtonIcon
                        size="sm"
                        icon="check"
                        onClick={() => onEquipmentSelect(equipment)}
                      />
                    </Tooltip>
                  </div>
                </Td>
              </Tr>
            ))
          ) : (
            <Empty columns={5} />
          )}
        </Tbody>
      </Table>

      <Row className="justify-content-end mt-4">
        <Col xs="auto">
          <Button type="button" styles="primary" mode="warning" onClick={onCancel}>
            Cancelar
          </Button>
        </Col>
      </Row>
    </div>
  );
}
