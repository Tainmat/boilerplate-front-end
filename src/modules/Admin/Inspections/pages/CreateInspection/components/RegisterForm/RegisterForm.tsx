import "react-quill-new/dist/quill.snow.css";

import { Button } from "@shared/components/Core/Buttons/Button";
import { Checkbox } from "@shared/components/Core/Form/Fields/Checkbox";
import { InputText } from "@shared/components/Core/Form/Fields/InputText";
import { Select } from "@shared/components/Core/Form/Fields/Select";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { useAlertContext } from "@shared/contexts/Alert";
import { useUsersDropdown } from "@shared/hooks/services/Admin/Dropdown/useUsersDropdown";
import { comprimirImagem } from "@shared/utils/image-compress/imageCompression";
import { Field, Form, Formik } from "formik";
import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { TextArea } from "@/shared/components/Core/Form/Fields/TextArea";
import { useDropdownsRedux } from "@/shared/hooks/redux/useDropdownsRedux";
import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";
import { IEquipmentDropdown } from "@/shared/store/modules/Dropdowns";
import { formatBase64ForImage } from "@/shared/utils/fileToBase64";

import { GeneralConditionsForm } from "./components/GeneralConditionsForm";
import { IInspectionRegisterForm, inspectionValidationSchema } from "./RegisterForm.form";

interface Props {
  initialValues: IInspectionRegisterForm | null;
  onSubmit: (data: IInspectionRegisterForm) => void;
  selectedEquipment?: IEquipmentDropdown | null;
  onBack?: () => void;
  isEdit?: boolean;
}

