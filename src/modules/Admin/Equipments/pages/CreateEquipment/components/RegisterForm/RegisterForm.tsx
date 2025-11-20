import { Button } from "@shared/components/Core/Buttons/Button";
import { InputText } from "@shared/components/Core/Form/Fields/InputText";
import { InputFile } from "@shared/components/Core/Form/Fields/InputFile";
import { InputNumber } from "@/shared/components/Core/Form/Fields/InputNumber";
import { Select } from "@shared/components/Core/Form/Fields/Select";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { Skeleton } from "@shared/components/Core/Skeleton";
import { useAlertContext } from "@shared/contexts/Alert";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { comprimirImagem } from "@shared/utils/image-compress/imageCompression";

import { TextArea } from "@/shared/components/Core/Form/Fields/TextArea";

import { equipmentValidationSchema, IEquipmentRegisterForm } from "./RegisterForm.form";

interface Props {
  initialValues: IEquipmentRegisterForm | null;
  onSubmit: (data: IEquipmentRegisterForm) => void;
}

export function EquipmentRegisterForm({ initialValues, onSubmit }: Props) {
  const { addAlertOnCancel } = useAlertContext();
  const navigate = useNavigate();
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [isCroquisChanged, setIsCroquisChanged] = useState(false);
  const [isCroquisDeleted, setIsCroquisDeleted] = useState(false);

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
      validationSchema={equipmentValidationSchema}
      onSubmit={(values) => {
        // Adicionar informações sobre croqui nos dados
        const dataWithCroquisFlags = {
          ...values,
          __isCroquisChanged: isCroquisChanged,
          __isCroquisDeleted: isCroquisDeleted,
        };
        onSubmit(dataWithCroquisFlags);
      }}
    >
      {({ touched, errors, dirty, isValid, setFieldValue, setFieldTouched, values }) => (
        <Form>
          <Row className="mb-4">
            <Col xl={4}>
              <Field
                as={InputText}
                label="Nome do Equipamento"
                name="name"
                placeholder="Informe o nome do equipamento"
                maxLength={100}
                type="text"
                error={touched.name && !!errors.name}
                helperText={touched.name && !!errors.name ? errors.name : ""}
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputText}
                label="Pontos de Inspeção"
                name="totalInspectionPoints"
                placeholder="0"
                error={touched.totalInspectionPoints && !!errors.totalInspectionPoints}
                allowedCharsPattern={/[^0-9/-]/g}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("totalInspectionPoints", e.target.value);
                }}
                helperText={
                  touched.totalInspectionPoints && !!errors.totalInspectionPoints
                    ? errors.totalInspectionPoints
                    : ""
                }
              />
            </Col>

            <Col xl={4} className="d-flex justify-content-end">
              <Field
                as={Select}
                label="Status"
                name="isActive"
                placeholder="Selecionar"
                options={[
                  { value: "true", label: "Ativo" },
                  { value: "false", label: "Inativo" },
                ]}
                error={touched.isActive && !!errors.isActive}
                helperText={touched.isActive && !!errors.isActive ? errors.isActive : ""}
                onChange={({ value }: IOption) => {
                  setFieldTouched("isActive");
                  setFieldValue("isActive", value);
                }}
              />
            </Col>
          </Row>

          <Row className="mb-4">
            {/* <Col xl={4}>
              <Field
                as={InputText}
                label="Croqui"
                name="coverUrl"
                placeholder="Selecione um croqui"
                type="file"
                error={touched.coverUrl && !!errors.coverUrl}
                helperText={touched.coverUrl && !!errors.coverUrl ? errors.coverUrl : ""}
              />
            </Col> */}

            <Col xl={8}>
              <Field
                as={TextArea}
                label="Descrição"
                name="description"
                placeholder="Informe a descrição da peça"
                maxlength={1024}
                type="text"
                error={touched.description && !!errors.description}
                helperText={touched.description && !!errors.description ? errors.description : ""}
              />
            </Col>

            <Col xl={4}>
              <Field
                as={InputFile}
                label="Croqui"
                name="coverUrl"
                placeholder={
                  isCompressingImage
                    ? "Comprimindo imagem..."
                    : "Clique para selecionar ou arraste o croqui do equipamento"
                }
                type="file"
                accept="image/*"
                disabled={isCompressingImage}
                error={touched.coverUrl && !!errors.coverUrl}
                helperText={touched.coverUrl && !!errors.coverUrl ? errors.coverUrl : ""}
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      setIsCompressingImage(true);
                      setIsCroquisChanged(true); // Marcar que o croqui foi alterado
                      setIsCroquisDeleted(false); // Resetar flag de deletado se nova imagem foi selecionada

                      // Comprimir a imagem usando a função personalizada
                      const compressedBase64 = await comprimirImagem(file, {
                        maxSizeMB: 2, // Limite de 2MB para croquis (podem ser mais detalhados)
                        maxWidthOrHeight: 1920, // Máximo 1920px
                        quality: 0.85, // 85% de qualidade para manter detalhes
                        fileType: "image/jpeg",
                      });

                      setFieldValue("coverUrl", compressedBase64);
                    } catch (error) {
                      // Em caso de erro, usar o método original
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        setFieldValue("coverUrl", base64);
                      };
                      reader.readAsDataURL(file);
                    } finally {
                      setIsCompressingImage(false);
                    }
                  } else {
                    setFieldValue("coverUrl", "");
                    setIsCroquisChanged(true); // Marcar como alterado quando removido
                  }
                }}
                onRemove={() => {
                  setFieldValue("coverUrl", "");
                  setFieldTouched("coverUrl", true);
                  setIsCroquisChanged(true); // Marcar como alterado quando removido
                  setIsCroquisDeleted(true); // Marcar especificamente como deletado
                }}
              />
            </Col>
          </Row>

          {/* <Row className="mb-4"></Row> */}

          <Row className="justify-content-end">
            <Col xs="auto">
              <Row>
                <Col xs="auto">
                  <Button
                    type="button"
                    styles="primary"
                    mode="warning"
                    onClick={() => handleOnCancel(dirty)}
                  >
                    Cancelar
                  </Button>
                </Col>

                <Col xs="auto">
                  <Button
                    type="submit"
                    styles="primary"
                    mode="success"
                    disabled={!dirty || !isValid}
                  >
                    Salvar
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}
