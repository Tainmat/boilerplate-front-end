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
  profileName?: string;
  isActive: "true" | "false";
  signature: string | File;
  customersIds: string[];
}

export const usersValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  socialName: Yup.string().max(50, "O campo deve conter no máximo 50 caracteres!"),
  birthDate: Yup.string(),
  profileId: Yup.string().required("Selecione um perfil!"),
  password: Yup.string().when("id", {
    is: (id: string | undefined) => !id,
    then: (schema) =>
      schema
        .required("O campo é obrigatório!")
        .min(6, "A senha deve conter no mínimo 6 caracteres!")
        .max(20, "A senha deve conter no máximo 20 caracteres!"),
    otherwise: (schema) => schema.optional(),
  }),
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
  customersIds: Yup.array()
    .of(Yup.string())
    .when("profileName", {
      is: "Cliente",
      then: (schema) =>
        schema
          .min(1, "Selecione pelo menos um cliente!")
          .required("Selecione pelo menos um cliente!"),
      otherwise: (schema) =>
        schema
          .max(0, "Este perfil não pode ter clientes associados!")
          .test("is-empty", "Este perfil não pode ter clientes associados!", (value) => {
            return !value || value.length === 0;
          }),
    }),
});
