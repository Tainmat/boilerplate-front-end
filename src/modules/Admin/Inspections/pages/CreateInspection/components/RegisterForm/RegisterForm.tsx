import { Button } from "@shared/components/Core/Buttons/Button";
import { Card } from "react-bootstrap";
import { Checkbox } from "@shared/components/Core/Form/Fields/Checkbox";
import { InputText } from "@shared/components/Core/Form/Fields/InputText";
import { InputFile } from "@shared/components/Core/Form/Fields/InputFile";
import { InputRichText } from "@shared/components/Core/Form/Fields/InputRichText/InputRichText";
import { Radio } from "@shared/components/Core/Form/Fields/Radio";
import { Select } from "@shared/components/Core/Form/Fields/Select";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { useAlertContext } from "@shared/contexts/Alert";
import { useCustomersDropdown } from "@shared/hooks/services/Admin/Dropdown/useCustomersDropdown";
import { useUsersDropdown } from "@shared/hooks/services/Admin/Dropdown/useUsersDropdown";
import { usePartInspectionStatusDropdown } from "@shared/hooks/services/Admin/Dropdown/usePartInspectionStatusDropdown";
import { IEquipment } from "@shared/hooks/services/Admin/useEquipments";
import { Field, Form, Formik } from "formik";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { TextArea } from "@/shared/components/Core/Form/Fields/TextArea";

import { inspectionValidationSchema, IInspectionRegisterForm } from "./RegisterForm.form";

interface Props {
  initialValues: IInspectionRegisterForm | null;
  onSubmit: (data: IInspectionRegisterForm) => void;
  selectedEquipment?: IEquipment | null;
  onBack?: () => void;
}

