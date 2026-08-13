import { isEmailValid } from "@shared/utils/validations";
import * as Yup from "yup";

export interface ILoginForm {
  emailUsuario: string;
  passwordUsuario: string;
}

export const initialValuesSchema: ILoginForm = {
  emailUsuario: "",
  passwordUsuario: "",
};

export const ValidationsSchema = Yup.object().shape({
  emailUsuario: Yup.string()
    .required("O campo é obrigatório")
    .test({
      name: "isEmailValid",
      exclusive: true,
      message: "Digite um e-mail válido",
      test: (value) => {
        return value ? isEmailValid(value) : true;
      },
    }),
  passwordUsuario: Yup.string()
    .required("O campo é obrigatório!"),
});
