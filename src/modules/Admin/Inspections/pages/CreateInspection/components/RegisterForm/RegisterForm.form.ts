import * as Yup from "yup";

export interface IImageData {
  id?: string; // ID da imagem se vier do servidor (para edição)
  base64: string;
  name: string;
  size: number;
  type: string;
}

export interface IAdditionalImages {
  images: (IImageData | null)[];
  imagesToDel: string[];
}

export interface IInspectionRegisterForm {
  customerId: string;
  inspectorUserId: string;
  partTypeId: string;
  reportNumber: string;
  reportStartDate: string;
  reportEndDate: string;
  revisionNumber: string;
  sheetNumber: string;
  componentId: string;
  positionNumber: number;
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
  /*   generalConsiderations: string; */
  // Posição de inspeção selecionada
  selectedPosition: string;
  // Nova estrutura de imagens adicionais
  additionalImages?: IAdditionalImages;
}

export const inspectionValidationSchema = Yup.object().shape({
  customerId: Yup.string().required("O campo é obrigatório!"),
  inspectorUserId: Yup.string().required("O campo é obrigatório!"),
  partTypeId: Yup.string().required("O campo é obrigatório!"),
  reportNumber: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  reportStartDate: Yup.string().required("O campo é obrigatório!"),
  reportEndDate: Yup.string().required("O campo é obrigatório!"),
  revisionNumber: Yup.string()
    .required("O campo é obrigatório!")
    .max(10, "O campo deve conter no máximo 10 caracteres!"),
  sheetNumber: Yup.string()
    .required("O campo é obrigatório!")
    .max(10, "O campo deve conter no máximo 10 caracteres!"),
  componentId: Yup.string()
    .required("O campo é obrigatório!")
    .max(100, "O campo deve conter no máximo 100 caracteres!"),
  positionNumber: Yup.number()
    .required("O campo é obrigatório!")
    .min(1, "A posição deve ser maior que 0"),
  inspectionLocation: Yup.string()
    .max(100, "O campo deve conter no máximo 100 caracteres!"),
  mdaInformation: Yup.string()
    .max(200, "O campo deve conter no máximo 200 caracteres!"),
  isVI: Yup.boolean(),
  isDM: Yup.boolean(),
  isPM: Yup.boolean(),
  isUS: Yup.boolean(),
  isLP: Yup.boolean(),
  isDU: Yup.boolean(),
  finalConclusion: Yup.string()
    .max(500, "O campo deve conter no máximo 500 caracteres!"),
  inspectionStatusId: Yup.string().required("O campo é obrigatório!"),
  isSandingBrushSandblasting: Yup.boolean(),
  isCleaningChemistry: Yup.boolean(),
  instruments: Yup.string()
    .required("O campo é obrigatório!")
    .max(500, "O campo deve conter no máximo 500 caracteres!"),
  generalConsiderations: Yup.string().max(600, "O campo deve conter no máximo 600 caracteres!"),
  // Posição de inspeção selecionada
  selectedPosition: Yup.string().required("Selecione uma posição de inspeção!"),
  // Nova estrutura de imagens adicionais
  additionalImages: Yup.object().shape({
    images: Yup.array()
      .of(
        Yup.mixed().nullable().test("imageValidation", "Dados da imagem inválidos", (value: any) => {
          if (!value) return true; // null é válido (slot vazio)
          
          // Verifica se é um objeto com as propriedades esperadas
          if (typeof value !== 'object' || !value.base64 || !value.name || !value.size || !value.type) {
            return false;
          }
          
          // Valida tamanho (2MB)
          if (value.size > 2 * 1024 * 1024) {
            return false;
          }
          
          // Valida tipo de arquivo
          if (!["image/jpeg", "image/png", "image/gif"].includes(value.type)) {
            return false;
          }
          
          return true;
        })
      )
      .max(3, "Máximo de 3 slots de imagem"),
    imagesToDel: Yup.array().of(Yup.string())
  }).optional(),
});
