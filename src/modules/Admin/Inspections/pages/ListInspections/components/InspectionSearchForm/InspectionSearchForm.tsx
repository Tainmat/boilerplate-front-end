import { Button } from "@shared/components/Core/Buttons/Button";
import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { InputSearch } from "@shared/components/Core/Form/Fields/Search/Input";
import { SelectSearch } from "@shared/components/Core/Form/Fields/Search/Select";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { Tooltip } from "@shared/components/Core/Tooltip";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

import { Switch } from "@/shared/components/Core/Form/Fields/Switch";
import { useDropdownsRedux } from "@/shared/hooks/redux/useDropdownsRedux";
import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";

import { IInspectionSearchForm, initialInspectionSearchValues } from "./InspectionSearchForm.form";

interface Props {
  searchOptions: IOption[];
  defaultValues?: IInspectionSearchForm | null;
  onSubmit?: (data: IInspectionSearchForm) => void;
  onAdd?: () => void;
  onExport?: () => void;
  onExportPDF?: () => void;
  offline?: boolean;
}

export function InspectionSearchForm({
  searchOptions,
  defaultValues,
  onSubmit,
  onAdd,
  onExport,
  onExportPDF,
  offline,
}: Props) {
  useDeviceDetection();
  const [initialValues, setInitialValues] = useState<IInspectionSearchForm | null>(null);
  const { inspectionStatusDropdown } = useDropdownsRedux();
  const { isSystemAdmin } = useAuthRoles();

  const inspectionStatusOptions: IOption[] = inspectionStatusDropdown.map((item) => {
    return {
      label: item.description,
      value: item.id,
    };
  });

  useEffect(() => {
    if (initialValues === null) {
      if (defaultValues) {
        setInitialValues(defaultValues);
      } else if (searchOptions.length === 1) {
        setInitialValues({
          ...initialInspectionSearchValues,
          searchingBy: searchOptions[0].value,
        });
      } else {
        setInitialValues(initialInspectionSearchValues);
      }
    }
  }, [defaultValues, searchOptions, initialValues]);

  return (
    <Row>
      <Col>
        {initialValues ? (
          <Formik initialValues={initialValues} onSubmit={(values) => onSubmit && onSubmit(values)}>
            {({ values, setFieldValue, submitForm }) => (
              <Form>
                <Row className="align-items-end">
                  <Col xs={12} md={3} className="mb-3">
                    <Field
                      as={SelectSearch}
                      placeholder="Pesquisar por"
                      name="searchingBy"
                      value={values.searchingBy}
                      options={searchOptions}
                      readOnly={searchOptions.length === 1}
                      disabled={offline}
                      onChange={(option: IOption) => {
                        setFieldValue("searchingBy", option.value);
                        setFieldValue("search", "");
                      }}
                      onReset={() => {
                        setFieldValue("searchingBy", "");
                        setFieldValue("search", "");
                      }}
                    />
                  </Col>

                  <Col xs={12} md={4} className="mb-3">
                    <Field
                      as={InputSearch}
                      placeholder="Pesquisar"
                      name="search"
                      type="text"
                      submitForm
                      disabled={!values.searchingBy || offline}
                      onReset={() => {
                        setFieldValue("search", "");
                        submitForm();
                      }}
                    />
                  </Col>

                  <Col xs={12} md={3} className="mb-3">
                    <Field
                      as={SelectSearch}
                      name="inspectionStatusId"
                      placeholder="Status da Inspeção"
                      value={values.inspectionStatusId}
                      options={[{ label: "Todos", value: "" }, ...inspectionStatusOptions]}
                      disabled={offline}
                      onChange={({ value }: IOption) => {
                        setFieldValue("inspectionStatusId", value);
                        submitForm();
                      }}
                      onReset={() => {
                        setFieldValue("inspectionStatusId", "");
                      }}
                    />
                  </Col>

                  <Col
                    xs={12}
                    md={2}
                    className="d-flex align-items-center justify-content-end mb-3"
                  >
                    <div className="d-flex gap-2">
                      <Tooltip title="Buscar" place="top-start">
                        <ButtonIcon
                          type="submit"
                          size="lg"
                          icon="search"
                          mode="helper"
                          disabled={offline}
                        />
                      </Tooltip>
                      {onAdd && (
                        <Tooltip title="Adicionar" place="top-start">
                          <ButtonIcon
                            type="button"
                            size="lg"
                            mode="success"
                            icon="add"
                            disabled={offline}
                            onClick={() => onAdd()}
                          />
                        </Tooltip>
                      )}
                    </div>
                  </Col>
                </Row>

                <Row className="align-items-center justify-content-between">
                  <Col xs="auto">
                    <Field
                      as={Switch}
                      name="status"
                      checked={values.status === "all"}
                      description="Mostrar inativos"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue("status", e.target.checked ? "all" : "active");
                        submitForm();
                      }}
                    />
                  </Col>
                  {isSystemAdmin() && (onExport || onExportPDF) && (
                    <Col xs="auto" className="d-flex gap-2">
                      {onExport && (
                        <Button
                          type="button"
                          styles="primary"
                          icon="table_view"
                          disabled={offline}
                          onClick={onExport}
                        >
                          Exportar Excel
                        </Button>
                      )}
                      {onExportPDF && (
                        <Button
                          type="button"
                          styles="primary"
                          mode="warning"
                          icon="picture_as_pdf"
                          disabled={offline}
                          onClick={onExportPDF}
                        >
                          Exportar PDF
                        </Button>
                      )}
                    </Col>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        ) : (
          <Row className="mb-2">
            <Col xs={12} md={3} className="mb-3">
              <Skeleton size="lg" />
            </Col>
            <Col xs={12} md={4} className="mb-3">
              <Skeleton size="lg" />
            </Col>
            <Col xs={12} md={2} className="mb-3">
              <Skeleton size="lg" />
            </Col>
            <Col xs={12} md={3} className="mb-3">
              <Skeleton size="lg" />
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}
