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
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ROUTE_LIST_INSPECTIONS } from "@/modules/Admin/Inspections/routes/Inspection.paths";
import { useAuthContext } from "@/shared/contexts/Auth";
import { useOnlineStatus } from "@/shared/contexts/OnlineStatus";
import { useOfflineInspections } from "@/shared/hooks/offline/useOfflineInspections";
import { useDropdownsRedux } from "@/shared/hooks/redux/useDropdownsRedux";
import { getById, getStoragePercentage } from "@/shared/services/indexedDB/inspectionsDB";
import { IEquipmentDropdown } from "@/shared/store/modules/Dropdowns";

import { EquipmentSelectionStep } from "./components/EquipmentSelectionStep";
import { InspectionRegisterForm } from "./components/RegisterForm";
import { IImageData, IInspectionRegisterForm } from "./components/RegisterForm/RegisterForm.form";

export function CreateInspection() {
  const { user } = useAuthContext();
  const { isOnline, syncInspection } = useOnlineStatus();
  const { addNewInspection, updateInspection: updateOfflineInspection } = useOfflineInspections();
  const navigate = useNavigate();
  const location = useLocation();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { uuid } = useParams();
  const { fetchInspection, createInspection, updateInspection } = useInspection();

  const [inspection, setInspection] = useState<IInspectionRegisterForm | null>(null);
  const [currentStep, setCurrentStep] = useState<"equipment" | "form">("equipment");
  const [selectedEquipment, setSelectedEquipment] = useState<IEquipmentDropdown | null>(null);

  const { customersDropdown, inspectionStatusDropdown, equipmentsDropdown } = useDropdownsRedux();
  const [editOffline, setEditOffline] = useState(false);

  useEffect(() => {
    document.title = TITLE_ADMIN_INSPECTIONS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Admin" },
      { text: "Cadastros", route: ROUTE_LIST_INSPECTIONS },
      { text: "Inspeções" },
    ]);

    const isOffline = location.pathname.includes("offline");

    if (isOffline) {
      setEditOffline(true);
    }

    if (uuid) {
      setCurrentStep("form");
      loadInspectionData(uuid, isOffline);
    }

    async function loadInspectionData(id: string, isOffline: boolean) {
      try {
        showLoader();

        if (isOffline) {
          await loadOfflineInspection(id);
        } else {
          await loadOnlineInspection(id);
        }
      } catch {
        handleApiRejection();
        navigate(-1);
      } finally {
        hideLoader();
      }
    }

    async function loadOfflineInspection(id: string) {
      const offlineData = await getById(id);

      if (!offlineData) {
        addToast({
          title: "Erro",
          description: "Inspeção não encontrada",
          type: "warning",
        });
        navigate(ROUTE_LIST_INSPECTIONS);
        return;
      }

      // Buscar equipamento pelo partTypeId
      const equipment = equipmentsDropdown.find((e) => e.id === offlineData.partTypeId);
      if (equipment) {
        setSelectedEquipment(equipment);
      }

      // IOfflineInspection já estende IInspectionRegisterForm
      setInspection(offlineData);
    }

    async function loadOnlineInspection(id: string) {
      const data = await fetchInspection(id);

      // Processar imagens dos attachments existentes que já vêm em base64 do backend
      const existingImages: (IImageData | null)[] = [null, null, null];

      if (data.attachments && data.attachments.length > 0) {
        data.attachments.slice(0, 3).forEach((attachment: any, index: number) => {
          if (attachment.url && attachment.url.startsWith("data:image/")) {
            existingImages[index] = {
              id: attachment.id,
              base64: attachment.url,
              name: `attachment-${attachment.id}.jpg`,
              size: 0,
              type: attachment.url.includes("data:image/")
                ? attachment.url.split(";")[0].split(":")[1]
                : "image/jpeg",
            };
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
        selectedPositions: (() => {
          if (data.positionNumber && typeof data.positionNumber === "string") {
            return data.positionNumber
              .split(",")
              .map((num: string) => parseInt(num.trim()))
              .filter((num: number) => !isNaN(num));
          } else {
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
        additionalImages: {
          images: existingImages,
          imagesToDel: [],
        },
        isActive: data.isActive,
      };

      setInspection(formData);

      if (data.partType) {
        setSelectedEquipment({
          id: data.partType.id,
          name: data.partType.name,
          description: data.partType.description || "",
          croqui: data.partType.croqui,
          totalInspectionPoints: data.partType.totalInspectionPoints || 0,
        });
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
    location,
    addToast,
    equipmentsDropdown,
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

      const newImages: string[] = [];
      if (formValues.additionalImages?.images) {
        formValues.additionalImages.images.forEach((imageData) => {
          if (imageData && imageData.base64 && !imageData.id) {
            newImages.push(imageData.base64);
          }
        });
      }

      const imagesToDelete: string[] = formValues.additionalImages?.imagesToDel || [];

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
        position1: formValues.selectedPositions?.includes(1) ? "Posição 1 selecionada" : "",
        position2: formValues.selectedPositions?.includes(2) ? "Posição 2 selecionada" : "",
        position3: formValues.selectedPositions?.includes(3) ? "Posição 3 selecionada" : "",
        position4: formValues.selectedPositions?.includes(4) ? "Posição 4 selecionada" : "",
        position5: formValues.selectedPositions?.includes(5) ? "Posição 5 selecionada" : "",
        position6: formValues.selectedPositions?.includes(6) ? "Posição 6 selecionada" : "",
        flankAndBottomConclusion: "",
        keywayChannelsConclusion: "",
        additionalObservations: "",
        images: newImages.length > 0 ? newImages : undefined,
        imagesToDelete: imagesToDelete.length > 0 ? imagesToDelete : undefined,
        isActive: formValues.isActive,
      };

      if (editOffline && uuid) {
        await updateOfflineInspection(uuid, {
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
          type: "success",
          title: "Sucesso!",
          description: "Inspeção offline atualizada com sucesso!",
        });

        if (isOnline) {
          syncInspection(uuid);
        }
      } else if (uuid) {
        await updateInspection(uuid, apiData);

        addToast({
          type: "success",
          title: "Sucesso!",
          description: "Inspeção atualizada com sucesso!",
        });
      } else {
        if (isOnline) {
          await createInspection(apiData);

          addToast({
            type: "success",
            title: "Sucesso!",
            description: "Inspeção criada com sucesso!",
          });
        } else {
          const storagePercentage = await getStoragePercentage();
          if (storagePercentage >= 98) {
            addToast({
              type: "warning",
              title: "Armazenamento cheio",
              description: `Uso em ${storagePercentage.toFixed(0)}%. Conecte-se para sincronizar.`,
            });
            hideLoader();
            return;
          }

          await addNewInspection({
            ...formValues,
            partType: equipmentsDropdown.find((i) => i.id === formValues.partTypeId)!,
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
            description: `Armazenamento em ${storagePercentage.toFixed(0)}%.`,
          });
        }
      }
      navigate(-1);
    } catch (err: any) {
      if (err.response.data.message) {
        addToast({
          type: "helper",
          title: "Erro",
          description: err.response.data.message,
        });
      } else {
        handleApiRejection();
      }
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
                  isEdit={!!uuid}
                />
              )}
            </Col>
          </Row>
        </Container>
      </Section>
    </AnimatedPage>
  );
}
