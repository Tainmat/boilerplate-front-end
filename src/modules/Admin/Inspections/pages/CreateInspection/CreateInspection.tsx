import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { Section } from "@shared/components/Core/Containers/Section";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { AnimatedPage } from "@shared/components/Layout/AnimatedPage";
import { TITLE_ADMIN_INSPECTIONS } from "@shared/constants/title.browser";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useLoaderContext } from "@shared/contexts/Loader";
import { useToastContext } from "@shared/contexts/Toast";
import { IInspectionCreateData, useInspection } from "@shared/hooks/services/Admin/useInspection";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTE_LIST_INSPECTIONS } from "@/modules/Admin/Inspections/routes/Inspection.paths";
import { useAuthContext } from "@/shared/contexts/Auth";
import { useOnlineStatus } from "@/shared/contexts/OnlineStatus";
import { useOfflineInspections } from "@/shared/hooks/offline/useOfflineInspections";
import { useDropdownsRedux } from "@/shared/hooks/redux/useDropdownsRedux";
import { getStorageSize } from "@/shared/services/indexedDB/inspectionsDB";
import { IEquipmentDropdown } from "@/shared/store/modules/Dropdowns";

import { EquipmentSelectionStep } from "./components/EquipmentSelectionStep";
import { InspectionRegisterForm } from "./components/RegisterForm";
import { IImageData, IInspectionRegisterForm } from "./components/RegisterForm/RegisterForm.form";

