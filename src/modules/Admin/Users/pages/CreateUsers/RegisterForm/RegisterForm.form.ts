import { isEmailValid } from "@shared/utils/validations";
import * as Yup from "yup";

export interface IUserRegisterForm {
  id?: string;
  name: string;
  socialName: string;
  password: string;
  birthDate: string;
  email: string;
  profileId: string;
  isActive: "true" | "false";
  signature: string | File;
}

export const usersValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  socialName: Yup.string().max(50, "O campo deve conter no máximo 50 caracteres!"),
  birthDate: Yup.string(),
  profileId: Yup.string().required("Selecione um perfil!"),
  email: Yup.string()
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
  isActive: Yup.string().required("O campo é obrigatório!").oneOf(["false", "true"]),
  signature: Yup.mixed().optional(),
});
