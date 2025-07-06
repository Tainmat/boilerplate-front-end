import * as Yup from "yup";

export interface IEquipmentRegisterForm {
  uuidTipoPeca: string;
  ttPontoInspecao: number | string;
  nomeEquipamento: string;
  dsObservacao: string;
  inStatusCadastroEquipamento: "true" | "false";
  uuidCliente: string;
}

export const equipmentValidationSchema = Yup.object().shape({
  uuidTipoPeca: Yup.string().required("O campo é obrigatório!"),
  ttPontoInspecao: Yup.number()
    .required("O campo é obrigatório!")
    .min(1, "Deve haver pelo menos 1 ponto de inspeção")
    .max(100, "Número máximo de pontos excedido"),
  nomeEquipamento: Yup.string()
    .required("O campo é obrigatório!")
    .max(100, "O campo deve conter no máximo 100 caracteres!"),
  dsObservacao: Yup.string().max(
    1024,
    "O campo deve conter no máximo 1024 caracteres",
  ),
  inStatusCadastroEquipamento: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]),
  uuidCliente: Yup.string().required("O campo é obrigatório!"),
});