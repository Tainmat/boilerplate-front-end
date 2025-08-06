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
import { useInspection, IInspectionCreateData } from "@shared/hooks/services/Admin/useInspection";

import { InspectionRegisterForm } from "./components/RegisterForm";
import { IInspectionRegisterForm, IImageData } from "./components/RegisterForm/RegisterForm.form";
import { EquipmentSelectionStep } from "./components/EquipmentSelectionStep";

export function CreateInspection() {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { uuid } = useParams();
  const {
    fetchInspection,
    createInspection,
    updateInspection,
    uploadInspectionAttachments,
  } = useInspection();

  const [inspection, setInspection] = useState<IInspectionRegisterForm | null>(null);
  const [currentStep, setCurrentStep] = useState<"equipment" | "form">("equipment");
  const [selectedEquipment, setSelectedEquipment] = useState<IEquipment | null>(null);

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

        // Função para converter URL em base64 usando Canvas (evita problemas de CORS)
        const convertUrlToBase64 = async (url: string): Promise<string> => {
          try {
            console.log('Tentando carregar imagem de:', url);
            
            // Primeira tentativa: usar fetch direto
            try {
              const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include'
              });
              
              if (response.ok) {
                const blob = await response.blob();
                console.log('Blob recebido via fetch:', blob.type, blob.size);
                
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const result = reader.result as string;
                    console.log('Base64 gerado via fetch:', result ? 'Sucesso' : 'Falhou');
                    resolve(result);
                  };
                  reader.onerror = reject;
                  reader.readAsDataURL(blob);
                });
              }
            } catch (fetchError) {
              console.log('Fetch falhou, tentando abordagem alternativa:', fetchError);
            }
            
            // Segunda tentativa: usar HTMLImageElement + Canvas (funciona melhor com CORS)
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = 'anonymous'; // Importante para CORS
              
              img.onload = () => {
                try {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  
                  if (!ctx) {
                    reject(new Error('Não foi possível obter contexto do canvas'));
                    return;
                  }
                  
                  canvas.width = img.width;
                  canvas.height = img.height;
                  
                  ctx.drawImage(img, 0, 0);
                  
                  const base64 = canvas.toDataURL('image/png');
                  console.log('Base64 gerado via canvas:', base64 ? 'Sucesso' : 'Falhou');
                  resolve(base64);
                } catch (canvasError) {
                  console.error('Erro no canvas:', canvasError);
                  reject(canvasError);
                }
              };
              
              img.onerror = (error) => {
                console.error('Erro ao carregar imagem:', error);
                reject(error);
              };
              
              img.src = url;
            });
            
          } catch (error) {
            console.error('Erro ao converter URL para base64:', error);
            return '';
          }
        };

        // Processar imagens dos attachments existentes
        const existingImages: (IImageData | null)[] = [null, null, null];
        
        console.log('Dados recebidos da API:', data);
        console.log('Attachments encontrados:', data.attachments);
        
        if (data.attachments && data.attachments.length > 0) {
          console.log(`Processando ${data.attachments.length} attachments...`);
          
          // Converter URLs para base64 de forma assíncrona
          const imagePromises = data.attachments.slice(0, 3).map(async (attachment: any, index: number) => {
            console.log(`Processando attachment ${index}:`, attachment);
            
            if (attachment.inspectionAttachmentUrl) {
              try {
                // O inspectionAttachmentUrl retorna um path do servidor como:
                // "/var/www/jometto.com.br/qas-usincheck/assets/public/inspections/..."
                // Precisamos extrair apenas a parte relevante e construir a URL correta
                
                let imageUrl: string;
                
                if (attachment.inspectionAttachmentUrl.startsWith('http')) {
                  // Se já é uma URL completa, usar diretamente
                  imageUrl = attachment.inspectionAttachmentUrl;
                } else if (attachment.inspectionAttachmentUrl.includes('/assets/public/')) {
                  // Extrair apenas a parte após /assets/public/
                  const assetPath = attachment.inspectionAttachmentUrl.split('/assets/public/')[1];
                  imageUrl = `https://qas-usincheck.jometto.com.br/assets/public/${assetPath}`;
                } else {
                  // Fallback: usar o VITE_API_URL
                  imageUrl = `${import.meta.env.VITE_API_URL}${attachment.inspectionAttachmentUrl}`;
                }
                
                console.log(`URL original: ${attachment.inspectionAttachmentUrl}`);
                console.log(`URL construída para attachment ${index}:`, imageUrl);
                
                const base64 = await convertUrlToBase64(imageUrl);
                
                if (base64) {
                  const imageData = {
                    id: attachment.id,
                    base64: base64,
                    name: `attachment-${attachment.id}.png`,
                    size: 0, // Tamanho não disponível do servidor
                    type: base64.includes('data:image/') ? base64.split(';')[0].split(':')[1] : 'image/png'
                  };
                  
                  console.log(`Imagem ${index} processada com sucesso:`, imageData);
                  existingImages[index] = imageData;
                } else {
                  console.warn(`Base64 vazio para attachment ${index}`);
                }
              } catch (error) {
                console.error(`Erro ao carregar imagem ${attachment.id}:`, error);
              }
            } else {
              console.warn(`URL de attachment ${index} não encontrada:`, attachment);
            }
          });

          // Aguardar o carregamento de todas as imagens
          await Promise.all(imagePromises);
          console.log('Imagens processadas:', existingImages);
        } else {
          console.log('Nenhum attachment encontrado');
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
          // Estrutura de imagens adicionais com dados existentes
          additionalImages: {
            images: existingImages,
            imagesToDel: []
          }
        };

        console.log('Dados do formulário sendo definidos:', formData);
        console.log('Imagens adicionais no formulário:', formData.additionalImages);
        
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
      // Nova estrutura de imagens adicionais
      additionalImages: {
        images: [null, null, null], // 3 slots vazios
        imagesToDel: []
      }
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
        imagesToDel: [] as string[]
      };

      // Adicionar imagens atuais em base64
      if (formValues.additionalImages?.images) {
        formValues.additionalImages.images.forEach((imageData) => {
          if (imageData && imageData.base64) {
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
        // Campos de conclusão podem ser vazios já que foram removidos do formulário
        flankAndBottomConclusion: "",
        keywayChannelsConclusion: "",
        additionalObservations: "",
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
        // Modo criação - POST
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
