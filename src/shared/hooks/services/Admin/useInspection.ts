import { get, post, put } from "@shared/services/api/api.service";
import { useCallback, useState } from "react";

export interface IInspectionDetail {
  id: string;
  customerId: string;
  inspectorUserId: string;
  partTypeId: string;
  reportNumber: string;
  reportStartDate: string;
  reportEndDate: string;
  revisionNumber: string;
  sheetNumber: string;
  componentId: string;
  positionNumber: string;
  inspectionLocation: string;
  mdaInformation: string;
  isVI: boolean;
  isDM: boolean;
  isPM: boolean;
  isUS: boolean;
  isLP: boolean;
  isDU: boolean;
  finalConclusion: string;
  inspectionStatusId: string;
  isSandingBrushSandblasting: boolean;
  isCleaningChemistry: boolean;
  instruments: string;
  generalConsiderations: string;
  // Conclusões específicas
  flankAndBottomConclusion: string;
  keywayChannelsConclusion: string;
  additionalObservations: string;
  // Assinaturas
  supervisorName: string;
  clientRepresentativeName: string;
  // Dados relacionados
  customer?: {
    id: string;
    corporateName: string;
    fantasyName: string;
  };
  inspectorUser?: {
    id: string;
    name: string;
    signature?: string;
  };
  partType?: {
    id: string;
    name: string;
    description?: string;
    coverUrl?: string;
    totalInspectionPoints?: number;
  };
  inspectionStatus?: {
    id: string;
    description: string;
  };
  // Attachments/Imagens
  attachments?: IInspectionAttachment[];
}

export interface IInspectionAttachment {
  id: string;
  inspectionId: string;
  inspectionAttachmentUrl: string;
  created_at: string;
}

export interface IInspectionCreateData {
  customerId: string;
  inspectorUserId: string;
  partTypeId: string;
  reportNumber: string;
  reportStartDate: string;
  reportEndDate: string;
  revisionNumber: string;
  sheetNumber: string;
  componentId: string;
  positionNumber: string;
  inspectionLocation: string;
  mdaInformation: string;
  isVI: boolean;
  isDM: boolean;
  isPM: boolean;
  isUS: boolean;
  isLP: boolean;
  isDU: boolean;
  finalConclusion: string;
  inspectionStatusId: string;
  isSandingBrushSandblasting: boolean;
  isCleaningChemistry: boolean;
  instruments: string;
  /* generalConsiderations: string; */
  position1: string;
  position2: string;
  position3: string;
  position4: string;
  position5: string;
  position6: string;
  flankAndBottomConclusion: string;
  keywayChannelsConclusion: string;
  additionalObservations: string;
  /* supervisorName: string;
  clientRepresentativeName: string; */
  additionalImagesBase64?: string[];
  isActive: boolean;
}

export function useInspection() {
  const [loading, setLoading] = useState(false);
  const [inspection, setInspection] = useState<IInspectionDetail | null>(null);

  const fetchInspection = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const { data } = await get(`/operational/parts-inspection/${id}`);
      setInspection(data.data);
      return data.data;
    } catch (error) {
      setInspection(null);
      throw error; // Aqui o catch é mantido porque você faz setInspection(null)
    } finally {
      setLoading(false);
    }
  }, []);

  const createInspection = useCallback(async (inspectionData: IInspectionCreateData) => {
    try {
      setLoading(true);
      const { data } = await post("/operational/parts-inspection", inspectionData);
      return data.data || data;
    } finally {
      setLoading(false); // Removido o catch inútil, o erro sobe sozinho
    }
  }, []);

  const updateInspection = useCallback(
    async (id: string, inspectionData: IInspectionCreateData) => {
      try {
        setLoading(true);
        const { data } = await put(`/operational/parts-inspection/${id}`, inspectionData);
        const inspectionResult = data.data || data;
        setInspection(inspectionResult);
        return inspectionResult;
      } finally {
        setLoading(false); // Removido o catch inútil
      }
    },
    [],
  );

  const fetchInspectionAttachments = useCallback(async (id: string) => {
    const { data } = await get(`/operational/parts-inspection/${id}/attachments`);
    return data.data || data;
  }, []);

  const uploadInspectionAttachments = useCallback(
    async (id: string, imageData: { images: string[]; imagesToDel: string[] }) => {
      const payload = {
        images: imageData.images,
        imagesToDel: imageData.imagesToDel,
      };

      const { data } = await post(`/operational/parts-inspection/${id}/attachments`, payload, {
        "Content-Type": "application/json",
      });
      return data.data || data;
    },
    [],
  );

  const deleteInspectionAttachment = useCallback(
    async (inspectionId: string, attachmentId: string) => {
      await post(
        `/operational/parts-inspection/${inspectionId}/attachments/${attachmentId}/delete`,
      );
    },
    [],
  );

  return {
    loading,
    inspection,
    fetchInspection,
    createInspection,
    updateInspection,
    setInspection,
    fetchInspectionAttachments,
    uploadInspectionAttachments,
    deleteInspectionAttachment,
  };
}
