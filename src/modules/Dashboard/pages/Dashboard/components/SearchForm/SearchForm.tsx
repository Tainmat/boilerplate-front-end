import { InputDatePicker } from "@/shared/components/Core/Form/Fields/InputDatePicker";
import { Select } from "@/shared/components/Core/Form/Fields/Select";
import { IOption } from "@/shared/components/Core/Form/Fields/Select/Select.interface";
import { useCustomersDropdown } from "@/shared/hooks/services/Admin/Dropdown/useCustomersDropdown";
import { IDashboardParams } from "@/shared/hooks/services/Dashboard/useDashboard";
import { parseISO } from "date-fns";
import { Col, Row } from "react-bootstrap";

export interface Props {
  initialValues?: IDashboardParams | null;
  onSearch: (params: IDashboardParams) => void;
}

export function DashboardSearchForm({ initialValues, onSearch }: Props) {
  const { result: CUSTOMER_OPTIONS } = useCustomersDropdown({ onlyActive: true });

  const initialReportStartDate = initialValues?.initialReportStartDate
    ? parseISO(initialValues.initialReportStartDate)
    : undefined;
  const finalReportStartDate = initialValues?.finalReportStartDate
    ? parseISO(initialValues.finalReportStartDate)
    : undefined;

  return (
    <Row className="mb-4">
      {/* Filtro de período */}
      <Col md={2} sm={12} className="mb-3 mb-md-0">
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

      <Col md={2} sm={12} className="mb-3 mb-md-0">
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

      <Col md={4} sm={12} className="mb-3 mb-md-0">
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
          onReset={() => console.log("resetei")}
        />
      </Col>

      {/* Auto-refresh e Exportar
      <Col md={6} sm={12} className="d-flex align-items-end justify-content-between">
        <Form.Check
          type="switch"
          id="auto-refresh"
          label="Atualização automática"
          checked={autoRefreshEnabled}
          onChange={(e) => handleAutoRefreshToggle(e.target.checked)}
        />
      </Col> */}
    </Row>
  );
}
