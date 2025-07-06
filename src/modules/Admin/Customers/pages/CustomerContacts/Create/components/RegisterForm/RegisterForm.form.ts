import * as Yup from "yup";

import { StringBoolean } from "@/shared/constants/options";
import { isEmailValid } from "@/shared/utils/validations";

export interface ICustomerContatcRegisterForm {
  nomeContatoCliente: string;
  dsEmailContatoCliente: string;
  numeroTelefoneContatoCliente: string;
  numeroRamalContatoCliente: string;
  numeroCelularContatoCliente: string;
  inWhatsAppContatoCliente: StringBoolean;
  inResponsavelLegal: StringBoolean;
  inResponsavelTecnico: StringBoolean;
  inRecebeEmail: StringBoolean;
  inStatusCadastroContatoCliente: StringBoolean;
  descricaoObservacoesContatoCliente: string;
}

export const customerContactValidationSchema = Yup.object().shape({
  nomeContatoCliente: Yup.string()
    .required("O campo é obrigatório!")
    .max(124, "O campo deve conter no máximo 124 caracteres!"),
  dsEmailContatoCliente: Yup.string()
    .email("E-mail inválido!")
    .test({
      name: "isEmailValid",
      exclusive: true,
      message: "Digite um e-mail válido",
      test: (value) => {
        return value ? isEmailValid(value) : true;
      },
    })
    .max(100, "O campo deve conter no máximo 100 caracteres!"),
  numeroTelefoneContatoCliente: Yup.string().required("O campo é obrigatório!"),
  numeroRamalContatoCliente: Yup.string().max(10, "O campo deve conter no máximo 10 caracteres!"),
  numeroCelularContatoCliente: Yup.string().required("O campo é obrigatório!"),
  inWhatsAppContatoCliente: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]),
  inResponsavelLegal: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]),
  inResponsavelTecnico: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]),
  inRecebeEmail: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]),
  inStatusCadastroContatoCliente: Yup.string()
    .required("O campo é obrigatório!")
    .oneOf(["true", "false"]),
  descricaoObservacoesContatoCliente: Yup.string().max(
    1024,
    "O campo deve conter no máximo 1024 caracteres!",
  ),
});
