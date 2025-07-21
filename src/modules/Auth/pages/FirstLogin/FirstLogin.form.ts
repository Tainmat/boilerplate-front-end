import * as Yup from "yup";

export interface IChangePasswordForm {
  passwordUsuario: string;
  novaPasswordUsuario: string;
  confirmaPasswordUsuario: string;
}

export const initialValuesSchema: IChangePasswordForm = {
  passwordUsuario: "",
  novaPasswordUsuario: "",
  confirmaPasswordUsuario: "",
};

export const validationsSchema = Yup.object().shape({
  passwordUsuario: Yup.string().required("A senha atual é obrigatória"),

  novaPasswordUsuario: Yup.string()
    .min(8, "A nova senha deve ter pelo menos 8 caracteres")
    .max(10, "A nova senha deve ter no máximo 10 caracteres")
    .matches(/[A-Z]/, "A nova senha deve conter pelo menos uma letra maiúscula")
    .matches(/[0-9]/, "A nova senha deve conter pelo menos um número")
    .matches(/[a-zA-Z0-9]/, "A nova senha deve ser alfanumérica")
    .required("A nova senha é obrigatória"),

  confirmaPasswordUsuario: Yup.string()
    .oneOf([Yup.ref("novaPasswordUsuario")], "As senhas devem coincidir")
    .required("A confirmação da senha é obrigatória"),
});
