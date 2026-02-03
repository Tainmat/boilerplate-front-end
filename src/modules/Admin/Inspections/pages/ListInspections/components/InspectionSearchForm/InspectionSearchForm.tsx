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

import { IInspectionSearchForm, initialInspectionSearchValues } from "./InspectionSearchForm.form";

interface Props {
  searchOptions: IOption[];
  defaultValues?: IInspectionSearchForm | null;
  onSubmit?: (data: IInspectionSearchForm) => void;
  onAdd?: () => void;
}

export function InspectionSearchForm({ searchOptions, defaultValues, onSubmit, onAdd }: Props) {
  useDeviceDetection();
  const [initialValues, setInitialValues] = useState<IInspectionSearchForm | null>(null);
  const { inspectionStatusDropdown } = useDropdownsRedux();

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
                <Row className="align-items-end mb-3">
                  <Col xs={12} md={3}>
                    <Field
                      as={SelectSearch}
                      placeholder="Pesquisar por"
                      name="searchingBy"
                      value={values.searchingBy}
                      options={searchOptions}
                      readOnly={searchOptions.length === 1}
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

                  <Col xs={12} md={4}>
                    <Field
                      as={InputSearch}
                      placeholder="Pesquisar"
                      name="search"
                      type="text"
                      submitForm
                      disabled={!values.searchingBy}
                      onReset={() => {
                        setFieldValue("search", "");
                        submitForm();
                      }}
                    />
                  </Col>

                  <Col xs={12} md={3}>
                    <Field
                      as={SelectSearch}
                      name="inspectionStatusId"
                      placeholder="Status da Inspeção"
                      value={values.inspectionStatusId}
                      options={[{ label: "Todos", value: "" }, ...inspectionStatusOptions]}
                      onChange={({ value }: IOption) => {
                        setFieldValue("inspectionStatusId", value);
                        submitForm();
                      }}
                      onReset={() => {
                        setFieldValue("inspectionStatusId", "");
                      }}
                    />
                  </Col>

                  <Col xs={12} md={2} className="d-flex align-items-center justify-content-end ">
                    <div className="d-flex gap-2">
                      <Tooltip title="Buscar" place="top-start">
                        <ButtonIcon type="submit" size="lg" icon="search" mode="helper" />
                      </Tooltip>
                      {onAdd && (
                        <Tooltip title="Adicionar" place="top-start">
                          <ButtonIcon
                            type="button"
                            size="lg"
                            mode="success"
                            icon="add"
                            onClick={() => onAdd()}
                          />
                        </Tooltip>
                      )}
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Tooltip title="Buscar" place="top-start">
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
                    </Tooltip>
                  </Col>
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
