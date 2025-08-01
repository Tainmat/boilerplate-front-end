import * as Yup from "yup";

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
  // Conclusões dinâmicas dos pontos de inspeção
  inspectionPointsConclusions: { [key: string]: string };
  // Imagens adicionais
  additionalImages: File[];
  // Imagens convertidas para base64 (para envio ao back-end)
  additionalImagesBase64?: string[];
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
  // Conclusões dinâmicas dos pontos de inspeção
  inspectionPointsConclusions: Yup.object().test(
    "conclusions-validation",
    "Todos os pontos de inspeção devem ter conclusões preenchidas",
    function (value) {
      if (!value) return false;
      // Valida que todas as conclusões tenham no máximo 400 caracteres
      for (const conclusion of Object.values(value)) {
        if (typeof conclusion === "string" && conclusion.length > 400) {
          return this.createError({
            message: "Cada conclusão deve conter no máximo 400 caracteres",
          });
        }
      }
      return true;
    },
  ),
  // Imagens adicionais
  additionalImages: Yup.array()
    .of(
      Yup.mixed()
        .test("fileSize", "Arquivo muito grande (máx. 5MB)", (value: any) => {
          if (!value || !(value instanceof File)) return true;
          return value.size <= 5 * 1024 * 1024; // 5MB
        })
        .test("fileType", "Formato não suportado. Use JPG, PNG ou GIF", (value: any) => {
          if (!value || !(value instanceof File)) return true;
          return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
        }),
    )
    .max(5, "Máximo de 5 imagens permitidas"),
});
