import * as Yup from "yup";

export interface ICustomerRegisterForm {
  idCliente?: number;
  tipoPessoaCliente: "J";
  numeroDocumentoCliente: string;
  nomeRazaoSocialCliente: string;
  numeroCepCliente: string;
  dsLogradouroCliente: string;
  numeroLogradouroCliente: string;
  dsComplementoCliente: string;
  dsBairroCliente: string;
  dsMunicipioCliente: string;
  dsUfCliente: string;
  dsEmailCliente: string;
  numeroTelefoneCliente: string;
  descricaoObservacoesCliente: string;
  inStatusCadastroCliente: "true" | "false";
}

export const customerValidationSchema = Yup.object().shape({
  tipoPessoaCliente: Yup.string().required("O campo é obrigatório!").oneOf(["J"]),
  numeroDocumentoCliente: Yup.string().required("O campo é obrigatório!"),
  nomeRazaoSocialCliente: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  numeroCepCliente: Yup.string().required("O campo é obrigatório!"),
  dsLogradouroCliente: Yup.string()
    .required("O campo é obrigatório!")
    .max(100, "O campo deve conter no máximo 100 caracteres!"),
  numeroLogradouroCliente: Yup.string()
    .required("O campo é obrigatório!")
    .max(10, "O campo deve conter no máximo 10 caracteres!"),
  dsComplementoCliente: Yup.string().max(100, "O campo deve conter no máximo 100 caracteres!"),
  dsBairroCliente: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  dsMunicipioCliente: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  dsUfCliente: Yup.string().required("O campo é obrigatório!"),
  dsEmailCliente: Yup.string().email("E-mail inválido!").required("O campo é obrigatório!"),
  numeroTelefoneCliente: Yup.string().required("O campo é obrigatório!"),
  descricaoObservacoesCliente: Yup.string().max(
    1024,
    "O campo deve conter no máximo 1024 caracteres",
  ),
  inStatusCadastroCliente: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]),
});
