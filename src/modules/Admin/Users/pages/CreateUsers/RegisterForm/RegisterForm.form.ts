import { isEmailValid } from "@shared/utils/validations";
import * as Yup from "yup";

export interface IUserRegisterForm {
  nomeUsuario: string;
  emailUsuario: string;
  nomeSocialUsuario: string;
  dataNascimento: string;
  idPerfil: string;
  inStatusCadastroUsuario: "true" | "false";
}

export const usersValidationSchema = Yup.object().shape({
  nomeUsuario: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  nomeSocialUsuario: Yup.string()
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  dataNascimento: Yup.string(),
  idPerfil: Yup.string().required("Selecione um perfil!"),
  emailUsuario: Yup.string()
    .email("E-mail inválido!")
    .test({
      name: "isEmailValid",
      exclusive: true,
      message: "Digite um e-mail válido",
      test: (value) => {
        return value ? isEmailValid(value) : true;
      },
    })
    .max(100, "O campo deve conter no máximo 100 caracteres!")
    .required("O campo é obrigatório"),
  inStatusCadastroUsuario: Yup.string().required("O campo é obrigatório!").oneOf(["false", "true"]),
});
