import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { InputSearch } from "@shared/components/Core/Form/Fields/Search/Input";
import { SelectSearch } from "@shared/components/Core/Form/Fields/Search/Select";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { Tooltip } from "@shared/components/Core/Tooltip";
import {
  initialValuesSchema,
  IParamsSearchForm,
} from "@shared/components/Rules/SearchForm/SearchForm.form";
import { STATUS_OPTIONS } from "@shared/constants/options";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

interface Props {
  options: IOption[];
  defaultValues?: IParamsSearchForm | null;
  onSubmit?: (data: IParamsSearchForm) => void;
  onAdd?: () => void;
}

export function SearchForm({ options, defaultValues, onSubmit, onAdd }: Props) {
  const { isDesktop, isSmartphone, isTablet } = useDeviceDetection();

  const [initialValues, setInitialValues] = useState<IParamsSearchForm | null>(null);

  useEffect(() => {
    if (initialValues === null) {
      if (defaultValues) {
        setInitialValues(defaultValues);
      } else if (options.length === 1) {
        setInitialValues({ ...initialValuesSchema, searchIn: options[0].value });
      } else {
        setInitialValues(initialValuesSchema);
      }
    }
  }, [defaultValues, options, initialValues]);

  return (
    <Row>
      <Col>
        {initialValues ? (
          <Formik initialValues={initialValues} onSubmit={(values) => onSubmit && onSubmit(values)}>
            {({ values, setFieldValue, submitForm }) => (
              <Form>
                <Row>
                  {/* Mobile Layout */}
                  {isSmartphone && (
                    <>
                      <Col xs={12} className="mb-3">
                        <Field
                          as={SelectSearch}
                          placeholder="Pesquisar por"
                          name="searchIn"
                          value={values.searchIn}
                          options={options}
                          readOnly={options.length === 1}
                          onChange={(option: IOption) => {
                            setFieldValue("searchIn", option.value);
                            setFieldValue("value", "");
                          }}
                          onReset={() => {
                            setFieldValue("searchIn", "");
                            setFieldValue("value", "");
                          }}
                        />
                      </Col>
                      <Col xs={12} className="mb-3">
                        <Field
                          as={InputSearch}
                          placeholder="Pesquisar"
                          name="value"
                          type="text"
                          submitForm
                          disabled={!values.searchIn}
                          onReset={() => {
                            setFieldValue("value", "");
                            submitForm();
                          }}
                        />
                      </Col>
                      <Col xs={8} className="mb-3">
                        <Field
                          as={SelectSearch}
                          placeholder="Status"
                          value={values.status}
                          options={STATUS_OPTIONS}
                          onChange={({ value }: IOption) => {
                            setFieldValue("status", value);
                          }}
                        />
                      </Col>
                      <Col xs={4} className="d-flex justify-content-end align-items-start">
                        <div className="d-flex gap-2">
                          <Tooltip title="Buscar" place="top">
                            <ButtonIcon
                              type="submit"
                              size="md"
                              icon="search"
                              mode="helper"
                            />
                          </Tooltip>
                          {onAdd && (
                            <Tooltip title="Adicionar" place="top">
                              <ButtonIcon
                                type="button"
                                size="md"
                                mode="success"
                                icon="add"
                                onClick={() => onAdd()}
                              />
                            </Tooltip>
                          )}
                        </div>
                      </Col>
                    </>
                  )}

                  {/* Tablet Layout */}
                  {isTablet && (
                    <>
                      <Col md={6} className="mb-3">
                        <Field
                          as={SelectSearch}
                          placeholder="Pesquisar por"
                          name="searchIn"
                          value={values.searchIn}
                          options={options}
                          readOnly={options.length === 1}
                          onChange={(option: IOption) => {
                            setFieldValue("searchIn", option.value);
                            setFieldValue("value", "");
                          }}
                          onReset={() => {
                            setFieldValue("searchIn", "");
                            setFieldValue("value", "");
                          }}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Field
                          as={InputSearch}
                          placeholder="Pesquisar"
                          name="value"
                          type="text"
                          submitForm
                          disabled={!values.searchIn}
                          onReset={() => {
                            setFieldValue("value", "");
                            submitForm();
                          }}
                        />
                      </Col>
                      <Col md={8} className="mb-3">
                        <Field
                          as={SelectSearch}
                          placeholder="Status"
                          value={values.status}
                          options={STATUS_OPTIONS}
                          onChange={({ value }: IOption) => {
                            setFieldValue("status", value);
                          }}
                        />
                      </Col>
                      <Col md={4} className="d-flex justify-content-end align-items-start">
                        <div className="d-flex gap-2">
                          <Tooltip title="Buscar" place="top">
                            <ButtonIcon
                              type="submit"
                              size="lg"
                              icon="search"
                              mode="helper"
                            />
                          </Tooltip>
                          {onAdd && (
                            <Tooltip title="Adicionar" place="top">
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
                    </>
                  )}

                  {/* Desktop Layout (original) */}
                  {isDesktop && (
                    <>
                      <Col lg={4} xxl={4}>
                        <Field
                          as={SelectSearch}
                          placeholder="Pesquisar por"
                          name="searchIn"
                          value={values.searchIn}
                          options={options}
                          readOnly={options.length === 1}
                          onChange={(option: IOption) => {
                            setFieldValue("searchIn", option.value);
                            setFieldValue("value", "");
                          }}
                          onReset={() => {
                            setFieldValue("searchIn", "");
                            setFieldValue("value", "");
                          }}
                        />
                      </Col>

                      <Col lg={4} xxl={4}>
                        <Field
                          as={InputSearch}
                          placeholder="Pesquisar"
                          name="value"
                          type="text"
                          submitForm
                          disabled={!values.searchIn}
                          onReset={() => {
                            setFieldValue("value", "");
                            submitForm();
                          }}
                        />
                      </Col>

                      <Col lg={2} xxl={2}>
                        <Field
                          as={SelectSearch}
                          placeholder="Selecione"
                          value={values.status}
                          options={STATUS_OPTIONS}
                          onChange={({ value }: IOption) => {
                            setFieldValue("status", value);
                          }}
                        />
                      </Col>

                      <Col lg={2} xxl={2} className="d-flex justify-content-end">
                        <div className="d-flex justify-content-between align-items-center">
                          <Tooltip title="Buscar" place="top-start">
                            <ButtonIcon
                              type="submit"
                              size="lg"
                              icon="search"
                              mode="helper"
                            />
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
                    </>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        ) : (
          <Row className="mb-2">
            <Col xs={isSmartphone ? 12 : 4} className={isSmartphone ? "mb-3" : ""}>
              <Skeleton size="lg" />
            </Col>

            <Col xs={isSmartphone ? 12 : 4} className={isSmartphone ? "mb-3" : ""}>
              <Skeleton size="lg" />
            </Col>

            <Col xs={isSmartphone ? 12 : 3}>
              <Skeleton size="lg" />
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}