export function InspectionRegisterForm({
  initialValues,
  onSubmit,
  selectedEquipment,
  onBack,
}: Props) {
  const { addAlertOnCancel } = useAlertContext();
  const navigate = useNavigate();

  // Buscar dados para os selects
  const { result: customersOptions, loading: loadingCustomers } = useCustomersDropdown();
  const { result: usersOptions, loading: loadingUsers } = useUsersDropdown();
  const { result: inspectionStatusOptions, loading: loadingInspectionStatus } =
    usePartInspectionStatusDropdown();

  // Preparar opções para os selects - já vem pronto dos hooks dropdown

  if (!initialValues) {
    return (
      <>
        <Row className="mb-4">
          <Col />
        </Row>
        <Row className="mb-4">
          <Col xs={4}>
            <Skeleton />
          </Col>
          <Col xs={4}>
            <Skeleton />
          </Col>
          <Col xs={4}>
            <Skeleton />
          </Col>
        </Row>
      </>
    );
  }

  function handleOnCancel(hasChanges: boolean) {
    if (!hasChanges) {
      navigate(-1);
    } else {
      addAlertOnCancel(() => {
        navigate(-1);
      });
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={inspectionValidationSchema}
      onSubmit={onSubmit}
    >
      {({ touched, errors, dirty, isValid, setFieldValue, setFieldTouched, values }) => (
        <Form>
          {selectedEquipment && (
            <Row className="mb-4">
              <Col xs={12}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center gap-3">
                      <strong>Equipamento Selecionado:</strong>
                      <span>{selectedEquipment.name}</span>
                      {selectedEquipment.description && (
                        <>
                          <span className="text-muted">-</span>
                          <span className="text-muted">{selectedEquipment.description}</span>
                        </>
                      )}
                      <span className="ms-auto text-muted">
                        {selectedEquipment.totalInspectionPoints} pontos de inspeção
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Inspetor Responsável */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
                <Card.Body>
                  {/* <div className="border-bottom pb-3 mb-4" style={{ borderColor: "#047a32" }}>
                    <Heading size="sm" className="mb-1 fw-bold text-success">
                      Inspetor Responsável
                    </Heading>
                    <small className="text-muted">
                      Identificação do inspetor responsável pela inspeção
                    </small>
                  </div> */}
                  <Row className="g-3">
                    <Col md={6}>
                      {loadingUsers ? (
                        <Skeleton />
                      ) : (
                        <Field
                          as={Select}
                          label="Inspetor Responsável *"
                          name="inspectorUserId"
                          placeholder="Selecione o inspetor"
                          options={usersOptions}
                          error={touched.inspectorUserId && !!errors.inspectorUserId}
                          helperText={
                            touched.inspectorUserId && !!errors.inspectorUserId
                              ? errors.inspectorUserId
                              : ""
                          }
                          onChange={({ value }: IOption) => {
                            setFieldTouched("inspectorUserId");
                            setFieldValue("inspectorUserId", value);
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Seção 1: Informações do Relatório */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
                <Card.Body>
                  <div className="border-bottom pb-3 mb-4" style={{ borderColor: "#047a32" }}>
                    <Heading size="sm" className="mb-1 fw-bold text-success">
                      1. Informações do Relatório
                    </Heading>
                    <small className="text-muted">
                      Dados de identificação e período do relatório de inspeção
                    </small>
                  </div>
                  <Row className="g-3">
                    <Col md={6} lg={4}>
                      <Field
                        as={InputText}
                        label="Relatório Nº *"
                        name="reportNumber"
                        placeholder="Ex: REL-001-2024"
                        maxLength={50}
                        type="text"
                        error={touched.reportNumber && !!errors.reportNumber}
                        helperText={
                          touched.reportNumber && !!errors.reportNumber ? errors.reportNumber : ""
                        }
                      />
                    </Col>
                    <Col md={3} lg={4}>
                      <Field
                        as={InputText}
                        label="Revisão Nº *"
                        name="revisionNumber"
                        placeholder="Ex: 00"
                        maxLength={10}
                        type="text"
                        error={touched.revisionNumber && !!errors.revisionNumber}
                        helperText={
                          touched.revisionNumber && !!errors.revisionNumber
                            ? errors.revisionNumber
                            : ""
                        }
                      />
                    </Col>
                    <Col md={3} lg={4}>
                      <Field
                        as={InputText}
                        label="Folha Nº *"
                        name="sheetNumber"
                        placeholder="Ex: 1/1"
                        maxLength={10}
                        type="text"
                        error={touched.sheetNumber && !!errors.sheetNumber}
                        helperText={
                          touched.sheetNumber && !!errors.sheetNumber ? errors.sheetNumber : ""
                        }
                      />
                    </Col>
                  </Row>
                  <Row className="g-3 mt-2">
                    <Col md={6}>
                      <Field
                        as={InputText}
                        label="Data de Início *"
                        name="reportStartDate"
                        type="date"
                        error={touched.reportStartDate && !!errors.reportStartDate}
                        helperText={
                          touched.reportStartDate && !!errors.reportStartDate
                            ? errors.reportStartDate
                            : ""
                        }
                      />
                    </Col>
                    <Col md={6}>
                      <Field
                        as={InputText}
                        label="Data de Término *"
                        name="reportEndDate"
                        type="date"
                        error={touched.reportEndDate && !!errors.reportEndDate}
                        helperText={
                          touched.reportEndDate && !!errors.reportEndDate
                            ? errors.reportEndDate
                            : ""
                        }
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Seção 2: Informações do Cliente e Equipamento */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
                <Card.Body>
                  <div className="border-bottom pb-3 mb-4" style={{ borderColor: "#047a32" }}>
                    <Heading size="sm" className="mb-1 fw-bold text-success">
                      2. Informações do Cliente e Equipamento
                    </Heading>
                    <small className="text-muted">
                      Identificação do cliente e detalhes do equipamento
                    </small>
                  </div>
                  <Row className="g-3">
                    <Col md={6}>
                      {loadingCustomers ? (
                        <Skeleton />
                      ) : (
                        <Field
                          as={Select}
                          label="Cliente *"
                          name="customerId"
                          placeholder="Selecione o cliente"
                          options={customersOptions}
                          error={touched.customerId && !!errors.customerId}
                          helperText={
                            touched.customerId && !!errors.customerId ? errors.customerId : ""
                          }
                          onChange={({ value }: IOption) => {
                            setFieldTouched("customerId");
                            setFieldValue("customerId", value);
                          }}
                        />
                      )}
                    </Col>
                    <Col md={6}>
                      <Field
                        as={InputText}
                        label="Identificação do Componente *"
                        name="componentId"
                        placeholder="Ex: Engrenagem Principal - Módulo 8"
                        maxLength={100}
                        type="text"
                        error={touched.componentId && !!errors.componentId}
                        helperText={
                          touched.componentId && !!errors.componentId ? errors.componentId : ""
                        }
                      />
                    </Col>
                  </Row>
                  <Row className="g-3 mt-2">
                    <Col md={6}>
                      <Field
                        as={InputText}
                        label="Local da Inspeção"
                        name="inspectionLocation"
                        placeholder="Ex: Área Industrial - Setor A"
                        maxLength={100}
                        type="text"
                        error={touched.inspectionLocation && !!errors.inspectionLocation}
                        helperText={
                          touched.inspectionLocation && !!errors.inspectionLocation
                            ? errors.inspectionLocation
                            : ""
                        }
                      />
                    </Col>
                    <Col md={6}>
                      <Field
                        as={InputText}
                        label="Informações da Mda"
                        name="mdaInformation"
                        placeholder="Ex: Especificações técnicas complementares"
                        maxLength={200}
                        type="text"
                        error={touched.mdaInformation && !!errors.mdaInformation}
                        helperText={
                          touched.mdaInformation && !!errors.mdaInformation
                            ? errors.mdaInformation
                            : ""
                        }
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Seção 3: Configurações de Inspeção */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
                <Card.Body>
                  <div className="border-bottom pb-3 mb-4" style={{ borderColor: "#047a32" }}>
                    <Heading size="sm" className="mb-1 fw-bold text-success">
                      3. Configurações de Inspeção
                    </Heading>
                    <small className="text-muted">
                      Métodos de ensaio, preparação e instrumentos utilizados
                    </small>
                  </div>

                  {/* Métodos de Ensaio */}
                  <div className="mb-4">
                    <h6 className="mb-3" style={{ color: "#047a32", fontWeight: "600" }}>
                      Ensaios Realizados
                    </h6>
                    <Row className="g-3">
                      <Col xl={2} lg={3} md={4} sm={6} xs={6}>
                        <div
                          className="p-2 p-md-3 border rounded bg-white shadow-sm text-center"
                          style={{ borderColor: "#e9ecef" }}
                        >
                          <Field
                            as={Checkbox}
                            label="VI"
                            name="isVI"
                            checked={values.isVI}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("isVI", e.target.checked);
                            }}
                          />
                          {/* <small className="text-muted d-block">Visual</small> */}
                        </div>
                      </Col>
                      <Col xl={2} lg={3} md={4} sm={6} xs={6}>
                        <div
                          className="p-2 p-md-3 border rounded bg-white shadow-sm text-center"
                          style={{ borderColor: "#e9ecef" }}
                        >
                          <Field
                            as={Checkbox}
                            label="DM"
                            name="isDM"
                            checked={values.isDM}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("isDM", e.target.checked);
                            }}
                          />
                          {/* <small className="text-muted d-block">Dimensional</small> */}
                        </div>
                      </Col>
                      <Col xl={2} lg={3} md={4} sm={6} xs={6}>
                        <div
                          className="p-2 p-md-3 border rounded bg-white shadow-sm text-center"
                          style={{ borderColor: "#e9ecef" }}
                        >
                          <Field
                            as={Checkbox}
                            label="PM"
                            name="isPM"
                            checked={values.isPM}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("isPM", e.target.checked);
                            }}
                          />
                          {/* <small className="text-muted d-block">Partículas Magn.</small> */}
                        </div>
                      </Col>
                      <Col xl={2} lg={3} md={4} sm={6} xs={6}>
                        <div
                          className="p-2 p-md-3 border rounded bg-white shadow-sm text-center"
                          style={{ borderColor: "#e9ecef" }}
                        >
                          <Field
                            as={Checkbox}
                            label="US"
                            name="isUS"
                            checked={values.isUS}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("isUS", e.target.checked);
                            }}
                          />
                          {/* <small className="text-muted d-block">Ultrassom</small> */}
                        </div>
                      </Col>
                      <Col xl={2} lg={3} md={4} sm={6} xs={6}>
                        <div
                          className="p-2 p-md-3 border rounded bg-white shadow-sm text-center"
                          style={{ borderColor: "#e9ecef" }}
                        >
                          <Field
                            as={Checkbox}
                            label="LP"
                            name="isLP"
                            checked={values.isLP}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("isLP", e.target.checked);
                            }}
                          />
                          {/* <small className="text-muted d-block">Líq. Penetrante</small> */}
                        </div>
                      </Col>
                      <Col xl={2} lg={3} md={4} sm={6} xs={6}>
                        <div
                          className="p-2 p-md-3 border rounded bg-white shadow-sm text-center"
                          style={{ borderColor: "#e9ecef" }}
                        >
                          <Field
                            as={Checkbox}
                            label="DU"
                            name="isDU"
                            checked={values.isDU}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("isDU", e.target.checked);
                            }}
                          />
                          {/* <small className="text-muted d-block">Dureza</small> */}
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Preparação da Superfície */}
                  <div className="mb-4">
                    <h6 className="mb-3" style={{ color: "#047a32", fontWeight: "600" }}>
                      Preparação da Superfície
                    </h6>
                    <Row className="g-3">
                      <Col md={6}>
                        <div
                          className="p-2 p-md-3 border rounded bg-white shadow-sm d-flex align-items-center"
                          style={{ borderColor: "#e9ecef" }}
                        >
                          <Field
                            as={Checkbox}
                            label="Lixamento/Escovamento/Jateamento"
                            name="isSandingBrushSandblasting"
                            checked={values.isSandingBrushSandblasting}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("isSandingBrushSandblasting", e.target.checked);
                            }}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div
                          className="p-2 p-md-3 border rounded bg-white shadow-sm d-flex align-items-center"
                          style={{ borderColor: "#e9ecef" }}
                        >
                          <Field
                            as={Checkbox}
                            label="Limpeza Química"
                            name="isCleaningChemistry"
                            checked={values.isCleaningChemistry}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFieldValue("isCleaningChemistry", e.target.checked);
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Instrumentos */}
                  <div>
                    <h6 className="mb-3" style={{ color: "#047a32", fontWeight: "600" }}>
                      Equipamentos e Instrumentos
                    </h6>
                    <Row className="g-3">
                      <Col xs={12}>
                        <Field
                          as={TextArea}
                          label="Instrumentos Utilizados"
                          name="instruments"
                          placeholder="Ex: Yoke eletromagnético, luminária UV, paquímetro digital, lupa 10x"
                          maxlength={500}
                          rows={3}
                          error={touched.instruments && !!errors.instruments}
                          helperText={
                            touched.instruments && !!errors.instruments
                              ? errors.instruments
                              : "Liste todos os equipamentos utilizados"
                          }
                        />
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Seção 4: Posição de Inspeção */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
                <Card.Body>
                  <div className="border-bottom pb-3 mb-4" style={{ borderColor: "#047a32" }}>
                    <Heading size="sm" className="mb-1 fw-bold text-success">
                      4. Posição de Inspeção
                    </Heading>
                    <small className="text-muted">
                      Selecione a posição específica para inspeção
                    </small>
                  </div>
                  <div
                    className={`${touched.selectedPosition && !!errors.selectedPosition ? "border border-danger rounded p-3" : ""}`}
                  >
                    <Row className="g-3">
                      {[1, 2, 3, 4, 5, 6].map((position) => (
                        <Col xl={4} lg={6} md={6} sm={6} key={position}>
                          <div
                            className="border rounded p-2 p-md-3 bg-white shadow-sm d-flex align-items-center"
                            style={{ borderColor: "#e9ecef" }}
                          >
                            <Field
                              as={Radio}
                              label={`Posição ${position}`}
                              name="selectedPosition"
                              value={position.toString()}
                              checked={values.selectedPosition === position.toString()}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFieldTouched("selectedPosition");
                                setFieldValue("selectedPosition", e.target.value);
                              }}
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                    {touched.selectedPosition && !!errors.selectedPosition && (
                      <div className="text-danger mt-2">
                        <small>{errors.selectedPosition}</small>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Seção 5: Croqui e Região de Inspeção */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
                <Card.Body>
                  <div className="border-bottom pb-3 mb-4" style={{ borderColor: "#047a32" }}>
                    <Heading size="sm" className="mb-1 fw-bold text-success">
                      5. Croqui do Equipamento
                    </Heading>
                    <small className="text-muted">
                      Imagem do equipamento com regiões de inspeção
                    </small>
                  </div>
                  <Row className="g-3">
                    <Col xs={12}>
                      <div
                        className="border rounded p-4 text-center"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        {selectedEquipment && selectedEquipment.coverUrl ? (
                          <div>
                            <img
                              src={selectedEquipment.coverUrl}
                              alt={`Croqui - ${selectedEquipment.name}`}
                              className="img-fluid rounded shadow-sm"
                              style={{ maxHeight: "400px", maxWidth: "100%" }}
                            />
                            <div className="mt-3">
                              <h6 style={{ color: "#047a32", fontWeight: "600" }}>
                                {selectedEquipment.name}
                              </h6>
                              <small className="text-muted">
                                {selectedEquipment.totalInspectionPoints} pontos de inspeção
                              </small>
                            </div>
                          </div>
                        ) : (
                          <div className="py-5">
                            <div
                              className="mb-3"
                              style={{ fontSize: "4rem", color: "#6c757d", opacity: 0.5 }}
                            >
                              🖼️
                            </div>
                            <h6 className="text-muted mb-2">
                              {selectedEquipment
                                ? "Imagem do croqui não disponível"
                                : "Selecione um equipamento para ver o croqui"}
                            </h6>
                            <small className="text-muted">
                              A imagem do croqui será exibida automaticamente após selecionar o
                              equipamento
                            </small>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Seção 6: Considerações Gerais */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
                <Card.Body>
                  <div className="border-bottom pb-3 mb-4" style={{ borderColor: "#047a32" }}>
                    <Heading size="sm" className="mb-1 fw-bold text-success">
                      6. Considerações Gerais
                    </Heading>
                    <small className="text-muted">
                      Observações importantes sobre as condições de inspeção
                    </small>
                  </div>
                  <Row className="g-3">
                    <Col xs={12}>
                      <Field
                        as={TextArea}
                        label="Observações e Considerações"
                        name="finalConclusion"
                        placeholder="Registre informações relevantes:"
                        maxlength={600}
                        rows={4}
                        error={touched.finalConclusion && !!errors.finalConclusion}
                        helperText={
                          touched.finalConclusion && !!errors.finalConclusion
                            ? errors.finalConclusion
                            : "Documente aspectos importantes da inspeção"
                        }
                      />
                    </Col>
                    {/* <Col xs={12}>
                      <InputRichText
                        name="finalConclusion"
                        label="Observações e Considerações"
                        placeholder="Registre informações relevantes:"
                        helperText="Documente aspectos importantes da inspeção"
                      />
                    </Col> */}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Seção 7: Conclusões */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
                <Card.Body>
                  <div className="border-bottom pb-3 mb-4" style={{ borderColor: "#047a32" }}>
                    <Heading size="sm" className="mb-1 fw-bold text-success">
                      7. Conclusões
                    </Heading>
                    <small className="text-muted">Resultados e conclusões da inspeção</small>
                  </div>

                  {/* Campos dinâmicos baseados nos pontos de inspeção do equipamento */}
                  {selectedEquipment && selectedEquipment.totalInspectionPoints > 0 && (
                    <Row className="g-3 mb-4">
                      {Array.from(
                        { length: selectedEquipment.totalInspectionPoints },
                        (_, index) => {
                          const pointNumber = index + 1;
                          const fieldName = `inspectionPointsConclusions.point${pointNumber}`;
                          return (
                            <Col md={6} key={pointNumber}>
                              <div className="border rounded p-3 bg-light">
                                <h6 className="mb-3" style={{ color: "#047a32" }}>
                                  Ponto de Inspeção {pointNumber}
                                </h6>
                                <Field
                                  as={TextArea}
                                  name={fieldName}
                                  placeholder={`Descreva os resultados encontrados no ponto de inspeção ${pointNumber}...`}
                                  maxLength={400}
                                  rows={3}
                                  error={
                                    touched.inspectionPointsConclusions &&
                                    touched.inspectionPointsConclusions[`point${pointNumber}`] &&
                                    errors.inspectionPointsConclusions &&
                                    typeof errors.inspectionPointsConclusions === "object" &&
                                    errors.inspectionPointsConclusions[`point${pointNumber}`]
                                  }
                                  helperText={
                                    touched.inspectionPointsConclusions &&
                                    touched.inspectionPointsConclusions[`point${pointNumber}`] &&
                                    errors.inspectionPointsConclusions &&
                                    typeof errors.inspectionPointsConclusions === "object" &&
                                    errors.inspectionPointsConclusions[`point${pointNumber}`]
                                      ? errors.inspectionPointsConclusions[`point${pointNumber}`]
                                      : ""
                                  }
                                />
                              </div>
                            </Col>
                          );
                        },
                      )}
                    </Row>
                  )}

                  {/* Mensagem quando nenhum equipamento está selecionado */}
                  {!selectedEquipment && (
                    <Row className="g-3 mb-4">
                      <Col xs={12}>
                        <div className="text-center p-4 bg-light rounded border">
                          <p className="text-muted mb-0">
                            Selecione um equipamento para ver os campos de conclusão específicos
                          </p>
                        </div>
                      </Col>
                    </Row>
                  )}

                  <Row className="g-3">
                    <Col md={6}>
                      <Field
                        as={Select}
                        label="Status da Inspeção *"
                        name="inspectionStatusId"
                        placeholder="Selecione o status"
                        options={inspectionStatusOptions}
                        error={touched.inspectionStatusId && !!errors.inspectionStatusId}
                        helperText={
                          touched.inspectionStatusId && !!errors.inspectionStatusId
                            ? errors.inspectionStatusId
                            : ""
                        }
                        onChange={({ value }: IOption) => {
                          setFieldTouched("inspectionStatusId");
                          setFieldValue("inspectionStatusId", value);
                        }}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Seção 8: Imagens Adicionais */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
                <Card.Body>
                  <div className="border-bottom pb-3 mb-4" style={{ borderColor: "#047a32" }}>
                    <Heading size="sm" className="mb-1 fw-bold text-success">
                      8. Imagens Adicionais
                    </Heading>
                    <small className="text-muted">
                      Área para inserir imagens complementares (máx. 5 imagens)
                    </small>
                  </div>
                  <Row className="g-3">
                    <Col xs={12}>
                      <Field
                        as={InputFile}
                        label="Imagens Adicionais"
                        name="additionalImages"
                        accept="image/*"
                        multiple
                        placeholder="Clique para selecionar ou arraste imagens adicionais"
                        error={touched.additionalImages && !!errors.additionalImages}
                        helperText={
                          touched.additionalImages && !!errors.additionalImages
                            ? typeof errors.additionalImages === "string"
                              ? errors.additionalImages
                              : "Erro na validação das imagens"
                            : "Imagens complementares para documentação da inspeção (máx. 5 imagens, 5MB cada)"
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldTouched("additionalImages");
                          const files = Array.from(e.target.files || []);
                          setFieldValue("additionalImages", files);
                        }}
                      />
                    </Col>
                  </Row>

                  {/* Preview das imagens selecionadas */}
                  {values.additionalImages && values.additionalImages.length > 0 && (
                    <Row className="g-3 mt-3">
                      <Col xs={12}>
                        <div className="border-top pt-3" style={{ borderColor: "#e9ecef" }}>
                          <h6 className="mb-3" style={{ color: "#047a32", fontWeight: "600" }}>
                            Imagens Selecionadas ({values.additionalImages.length}/5)
                          </h6>
                          <Row className="g-3">
                            {values.additionalImages.map((file: File, index: number) => (
                              <Col xl={3} lg={4} md={6} sm={6} xs={12} key={index}>
                                <div
                                  className="border rounded p-2 p-md-3 bg-white shadow-sm position-relative"
                                  style={{ borderColor: "#e9ecef" }}
                                >
                                  <div className="text-center mb-2">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`Preview ${index + 1}`}
                                      style={{
                                        width: "100%",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                      }}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <small
                                      className="text-muted d-block text-truncate"
                                      title={file.name}
                                    >
                                      {file.name}
                                    </small>
                                    <small className="text-muted">
                                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </small>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger position-absolute"
                                    style={{ top: "8px", right: "8px", padding: "4px 8px" }}
                                    onClick={() => {
                                      const updatedFiles = values.additionalImages.filter(
                                        (_: File, i: number) => i !== index,
                                      );
                                      setFieldValue("additionalImages", updatedFiles);
                                    }}
                                    title="Remover imagem"
                                  >
                                    ×
                                  </button>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Seção de Ações */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={12} md={8}>
                      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 mb-3 mb-md-0">
                        <div className="text-muted">
                          <small>
                            <strong>Status:</strong>{" "}
                            {dirty
                              ? isValid
                                ? "Pronto para salvar"
                                : "Dados incompletos"
                              : "Não modificado"}
                          </small>
                        </div>
                        {!isValid && dirty && (
                          <small className="text-warning">
                            ⚠️ Verifique os campos obrigatórios
                          </small>
                        )}
                      </div>
                    </Col>
                    <Col xs={12} md={4}>
                      <div className="d-flex flex-column flex-sm-row gap-2 justify-content-md-end">
                        {onBack && (
                          <Button type="button" styles="secondary" onClick={onBack}>
                            ← Voltar
                          </Button>
                        )}
                        <Button
                          type="button"
                          styles="primary"
                          mode="warning"
                          onClick={() => handleOnCancel(dirty)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          styles="primary"
                          mode="success"
                          disabled={!dirty || !isValid}
                        >
                          <span className="d-none d-sm-inline">💾 </span>Salvar
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}
