import * as Yup from "yup";

/*    
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "corporateName": "Joao Silva Limitada",
  "fantasyName": "Silva Comercio",
  "cnpj": "12345678000195",
  "cep": "01310100",
  "street": "Av. Paulista",
  "number": "1000",
  "complement": "Sala 101",
  "neighborhood": "Bela Vista",
  "city": "Sao Paulo",
  "state": "SP",
  "email": "contato@joaosilva.com.br",
  "phone": "11987654321",
  "isActive": true,
  "created_at": "2023-01-01T10:00:00.000Z",
  "updated_at": "2023-01-01T10:00:00.000Z" 
*/

export interface ICustomerRegisterForm {
  id?: string;
  corporateName: string;
  fantasyName: string;
  cnpj: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  isActive: "true" | "false";
}

export const customerValidationSchema = Yup.object().shape({
  cnpj: Yup.string().required("O campo é obrigatório!"),
  corporateName: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  fantasyName: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  cep: Yup.string().required("O campo é obrigatório!"),
  street: Yup.string()
    .required("O campo é obrigatório!")
    .max(100, "O campo deve conter no máximo 100 caracteres!"),
  number: Yup.string()
    .required("O campo é obrigatório!")
    .max(10, "O campo deve conter no máximo 10 caracteres!"),
  complement: Yup.string().max(100, "O campo deve conter no máximo 100 caracteres!"),
  neighborhood: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  city: Yup.string()
    .required("O campo é obrigatório!")
    .max(50, "O campo deve conter no máximo 50 caracteres!"),
  state: Yup.string().required("O campo é obrigatório!"),
  email: Yup.string().email("E-mail inválido!").required("O campo é obrigatório!"),
  phone: Yup.string().required("O campo é obrigatório!"),
  isActive: Yup.string().required("O campo é obrigatório!").oneOf(["true", "false"]),
});
