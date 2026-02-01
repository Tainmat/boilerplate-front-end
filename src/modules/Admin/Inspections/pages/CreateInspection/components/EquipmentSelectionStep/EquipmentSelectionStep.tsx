import { Button } from "@shared/components/Core/Buttons/Button";
import { InputText } from "@shared/components/Core/Form/Fields/InputText";
import { useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { EmptyResult } from "@/shared/components/Core/EmptyResult";
import { useDropdownsRedux } from "@/shared/hooks/redux/useDropdownsRedux";
import { IEquipmentDropdown } from "@/shared/store/modules/Dropdowns";

import { CardEquipment } from "./components/CardEquipment";

interface Props {
  onEquipmentSelect: (equipment: IEquipmentDropdown) => void;
  onCancel: () => void;
}

export function EquipmentSelectionStep({ onEquipmentSelect, onCancel }: Props) {
  const { equipmentsDropdown } = useDropdownsRedux();
  const [searchValue, setSearchValue] = useState("");

  const filteredEquipments = useMemo(() => {
    return equipmentsDropdown.filter((equipment) =>
      equipment.name.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [equipmentsDropdown, searchValue]);

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

      <Row>
        {filteredEquipments.length > 0 ? (
          filteredEquipments.map((item) => (
            <Col lg={4} md={6} xs={12} className="mb-4" key={item.id}>
              <CardEquipment equipment={item} onSelect={() => onEquipmentSelect(item)} />
            </Col>
          ))
        ) : (
          <EmptyResult onClick={() => setSearchValue("")} />
        )}
      </Row>

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
