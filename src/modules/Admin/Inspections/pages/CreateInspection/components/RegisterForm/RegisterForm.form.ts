import * as Yup from "yup";

export interface IInspectionRegisterForm {
  tipoInspecao: string;
  numeroInspecao: string;
  dataInspecao: string;
  horaInspecao: string;
  uuidCliente: string;
  uuidEquipamento: string;
  uuidInspector: string;
  statusInspecao: "AGENDADA" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";
  prioridadeInspecao: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  descricaoObjetivo: string;
  observacoesInspecao: string;
  inStatusCadastroInspecao: "true" | "false";
}

export const inspectionValidationSchema = Yup.object().shape({
  tipoInspecao: Yup.string().required("O campo é obrigatório!"),
  numeroInspecao: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  dataInspecao: Yup.string().required("O campo é obrigatório!"),
  horaInspecao: Yup.string().required("O campo é obrigatório!"),
  uuidCliente: Yup.string().required("O campo é obrigatório!"),
  uuidEquipamento: Yup.string().required("O campo é obrigatório!"),
  uuidInspector: Yup.string().required("O campo é obrigatório!"),
  statusInspecao: Yup.string()
    .required("O campo é obrigatório!")
    .oneOf(["AGENDADA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"]),
  prioridadeInspecao: Yup.string()
    .required("O campo é obrigatório!")
    .oneOf(["BAIXA", "MEDIA", "ALTA", "CRITICA"]),
  descricaoObjetivo: Yup.string()
    .required("O campo é obrigatório!")
    .max(500, "O campo deve conter no máximo 500 caracteres!"),
  observacoesInspecao: Yup.string().max(
    1024,
    "O campo deve conter no máximo 1024 caracteres",
  ),
  inStatusCadastroInspecao: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]),
});