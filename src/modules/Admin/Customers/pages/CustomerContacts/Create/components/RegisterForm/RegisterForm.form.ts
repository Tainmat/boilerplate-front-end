import * as Yup from "yup";

import { StringBoolean } from "@/shared/constants/options";
import { isEmailValid } from "@/shared/utils/validations";

export interface ICustomerContatcRegisterForm {
  name: string;
  email: string;
  phone: string;
  extension: string;
  mobile: string;
  isWhatsApp: StringBoolean;
  receiveInspectionEmail: StringBoolean;
  isActive: StringBoolean;
}

export const customerContactValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("O campo é obrigatório!")
    .max(124, "O campo deve conter no máximo 124 caracteres!"),
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
    .max(100, "O campo deve conter no máximo 100 caracteres!"),
  phone: Yup.string().required("O campo é obrigatório!"),
  extension: Yup.string().max(10, "O campo deve conter no máximo 10 caracteres!"),
  mobile: Yup.string().required("O campo é obrigatório!"),
  isWhatsApp: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]),
  receiveInspectionEmail: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]),
  isActive: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]),
});
