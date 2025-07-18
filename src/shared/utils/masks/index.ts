export function clearMask(value: string | undefined): string {
  if (!value) return "";

  return value.replace(/[^A-Za-z0-9]+/g, "");
}

export function cpfMask(value: string): string {
  return value
    .replace(/\D+/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$2");
}

export function cnpjMask(value: string | number | undefined): string {
  if (!value) return "";

  return String(value)
    .replace(/\D+/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
}

export {
  phoneInputMask,
  phoneNumberMask,
  cleanPhoneNumber,
  formatPhoneNumber,
  validatePhoneNumber,
  getPhoneType,
  getPhoneTypeDescription,
  legacyPhoneNumberMask as phoneNumberMask_legacy,
  legacyCellPhoneNumberMask as cellPhoneNumberMask_legacy,
} from "./phoneMask";

export function cellPhoneNumberMask(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2 ")
    .replace(/(\d)(\d{4})$/, "$1-$2");
}

export function phoneNumberMask_old(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
}

export function cepMask(value: string): string {
  if (!value) return "";
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1$2")
    .replace(/(\d)(\d{3})$/, "$1-$2");
}

export function cnaeMask(value: string): string {
  return value
    .replace(/\D+/g, "")
    .replace(/(\d{5})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(\d{2})\d+?$/, "$1");
}

export function tonneUnityMask(value: number | string | null | undefined, decimal = true): string {
  if (!value || value === ".000") return "0.000";

  return decimal
    ? value.toLocaleString("pt-BR", {
        style: "decimal",
        minimumFractionDigits: 3,
      })
    : value.toLocaleString("en-US");
}

export function numberMask(value: number | string | null, fractionDigits?: number): string {
  if (!value) return "0,00";

  if (typeof value === "string") {
    const newValue = Number(value.replace(".", "").replace(",", "."));

    return new Intl.NumberFormat("pt-br", {
      style: fractionDigits ? "decimal" : undefined,
      maximumFractionDigits: fractionDigits || 0,
      minimumFractionDigits: fractionDigits || 0,
    }).format(Number(newValue));
  }

  return new Intl.NumberFormat("pt-br", {
    style: fractionDigits ? "decimal" : undefined,
    maximumFractionDigits: fractionDigits || 0,
    minimumFractionDigits: fractionDigits || 0,
  }).format(value);
}

export function percentMask(value: number | string | null, fractionDigits?: number): string {
  if (!value) return "0%";

  if (typeof value === "string") {
    const newValue = Number(value.replace(".", "").replace(",", "."));

    return `${new Intl.NumberFormat("pt-br", {
      maximumFractionDigits: fractionDigits || 2,
      minimumFractionDigits: fractionDigits || 2,
    }).format(Number(newValue))}%`;
  }

  return `${new Intl.NumberFormat("pt-br", {
    maximumFractionDigits: fractionDigits || 2,
    minimumFractionDigits: fractionDigits || 2,
  }).format(value)}%`;
}

export function ipMask(value: string): string {
  if (!value) return "";

  return String(value)
    .replace(/\D+/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2");
}

export function timeMask(value: string): string {
  if (!value) return "";

  const digits = value.replace(/\D+/g, "");
  const limitedDigits = digits.slice(0, 4);

  const formatted =
    limitedDigits.length > 2
      ? `${limitedDigits.slice(0, 2)}:${limitedDigits.slice(2)}`
      : limitedDigits;

  return formatted;
}

export function fillWithLeadingZero(value: string | number, size: number): string {
  let newValue = value;

  newValue = newValue.toString();
  newValue = newValue.trim();

  if (newValue && newValue.length < size) {
    for (let i = newValue.length; i < size; i++) {
      newValue = `0${newValue}`;
    }
  }

  return newValue;
}

export function patternFormat(value: string | number | undefined, pattern: string): string {
  if (!value) return "";

  let i = 0;

  const v = clearMask(String(value)).toString();

  return pattern.replace(/#/g, () => v[i++] || "");
}

export function capitalizeFirstLetter(value: string): string {
  return value.replace(/^./, value[0].toUpperCase());
}

export function removeMask(value: string): string {
  return value.replace(/\D/g, "");
}

export function plateMask(value: string): string {
  const validate = /([A-Za-z]{3})([0-9]{1})([0-9a-jA-J]{1})([0-9]{2})/;

  if (value.length >= 7 && !validate.test(value)) {
    return "";
  }

  return value.replace(/[^A-Z0-9a-z]/g, "").toUpperCase();
}

export function CurrencyMask(value: number | string | null, fractionDigits?: number): string {
  if (!value) return "R$ 0,00";

  if (typeof value === "string") {
    const valueSplit = value.split(".")[1];
    const newValue =
      Number(value.replace(".", "").replace(",", ".").replace(/\D/g, "")) /
      (valueSplit && valueSplit !== "00" ? 100 : 1);

    return `R$ ${new Intl.NumberFormat("pt-br", {
      maximumFractionDigits: fractionDigits || 2,
      minimumFractionDigits: fractionDigits || 2,
    }).format(Number(newValue))}`;
  }

  const bigIntegerValue = Number(String(value).replace(/\D/g, ""));

  const valueSplit = String(value).split(".")[1];

  return `R$ ${new Intl.NumberFormat("pt-br", {
    maximumFractionDigits: fractionDigits || 2,
    minimumFractionDigits: fractionDigits || 2,
  }).format(bigIntegerValue / (valueSplit && valueSplit !== "00" ? 100 : 1))}`;
}
