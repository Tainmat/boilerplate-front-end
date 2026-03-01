import {
  Backdrop,
  CloseButton,
  Content,
  Dialog,
  DrawerHandle,
} from "@shared/components/Core/Alert/Alert.styles";
import { Button } from "@shared/components/Core/Buttons/Button";
import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { InputDatePicker } from "@shared/components/Core/Form/Fields/InputDatePicker";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";

import { formatDate } from "@/shared/utils/date";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (initialDate: string, finalDate: string) => void;
}

export function ExportExcelModal({ isOpen, onClose, onConfirm }: Props) {
  const [initialDate, setInitialDate] = useState<Date | null>(null);
  const [finalDate, setFinalDate] = useState<Date | null>(null);

  if (!isOpen) return null;

  const isFinalBeforeInitial = !!(initialDate && finalDate && finalDate < initialDate);
  const isValid = !!initialDate && !!finalDate && !isFinalBeforeInitial;

  function handleClose() {
    setInitialDate(null);
    setFinalDate(null);
    onClose();
  }

  function handleConfirm() {
    if (!initialDate || !finalDate) return;
    onConfirm(
      formatDate(initialDate, "yyyy-MM-dd"),
      formatDate(finalDate, "yyyy-MM-dd"),
    );
    setInitialDate(null);
    setFinalDate(null);
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
                <Heading size="xs">Exportar Excel</Heading>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col xs={12} md={6} className="mb-3">
              <InputDatePicker
                label="Data inicial"
                name="initialReportStartDate"
                value={initialDate ?? undefined}
                onChange={(date) => setInitialDate(date)}
              />
            </Col>

            <Col xs={12} md={6} className="mb-3">
              <InputDatePicker
                label="Data final"
                name="finalReportStartDate"
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

          <Row className="justify-content-end g-2 mt-2">
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
                Exportar
              </Button>
            </Col>
          </Row>
        </Content>
      </Dialog>
    </Backdrop>
  );
}
