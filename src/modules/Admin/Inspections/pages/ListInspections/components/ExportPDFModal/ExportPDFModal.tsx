import {
  Backdrop,
  CloseButton,
  Content,
  Dialog,
  DrawerHandle,
} from "@shared/components/Core/Alert/Alert.styles";
import { Button } from "@shared/components/Core/Buttons/Button";
import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Checkbox } from "@shared/components/Core/Form/Fields/Checkbox";
import { InputDatePicker } from "@shared/components/Core/Form/Fields/InputDatePicker";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";

import { formatDate } from "@/shared/utils/date";

import {
  AVAILABLE_PDF_FIELDS,
  PDF_FIELD_LABELS,
} from "../InspectionListPDFReport/inspectionPdfFields";

const MAX_FIELDS = 7;

const DEFAULT_FIELDS = [
  "reportNumber",
  "reportStartDate",
  "reportEndDate",
  "componentId",
  "customer",
  "inspectorUser",
  "inspectionStatus",
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (initialDate: string, finalDate: string, fields: string[]) => void;
}

export function ExportPDFModal({ isOpen, onClose, onConfirm }: Props) {
  const [initialDate, setInitialDate] = useState<Date | null>(null);
  const [finalDate, setFinalDate] = useState<Date | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>(DEFAULT_FIELDS);

  if (!isOpen) return null;

  const isFinalBeforeInitial = !!(initialDate && finalDate && finalDate < initialDate);
  const isDatesValid = !!initialDate && !!finalDate && !isFinalBeforeInitial;
  const isFieldsValid = selectedFields.length >= 1 && selectedFields.length <= MAX_FIELDS;
  const isValid = isDatesValid && isFieldsValid;

  const isAtMaxFields = selectedFields.length >= MAX_FIELDS;

  function handleClose() {
    setInitialDate(null);
    setFinalDate(null);
    setSelectedFields(DEFAULT_FIELDS);
    onClose();
  }

  function handleConfirm() {
    if (!initialDate || !finalDate || !isValid) return;
    onConfirm(
      formatDate(initialDate, "yyyy-MM-dd"),
      formatDate(finalDate, "yyyy-MM-dd"),
      selectedFields,
    );
    setInitialDate(null);
    setFinalDate(null);
    setSelectedFields(DEFAULT_FIELDS);
  }

  function handleToggleField(field: string) {
    setSelectedFields((prev) => {
      if (prev.includes(field)) {
        return prev.filter((f) => f !== field);
      }
      if (prev.length >= MAX_FIELDS) return prev;
      return [...prev, field];
    });
  }

  return (
    <Backdrop>
      <Dialog>
        <Content>
          <DrawerHandle />

          <CloseButton>
            <ButtonIcon size="md" icon="close" onClick={handleClose} />
          </CloseButton>

          <Row>
            <Col xs="auto">
              <div className="d-flex align-items-center gap-2">
                <Heading size="xs">Exportar PDF</Heading>
              </div>
            </Col>
          </Row>

          {/* Range de datas */}
          <Row className="mt-3">
            <Col xs={12} md={6} className="mb-3">
              <InputDatePicker
                label="Data inicial"
                name="startDate"
                value={initialDate ?? undefined}
                onChange={(date) => setInitialDate(date)}
              />
            </Col>

            <Col xs={12} md={6} className="mb-3">
              <InputDatePicker
                label="Data final"
                name="endDate"
                value={finalDate ?? undefined}
                error={isFinalBeforeInitial}
                helperText={
                  isFinalBeforeInitial
                    ? "A data final não pode ser anterior à data inicial."
                    : undefined
                }
                onChange={(date) => setFinalDate(date)}
              />
            </Col>
          </Row>

          {/* Seleção de campos */}
          <Row className="mb-2">
            <Col className="d-flex align-items-center justify-content-between">
              <Heading size="xs">Campos do relatório</Heading>

              <span className={`badge ${isAtMaxFields ? "bg-warning text-dark" : "bg-secondary"}`}>
                {selectedFields.length}/{MAX_FIELDS}
              </span>
            </Col>
          </Row>

          <div>
            <Row>
              {AVAILABLE_PDF_FIELDS.map((field) => {
                const isChecked = selectedFields.includes(field);
                const isDisabled = !isChecked && isAtMaxFields;

                return (
                  <Col key={field} xs={6} md={4} className="mb-1">
                    <Checkbox
                      name={field}
                      description={PDF_FIELD_LABELS[field]}
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => handleToggleField(field)}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* Ações */}
          <Row className="justify-content-end g-2 mt-3">
            <Col xs={12} sm="auto">
              <Button type="button" styles="tertiary" display="block" onClick={handleClose}>
                Cancelar
              </Button>
            </Col>

            <Col xs={12} sm="auto">
              <Button
                type="button"
                styles="primary"
                mode="success"
                display="block"
                disabled={!isValid}
                onClick={handleConfirm}
              >
                Gerar PDF
              </Button>
            </Col>
          </Row>
        </Content>
      </Dialog>
    </Backdrop>
  );
}
