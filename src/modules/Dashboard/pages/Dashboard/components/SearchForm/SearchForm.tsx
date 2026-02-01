import { parseISO } from "date-fns";
import { Col, Row } from "react-bootstrap";

import { InputDatePicker } from "@/shared/components/Core/Form/Fields/InputDatePicker";
import { Select } from "@/shared/components/Core/Form/Fields/Select";
import { IOption } from "@/shared/components/Core/Form/Fields/Select/Select.interface";
import { Switch } from "@/shared/components/Core/Form/Fields/Switch";
import { Paragraph } from "@/shared/components/Core/Typography/Paragraph";
import { useCustomersDropdown } from "@/shared/hooks/services/Admin/Dropdown/useCustomersDropdown";

import { IDashboardParams } from "../../useDashboardRules";

export interface Props {
  initialValues?: IDashboardParams | null;
  onSearch: (params: IDashboardParams) => void;
  autoRefreshEnabled: boolean;
  handleAutoRefreshToggle: (enabled: boolean) => void;
  lastUpdated: Date;
}

export function DashboardSearchForm({
  initialValues,
  onSearch,
  autoRefreshEnabled,
  handleAutoRefreshToggle,
  lastUpdated,
}: Props) {
  const { result: CUSTOMER_OPTIONS } = useCustomersDropdown({ onlyActive: false });

  const initialReportStartDate = initialValues?.initialReportStartDate
    ? parseISO(initialValues.initialReportStartDate)
    : undefined;
  const finalReportStartDate = initialValues?.finalReportStartDate
    ? parseISO(initialValues.finalReportStartDate)
    : undefined;

  return (
    <>
      <Row className="mb-4">
        {/* Filtro de período */}
        <Col lg={2} md={3} sm={12} className="mb-3 mb-md-0">
          <InputDatePicker
            value={initialReportStartDate}
            label="Data Inicial"
            name="initialReportStartDate"
            placeholder="Data inicial"
            onChange={(value) => {
              const initialDate = value ? value.toISOString().split("T")[0] : "";
              onSearch({
                initialReportStartDate: initialDate,
                finalReportStartDate: initialValues?.finalReportStartDate || "",
                customerId: initialValues?.customerId || "",
              });
            }}
          />
        </Col>
        <Col lg={2} md={3} sm={12} className="mb-3 mb-md-0">
          <InputDatePicker
            value={finalReportStartDate}
            label="Data Final"
            name="finalReportStartDate"
            placeholder="Data final"
            onChange={(value) => {
              const finalDate = value ? value.toISOString().split("T")[0] : "";
              onSearch({
                initialReportStartDate: initialValues?.initialReportStartDate || "",
                finalReportStartDate: finalDate,
                customerId: initialValues?.customerId || "",
              });
            }}
          />
        </Col>
        <Col lg={4} md={6} sm={12} className="mb-3 mb-md-0">
          <Select
            value={
              CUSTOMER_OPTIONS.length < 2 ? CUSTOMER_OPTIONS[0]?.value : initialValues?.customerId
            }
            options={CUSTOMER_OPTIONS}
            label="Cliente"
            name="customerId"
            placeholder="Selecione um cliente"
            disabled={CUSTOMER_OPTIONS.length < 2}
            onChange={({ value }: IOption) => {
              onSearch({
                initialReportStartDate: initialValues?.initialReportStartDate || "",
                finalReportStartDate: initialValues?.finalReportStartDate || "",
                customerId: String(value),
              });
            }}
            onReset={() => {
              onSearch({
                initialReportStartDate: initialValues?.initialReportStartDate || "",
                finalReportStartDate: initialValues?.finalReportStartDate || "",
                customerId: "",
              });
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col md={6} sm={12} className="d-flex align-items-end justify-content-between">
          <Switch
            label="Atualização automática"
            checked={autoRefreshEnabled}
            onChange={(e) => handleAutoRefreshToggle(e.target.checked)}
          />
        </Col>

        <Col>
          <Paragraph size="xs" className="text-muted text-end">
            Última atualização: {lastUpdated.toLocaleTimeString()}
          </Paragraph>
        </Col>
      </Row>
    </>
  );
}
