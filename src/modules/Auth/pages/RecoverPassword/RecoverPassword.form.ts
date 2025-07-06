import { isEmailValid } from "@shared/utils/validations";
import * as Yup from "yup";

export interface IRecoverPassForm {
  emailUsuario: string;
}

export const initialValuesSchema: IRecoverPassForm = {
  emailUsuario: "",
};

export const recoverPassValidationsSchema = Yup.object().shape({
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
});