export function InspectionRegisterForm({
  initialValues,
  onSubmit,
  selectedEquipment,
  onBack,
  isEdit,
}: Props) {
  const { isInspectionChanger } = useAuthRoles();
  const { addAlertOnCancel } = useAlertContext();
  const navigate = useNavigate();

  // Buscar dados para os selects
  const { customersDropdown, inspectionStatusDropdown } = useDropdownsRedux();
  const { result: usersOptions, loading: loadingUsers } = useUsersDropdown();

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
      enableReinitialize={true}
    >
      {({ touched, errors, dirty, isValid, setFieldValue, setFieldTouched, values }) => {
        const handlePositionChange = (position: number, checked: boolean) => {
          const currentPositions = values.selectedPositions || [];
          let newPositions: number[];

          if (checked) {
            // Adiciona a posição se não estiver selecionada
            newPositions = [...currentPositions, position].sort((a, b) => a - b);
          } else {
            // Remove a posição se estiver selecionada
            newPositions = currentPositions.filter((p) => p !== position);
          }

          // Atualiza os valores
          setFieldValue("selectedPositions", newPositions);
          // Atualiza o campo positionNumber para o backend no formato "1,2,4,6"
          setFieldValue("positionNumber", newPositions.join(","));

          // Marca como touched após garantir que os valores foram atualizados
          setTimeout(() => {
            setFieldTouched("selectedPositions", true, true);
          }, 0);
        };

        return (
          <Form>
            {selectedEquipment && (
              <Row className="mb-4">
                <Col xs={12}>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center gap-3">
                        <strong>Equipamento Selecionado:</strong>
                        <strong style={{ color: "#047a32" }}>{selectedEquipment.name}</strong>
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
                    <Row className="g-3">
                      <Col md={6}>
                        {loadingUsers ? (
                          <Skeleton />
                        ) : (
                          <Field
                            as={Select}
                            readOnly={!isInspectionChanger()}
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
                            disabled={isEdit}
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
                          readOnly={!isInspectionChanger()}
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
                          readOnly={!isInspectionChanger()}
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
                          readOnly={!isInspectionChanger()}
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
                          readOnly={!isInspectionChanger()}
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
                          readOnly={!isInspectionChanger()}
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
                        <Field
                          as={Select}
                          readOnly={!isInspectionChanger()}
                          label="Cliente *"
                          name="customerId"
                          placeholder="Selecione o cliente"
                          options={customersDropdown.map((i) => {
                            return {
                              label: i.fantasyName,
                              value: i.id,
                            };
                          })}
                          error={touched.customerId && !!errors.customerId}
                          helperText={
                            touched.customerId && !!errors.customerId ? errors.customerId : ""
                          }
                          onChange={({ value }: IOption) => {
                            setFieldTouched("customerId");
                            setFieldValue("customerId", value);
                          }}
                        />
                      </Col>
                      <Col md={6}>
                        <Field
                          as={InputText}
                          readOnly={!isInspectionChanger()}
                          label="Identificação do Componente *"
                          name="componentId"
                          placeholder="Ex: Engrenagem Principal - Módulo 8"
                          maxLength={50}
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
                          readOnly={!isInspectionChanger()}
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
                          readOnly={!isInspectionChanger()}
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
                              readOnly={!isInspectionChanger()}
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
                              readOnly={!isInspectionChanger()}
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
                              readOnly={!isInspectionChanger()}
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
                              readOnly={!isInspectionChanger()}
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
                              readOnly={!isInspectionChanger()}
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
                              readOnly={!isInspectionChanger()}
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
                              readOnly={!isInspectionChanger()}
                              label={
                                <span
                                  className="d-block"
                                  style={{ wordBreak: "break-word", lineHeight: "1.2" }}
                                >
                                  Lixamento/Escovamento/Jateamento
                                </span>
                              }
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
                              readOnly={!isInspectionChanger()}
                              label={
                                <span
                                  className="d-block"
                                  style={{ wordBreak: "break-word", lineHeight: "1.2" }}
                                >
                                  Limpeza Química
                                </span>
                              }
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
                            readOnly={!isInspectionChanger()}
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
                        Selecione uma ou mais posições para inspeção
                      </small>
                    </div>
                    <div
                      className={`${touched.selectedPositions && !!errors.selectedPositions ? "border border-danger rounded p-3" : ""}`}
                    >
                      <Row className="g-3">
                        {[1, 2, 3, 4, 5, 6].map((position) => {
                          const isSelected = values.selectedPositions?.includes(position) || false;
                          return (
                            <Col xl={4} lg={6} md={6} sm={6} key={position}>
                              <div
                                className="border rounded p-2 p-md-3 bg-white shadow-sm d-flex align-items-center"
                                style={{ borderColor: "#e9ecef" }}
                              >
                                <Checkbox
                                  readOnly={!isInspectionChanger()}
                                  label={`Posição ${position}`}
                                  name={`position_${position}`}
                                  checked={isSelected}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    handlePositionChange(position, e.target.checked);
                                  }}
                                />
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                      {touched.selectedPositions && !!errors.selectedPositions && (
                        <div className="text-danger mt-2">
                          <small>{errors.selectedPositions}</small>
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
                          {selectedEquipment && selectedEquipment.croqui ? (
                            <div>
                              {/* coverUrl contém o croqui do endpoint operational/parts-inspection quando disponível */}
                              <img
                                src={formatBase64ForImage(selectedEquipment.croqui)}
                                alt={`Croqui - ${selectedEquipment.name}`}
                                className="img-fluid rounded shadow-sm"
                                style={{ maxHeight: "400px", maxWidth: "100%" }}
                              />
                              <div className="mt-3">
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
                <GeneralConditionsForm />
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
                      <small className="text-muted">Status final da inspeção realizada</small>
                    </div>

                    <Row className="g-3">
                      <Col md={6}>
                        <Field
                          as={Select}
                          readOnly={!isInspectionChanger()}
                          label="Status da Inspeção *"
                          name="inspectionStatusId"
                          placeholder="Selecione o status"
                          options={inspectionStatusDropdown.map((item) => ({
                            value: item.id,
                            label: item.description,
                          }))}
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
                        Área para inserir até 3 imagens complementares da inspeção (opcional)
                      </small>
                    </div>

                    <Row className="g-3">
                      {[0, 1, 2].map((slotIndex) => {
                        const imageData = values.additionalImages?.images?.[slotIndex];
                        const hasImage = imageData && imageData.base64;

                        return (
                          <Col md={4} key={slotIndex}>
                            <div
                              className="border rounded bg-light position-relative"
                              style={{
                                height: "250px",
                                borderStyle: "dashed",
                                borderColor: "#047a32",
                                borderWidth: "2px",
                              }}
                            >
                              {hasImage ? (
                                // Preview da imagem
                                <div className="h-100 position-relative">
                                  <img
                                    src={imageData.base64}
                                    alt={`Imagem ${slotIndex + 1}`}
                                    className="w-100 h-100 rounded"
                                    style={{
                                      objectFit: "cover",
                                      height: "250px",
                                    }}
                                  />
                                  <button
                                    disabled={!isInspectionChanger()}
                                    type="button"
                                    className="btn btn-sm btn-danger position-absolute"
                                    style={{ top: "8px", right: "8px", padding: "4px 8px" }}
                                    onClick={() => {
                                      const currentImages = values.additionalImages || {
                                        images: [],
                                        imagesToDel: [],
                                      };
                                      const updatedImages = [...(currentImages.images || [])];
                                      const imagesToDel = [...(currentImages.imagesToDel || [])];

                                      // Se a imagem tem um ID (vem do servidor), adiciona à lista de exclusão
                                      if (imageData.id) {
                                        imagesToDel.push(imageData.id);
                                      }

                                      // Remove a imagem do slot
                                      updatedImages[slotIndex] = null;

                                      setFieldValue("additionalImages", {
                                        images: updatedImages,
                                        imagesToDel: imagesToDel,
                                      });
                                    }}
                                    title="Remover imagem"
                                  >
                                    ×
                                  </button>
                                  <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-2 rounded-bottom">
                                    <small
                                      className="text-truncate d-block"
                                      title={imageData.name || `Imagem ${slotIndex + 1}`}
                                    >
                                      {imageData.name || `Imagem ${slotIndex + 1}`}
                                    </small>
                                  </div>
                                </div>
                              ) : (
                                // Área de upload
                                <div
                                  className="d-flex flex-column align-items-center justify-content-center h-100 p-3"
                                  style={{
                                    opacity: !isInspectionChanger() ? 0.5 : 1,
                                    cursor: !isInspectionChanger() ? "not-allowed" : "default",
                                  }}
                                >
                                  <div className="text-center mb-3">
                                    <div
                                      style={{ fontSize: "3rem", color: "#6c757d", opacity: 0.5 }}
                                    >
                                      📷
                                    </div>
                                    <h6 className="text-muted mb-2">Slot {slotIndex + 1}</h6>
                                    <small className="text-muted">
                                      {isInspectionChanger()
                                        ? "Clique para adicionar uma imagem"
                                        : "Upload desabilitado"}
                                    </small>
                                  </div>
                                  <input
                                    disabled={!isInspectionChanger()}
                                    type="file"
                                    accept="image/*"
                                    className="d-none"
                                    id={`image-upload-${slotIndex}`}
                                    onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        try {
                                          // Validar tipo de arquivo
                                          if (
                                            !["image/jpeg", "image/png", "image/gif"].includes(
                                              file.type,
                                            )
                                          ) {
                                            alert(
                                              "Formato não suportado! Use apenas JPG, PNG ou GIF.",
                                            );
                                            e.target.value = ""; // Limpa o input
                                            return;
                                          }

                                          // Comprimir a imagem usando a função personalizada
                                          const compressedBase64 = await comprimirImagem(file, {
                                            maxSizeMB: 1, // Limite de 1MB para imagens adicionais
                                            maxWidthOrHeight: 1920, // Máximo 1920px
                                            quality: 0.8, // 80% de qualidade
                                            fileType: "image/jpeg",
                                          });

                                          const currentImages = values.additionalImages || {
                                            images: [],
                                            imagesToDel: [],
                                          };
                                          const updatedImages = [...(currentImages.images || [])];

                                          updatedImages[slotIndex] = {
                                            base64: compressedBase64,
                                            name: file.name,
                                            size: 0, // Tamanho após compressão não é facilmente calculável
                                            type: "image/jpeg", // Sempre JPEG após compressão
                                          };

                                          setFieldValue("additionalImages", {
                                            images: updatedImages,
                                            imagesToDel: currentImages.imagesToDel || [],
                                          });

                                          // Limpar o input para permitir selecionar a mesma imagem novamente
                                          e.target.value = "";
                                        } catch {
                                          alert("Erro ao processar a imagem. Tente novamente.");
                                          e.target.value = "";
                                        }
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`image-upload-${slotIndex}`}
                                    className={`btn btn-sm w-100 ${isInspectionChanger() ? "btn-outline-success" : "btn-outline-secondary"}`}
                                    style={{
                                      cursor: isInspectionChanger() ? "pointer" : "not-allowed",
                                      opacity: isInspectionChanger() ? 1 : 0.6,
                                      pointerEvents: isInspectionChanger() ? "auto" : "none",
                                    }}
                                  >
                                    Selecionar Imagem
                                  </label>
                                </div>
                              )}
                            </div>
                          </Col>
                        );
                      })}
                    </Row>

                    <Row className="mt-3">
                      <Col xs={12}>
                        <small className="text-muted">
                          <strong>Instruções:</strong> Você pode adicionar até 3 imagens
                          complementares (opcional). Formatos aceitos: JPG, PNG, GIF. As imagens
                          serão automaticamente comprimidas para otimizar o envio.
                        </small>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Seção de Ações */}
            <Row className="mb-4">
              <Col xs={12}>
                <Card className="shadow-sm" style={{ borderLeft: "4px solid #047a32" }}>
                  <Card.Body>
                    {/* Status - sempre no topo em mobile */}
                    <Row className="mb-3">
                      <Col xs={12}>
                        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
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
                    </Row>

                    {/* Botões - layout responsivo */}
                    <Row>
                      <Col xs={12}>
                        <div className="d-flex flex-row gap-2 justify-content-center justify-content-sm-end align-items-center">
                          <style>{`
                          .action-btn {
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            transition: all 0.2s ease !important;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                            position: relative !important;
                            border-radius: 6px !important;
                            padding: 0.5rem 1rem !important;
                            font-size: 14px !important;
                            font-weight: 600 !important;
                            line-height: 1.5 !important;
                            white-space: nowrap !important;
                            gap: 0.5rem !important;
                          }

                          .action-btn:hover:not(:disabled) {
                            transform: translateY(-2px) !important;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
                          }

                          .action-btn:active:not(:disabled) {
                            transform: translateY(0) !important;
                          }

                          .action-btn:disabled {
                            opacity: 0.5 !important;
                            cursor: not-allowed !important;
                          }

                          .btn-icon {
                            font-size: 18px !important;
                            line-height: 1 !important;
                          }

                          .btn-text {
                            display: none !important;
                          }

                          @media (min-width: 576px) {
                            .btn-text {
                              display: inline !important;
                            }
                          }

                          @media (max-width: 575px) {
                            .action-btn {
                              padding: 0.5rem !important;
                              min-width: 2.5rem !important;
                              min-height: 2.5rem !important;
                            }
                          }
                        `}</style>

                          {onBack && (
                            <Button
                              type="button"
                              styles="secondary"
                              onClick={onBack}
                              className="action-btn"
                              title="Voltar para seleção de equipamento"
                            >
                              <span className="btn-icon">←</span>
                              <span className="btn-text">Voltar</span>
                            </Button>
                          )}
                          <Button
                            type="button"
                            styles="primary"
                            mode="warning"
                            onClick={() => handleOnCancel(dirty)}
                            className="action-btn"
                            title="Cancelar e descartar alterações"
                          >
                            <span className="btn-icon">×</span>
                            <span className="btn-text">Cancelar</span>
                          </Button>
                          <Button
                            type="submit"
                            styles="primary"
                            mode="success"
                            disabled={!dirty || !isValid}
                            className="action-btn"
                            title={
                              !dirty
                                ? "Nenhuma alteração para salvar"
                                : !isValid
                                  ? "Preencha todos os campos obrigatórios"
                                  : "Salvar inspeção"
                            }
                          >
                            <span className="btn-icon">✓</span>
                            <span className="btn-text">Salvar</span>
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
}
