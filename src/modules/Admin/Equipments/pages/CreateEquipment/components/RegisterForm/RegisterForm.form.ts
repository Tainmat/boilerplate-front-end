import * as Yup from "yup";

export interface IEquipmentRegisterForm {
  id?: string;
  name: string;
  description: string;
  totalInspectionPoints: number | string;
  isActive: "true" | "false";
  coverUrl: string | File;
}

export const equipmentValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("O campo é obrigatório!")
    .max(100, "O campo deve conter no máximo 100 caracteres!"),
  description: Yup.string().max(1024, "O campo deve conter no máximo 1024 caracteres"),
  totalInspectionPoints: Yup.number()
    .required("O campo é obrigatório!")
    .min(1, "Deve haver pelo menos 1 ponto de inspeção")
    .max(10, "Número máximo de pontos excedido"),
  isActive: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]) /* 
  coverUrl: Yup.mixed().required("A imagem do croqui é obrigatória"), */,
});
