import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { Section } from "@shared/components/Core/Containers/Section";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { TITLE_ADMIN_INSPECTIONS } from "@shared/constants/title.browser";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useLoaderContext } from "@shared/contexts/Loader";
import { useToastContext } from "@shared/contexts/Toast";
import { IEquipment } from "@shared/hooks/services/Admin/useEquipments";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTE_LIST_INSPECTIONS } from "@/modules/Admin/Inspections/routes/Inspection.paths";
import { useInspection, IInspectionCreateData, IInspectionAttachment } from "@shared/hooks/services/Admin/useInspection";
import { filesToBase64 } from "@shared/utils/fileToBase64";

import { InspectionRegisterForm } from "./components/RegisterForm";
import { IInspectionRegisterForm } from "./components/RegisterForm/RegisterForm.form";
import { EquipmentSelectionStep } from "./components/EquipmentSelectionStep";

export function CreateInspection() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { uuid } = useParams();
  const {
    loading,
    inspection: inspectionData,
    fetchInspection,
    createInspection,
    updateInspection,
    fetchInspectionAttachments,
    uploadInspectionAttachments,
  } = useInspection();

  const [inspection, setInspection] = useState<IInspectionRegisterForm | null>(null);
  const [currentStep, setCurrentStep] = useState<"equipment" | "form">("equipment");
  const [selectedEquipment, setSelectedEquipment] = useState<IEquipment | null>(null);
  const [existingAttachments, setExistingAttachments] = useState<IInspectionAttachment[]>([]);

  useEffect(() => {
    document.title = TITLE_ADMIN_INSPECTIONS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Admin" },
      { text: "Cadastros", route: ROUTE_LIST_INSPECTIONS },
      { text: "Inspeções" },
    ]);

    if (uuid) {
      // Modo edição - pula step de equipamento e carrega dados
      setCurrentStep("form");
      loadInspectionData(uuid);
    }

    async function loadInspectionData(id: string) {
      try {
        showLoader();
        const data = await fetchInspection(id);

        // Converter dados da API para o formato do formulário
        const formData: IInspectionRegisterForm = {
          customerId: data.customerId || "",
          inspectorUserId: data.inspectorUserId || "",
          partTypeId: data.partTypeId || "",
          reportNumber: data.reportNumber || "",
          reportStartDate: data.reportStartDate || "",
          reportEndDate: data.reportEndDate || "",
          revisionNumber: data.revisionNumber || "00",
          sheetNumber: data.sheetNumber || "1/1",
          componentId: data.componentId || "",
          positionNumber: data.positionNumber || 1,
          inspectionLocation: data.inspectionLocation || "",
          mdaInformation: data.mdaInformation || "",
          isVI: data.isVI || false,
          isDM: data.isDM || false,
          isPM: data.isPM || false,
          isUS: data.isUS || false,
          isLP: data.isLP || false,
          isDU: data.isDU || false,
          finalConclusion: data.finalConclusion || "",
          inspectionStatusId: data.inspectionStatusId || "",
          isSandingBrushSandblasting: data.isSandingBrushSandblasting || false,
          isCleaningChemistry: data.isCleaningChemistry || false,
          instruments: data.instruments || "",
          // Determinar qual posição foi preenchida
          selectedPosition: data.position1
            ? "1"
            : data.position2
              ? "2"
              : data.position3
                ? "3"
                : data.position4
                  ? "4"
                  : data.position5
                    ? "5"
                    : data.position6
                      ? "6"
                      : "1",
          // Inicializar conclusões dinâmicas com dados existentes
          inspectionPointsConclusions: {
            point1: data.flankAndBottomConclusion || "",
            point2: data.keywayChannelsConclusion || "",
            ...(data.partType?.totalInspectionPoints
              ? Array.from({ length: data.partType.totalInspectionPoints }, (_, i) => i + 1)
                  .slice(2) // Pular os 2 primeiros que já mapeamos
                  .reduce(
                    (acc, pointNum) => {
                      acc[`point${pointNum}`] = "";
                      return acc;
                    },
                    {} as { [key: string]: string },
                  )
              : {}),
          },
          additionalImages: [], // Imagens não podem ser carregadas do backend
        };

        setInspection(formData);

        // Se há dados do part type, usar como equipamento selecionado
        if (data.partType) {
          setSelectedEquipment({
            id: data.partType.id,
            name: data.partType.name,
            description: data.partType.description || "",
            coverUrl: data.partType.coverUrl || "",
            totalInspectionPoints: data.partType.totalInspectionPoints || 0,
            isActive: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        // Carregar anexos existentes
        try {
          const attachments = await fetchInspectionAttachments(id);
          setExistingAttachments(attachments);
        } catch (error) {
          console.warn("Não foi possível carregar os anexos:", error);
          setExistingAttachments([]);
        }
      } catch (error) {
        handleApiRejection();
        navigate(-1);
      } finally {
        hideLoader();
      }
    }
  }, [
    setPageBreadcrumb,
    uuid,
    navigate,
    addToast,
    showLoader,
    hideLoader,
    fetchInspection,
    handleApiRejection,
  ]);

  function handleEquipmentSelection(equipment: IEquipment) {
    setSelectedEquipment(equipment);

    setInspection({
      customerId: "",
      inspectorUserId: "",
      partTypeId: equipment.id,
      reportNumber: "",
      reportStartDate: "",
      reportEndDate: "",
      revisionNumber: "00",
      sheetNumber: "1/1",
      componentId: "",
      positionNumber: 1,
      inspectionLocation: "",
      mdaInformation: "",
      isVI: false,
      isDM: false,
      isPM: false,
      isUS: false,
      isLP: false,
      isDU: false,
      finalConclusion: "",
      inspectionStatusId: "",
      isSandingBrushSandblasting: false,
      isCleaningChemistry: false,
      instruments: "",
      /* generalConsiderations: "", */
      // Posição de inspeção selecionada
      selectedPosition: "1",
      // Conclusões dinâmicas dos pontos de inspeção
      inspectionPointsConclusions: equipment.totalInspectionPoints
        ? Array.from({ length: equipment.totalInspectionPoints }, (_, i) => i + 1).reduce(
            (acc, pointNum) => {
              acc[`point${pointNum}`] = "";
              return acc;
            },
            {} as { [key: string]: string },
          )
        : {},
      // Imagens adicionais
      additionalImages: [],
    });
    setCurrentStep("form");
  }

  function handleBackToEquipmentSelection() {
    setCurrentStep("equipment");
    setSelectedEquipment(null);
    setInspection(null);
  }

  async function handleOnSubmit(formValues: IInspectionRegisterForm) {
    try {
      showLoader();

      // Converter imagens para base64 (mantido para possível uso futuro)
      const additionalImagesBase64 =
        formValues.additionalImages && formValues.additionalImages.length > 0
          ? await filesToBase64(formValues.additionalImages)
          : [];

      // Converter dados do formulário para o formato da API
      const apiData: IInspectionCreateData = {
        customerId: formValues.customerId,
        inspectorUserId: formValues.inspectorUserId,
        partTypeId: formValues.partTypeId,
        reportNumber: formValues.reportNumber,
        reportStartDate: formValues.reportStartDate,
        reportEndDate: formValues.reportEndDate,
        revisionNumber: formValues.revisionNumber,
        sheetNumber: formValues.sheetNumber,
        componentId: formValues.componentId,
        positionNumber: parseInt(formValues.selectedPosition) || 1,
        inspectionLocation: formValues.inspectionLocation,
        mdaInformation: formValues.mdaInformation,
        isVI: formValues.isVI,
        isDM: formValues.isDM,
        isPM: formValues.isPM,
        isUS: formValues.isUS,
        isLP: formValues.isLP,
        isDU: formValues.isDU,
        finalConclusion: formValues.finalConclusion,
        inspectionStatusId: formValues.inspectionStatusId,
        isSandingBrushSandblasting: formValues.isSandingBrushSandblasting,
        isCleaningChemistry: formValues.isCleaningChemistry,
        instruments: formValues.instruments,
        /* generalConsiderations: formValues.generalConsiderations, */
        // Converter selectedPosition para as posições individuais
        position1: formValues.selectedPosition === "1" ? "Posição 1 selecionada" : "",
        position2: formValues.selectedPosition === "2" ? "Posição 2 selecionada" : "",
        position3: formValues.selectedPosition === "3" ? "Posição 3 selecionada" : "",
        position4: formValues.selectedPosition === "4" ? "Posição 4 selecionada" : "",
        position5: formValues.selectedPosition === "5" ? "Posição 5 selecionada" : "",
        position6: formValues.selectedPosition === "6" ? "Posição 6 selecionada" : "",
        // Mapear conclusões dinâmicas para campos da API
        flankAndBottomConclusion: formValues.inspectionPointsConclusions?.point1 || "",
        keywayChannelsConclusion: formValues.inspectionPointsConclusions?.point2 || "",
        additionalObservations:
          Object.values(formValues.inspectionPointsConclusions || {})
            .slice(2)
            .filter((conclusion) => conclusion.trim())
            .join("\n\n") || "",
        // additionalImagesBase64: additionalImagesBase64, // Enviado separadamente via uploadInspectionAttachments
      };


      let inspectionId = uuid;

      if (uuid) {
        // Modo edição - PUT
        await updateInspection(uuid, apiData);
        
        // Se há imagens para anexar, enviar separadamente
        if (formValues.additionalImages && formValues.additionalImages.length > 0) {
          await uploadInspectionAttachments(uuid, formValues.additionalImages);
        }
        
        addToast({
          type: "success",
          title: "Sucesso!",
          description: "Inspeção atualizada com sucesso!",
        });
      } else {
        // Modo criação - POST
        const createdInspection = await createInspection(apiData);
        inspectionId = createdInspection?.id || createdInspection;
        
        // Se há imagens para anexar e temos o ID da inspeção, enviar attachments
        if (formValues.additionalImages && formValues.additionalImages.length > 0 && inspectionId) {
          await uploadInspectionAttachments(inspectionId, formValues.additionalImages);
        }
        
        addToast({
          type: "success",
          title: "Sucesso!",
          description: "Inspeção criada com sucesso!",
        });
      }

      navigate(-1);
    } catch (error) {
      handleApiRejection();
    } finally {
      hideLoader();
    }
  }

  return (
    <AnimatedPage>
      <Section>
        <Container fluid>
          <Row>
            <Col xs={12}>
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <Icon icon="post_add" />
                  <Subtitle size="sm">
                    {currentStep === "equipment" ? "Selecionar Equipamento" : "Cadastrar Inspeção"}
                  </Subtitle>
                </div>
                {currentStep === "form" && selectedEquipment && (
                  <div className="ms-auto d-flex align-items-center gap-2 mt-2 mt-md-0">
                    <span className="text-muted d-none d-sm-inline">Equipamento:</span>
                    <strong className="text-truncate" style={{ maxWidth: "200px" }}>
                      {selectedEquipment.name}
                    </strong>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {currentStep === "equipment" ? (
                <EquipmentSelectionStep
                  onEquipmentSelect={handleEquipmentSelection}
                  onCancel={() => navigate(-1)}
                />
              ) : (
                <InspectionRegisterForm
                  initialValues={inspection}
                  selectedEquipment={selectedEquipment}
                  onSubmit={(values) => handleOnSubmit(values)}
                  onBack={!uuid ? handleBackToEquipmentSelection : undefined}
                />
              )}
            </Col>
          </Row>
        </Container>
      </Section>
    </AnimatedPage>
  );
}