export function CreateInspection() {
  const { user } = useAuthContext();
  const { isOnline } = useOnlineStatus();
  const { addNewInspection } = useOfflineInspections();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { uuid } = useParams();
  const { fetchInspection, createInspection, updateInspection, uploadInspectionAttachments } =
    useInspection();

  const [inspection, setInspection] = useState<IInspectionRegisterForm | null>(null);
  const [currentStep, setCurrentStep] = useState<"equipment" | "form">("equipment");
  const [selectedEquipment, setSelectedEquipment] = useState<IEquipmentDropdown | null>(null);

  const { customersDropdown, inspectionStatusDropdown } = useDropdownsRedux();

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

        // Processar imagens dos attachments existentes que já vêm em base64 do backend
        const existingImages: (IImageData | null)[] = [null, null, null];

        if (data.attachments && data.attachments.length > 0) {
          // Processar imagens que já vêm em base64 do backend
          data.attachments.slice(0, 3).forEach((attachment: any, index: number) => {
            if (attachment.url && attachment.url.startsWith("data:image/")) {
              // attachment.url já é base64
              const imageData = {
                id: attachment.id,
                base64: attachment.url,
                name: `attachment-${attachment.id}.jpg`,
                size: 0, // Tamanho não disponível do servidor
                type: attachment.url.includes("data:image/")
                  ? attachment.url.split(";")[0].split(":")[1]
                  : "image/jpeg",
              };

              existingImages[index] = imageData;
            }
          });
        }

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
          positionNumber: data.positionNumber || "",
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
          // Determinar quais posições foram preenchidas
          selectedPositions: (() => {
            if (data.positionNumber && typeof data.positionNumber === "string") {
              // Se positionNumber é uma string no formato "1,2,4,6", fazer parse
              return data.positionNumber
                .split(",")
                .map((num: string) => parseInt(num.trim()))
                .filter((num: number) => !isNaN(num));
            } else {
              // Legacy: verificar posições individuais
              const positions = [];
              if (data.position1) positions.push(1);
              if (data.position2) positions.push(2);
              if (data.position3) positions.push(3);
              if (data.position4) positions.push(4);
              if (data.position5) positions.push(5);
              if (data.position6) positions.push(6);
              return positions.length > 0 ? positions : [1];
            }
          })(),
          // Estrutura de imagens adicionais com dados existentes
          additionalImages: {
            images: existingImages,
            imagesToDel: [],
          },
          isActive: data.isActive,
        };

        setInspection(formData);

        // Se há dados do part type, usar como equipamento selecionado
        if (data.partType) {
          setSelectedEquipment({
            id: data.partType.id,
            name: data.partType.name,
            description: data.partType.description || "",
            croqui: data.partType.croqui,
            totalInspectionPoints: data.partType.totalInspectionPoints || 0,
          });
        }
      } catch {
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
    showLoader,
    hideLoader,
    fetchInspection,
    handleApiRejection,
  ]);

  async function handleEquipmentSelection(equipment: IEquipmentDropdown) {
    setSelectedEquipment(equipment);

    setInspection({
      customerId: "",
      inspectorUserId: "",
      partTypeId: equipment.id || "",
      reportNumber: "",
      reportStartDate: "",
      reportEndDate: "",
      revisionNumber: "00",
      sheetNumber: "1/1",
      componentId: "",
      positionNumber: "",
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
      selectedPositions: [],
      additionalImages: {
        images: [null, null, null],
        imagesToDel: [],
      },
      isActive: true,
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

      // Preparar estrutura completa de imagens para envio em base64
      const imageDataToUpload = {
        images: [] as string[],
        imagesToDel: [] as string[],
      };

      // Adicionar APENAS imagens novas (sem ID, ou seja, que não vieram do servidor)
      if (formValues.additionalImages?.images) {
        formValues.additionalImages.images.forEach((imageData) => {
          // Só envia se a imagem tem base64 E não tem ID (imagem nova)
          if (imageData && imageData.base64 && !imageData.id) {
            imageDataToUpload.images.push(imageData.base64);
          }
        });
      }

      // Adicionar imagens para exclusão (se houver IDs)
      if (formValues.additionalImages?.imagesToDel) {
        formValues.additionalImages.imagesToDel.forEach((imageId) => {
          imageDataToUpload.imagesToDel.push(imageId);
        });
      }

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
        positionNumber: formValues.positionNumber || "",
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
        // Converter selectedPositions para as posições individuais e positionNumber
        position1: formValues.selectedPositions?.includes(1) ? "Posição 1 selecionada" : "",
        position2: formValues.selectedPositions?.includes(2) ? "Posição 2 selecionada" : "",
        position3: formValues.selectedPositions?.includes(3) ? "Posição 3 selecionada" : "",
        position4: formValues.selectedPositions?.includes(4) ? "Posição 4 selecionada" : "",
        position5: formValues.selectedPositions?.includes(5) ? "Posição 5 selecionada" : "",
        position6: formValues.selectedPositions?.includes(6) ? "Posição 6 selecionada" : "",
        // Campos de conclusão podem ser vazios já que foram removidos do formulário
        flankAndBottomConclusion: "",
        keywayChannelsConclusion: "",
        additionalObservations: "",
        isActive: formValues.isActive,
      };

      let inspectionId = uuid;

      if (uuid) {
        // Modo edição - PUT
        await updateInspection(uuid, apiData);

        // Se há imagens para anexar ou excluir, enviar separadamente
        if (imageDataToUpload.images.length > 0 || imageDataToUpload.imagesToDel.length > 0) {
          await uploadInspectionAttachments(uuid, imageDataToUpload);
        }

        addToast({
          type: "success",
          title: "Sucesso!",
          description: "Inspeção atualizada com sucesso!",
        });
      } else {
        if (isOnline) {
          const createdInspection = await createInspection(apiData);
          inspectionId = createdInspection?.id || createdInspection;

          // Se há imagens para anexar e temos o ID da inspeção, enviar attachments
          if (imageDataToUpload.images.length > 0 && inspectionId) {
            await uploadInspectionAttachments(inspectionId, imageDataToUpload);
          }

          addToast({
            type: "success",
            title: "Sucesso!",
            description: "Inspeção criada com sucesso!",
          });
        } else {
          const storageSize = await getStorageSize();
          if (storageSize > 45) {
            addToast({
              type: "warning",
              title: "Armazenamento cheio",
              description: "Espaço insuficiente. Conecte-se para sincronizar.",
            });
            hideLoader();
            return;
          }

          await addNewInspection({
            ...formValues,
            customer: customersDropdown.find((c) => c.id === formValues.customerId)!,
            inspectionStatus: inspectionStatusDropdown.find(
              (i) => i.id === formValues.inspectionStatusId,
            )!,
            inspectorUser: {
              id: user?.id || "",
              name: user?.socialName || "",
            },
          });

          addToast({
            type: "info",
            title: "Salvo offline",
            description: `Espaço usado: ${storageSize.toFixed(1)}MB`,
          });
        }
      }
      navigate(-1);
    } catch {
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
