export type PhoneType = "MOBILE" | "LANDLINE" | "UNKNOWN";
export type CountryCode = "BR" | "US";

export interface PhoneNumberConfig {
  country?: CountryCode;
  allowInternational?: boolean;
}

export interface PhoneNumberResult {
  formatted: string;
  raw: string;
  isValid: boolean;
  type: PhoneType;
  country: CountryCode;
}

// Phone number patterns for different countries
const PHONE_PATTERNS = {
  BR: {
    mobile: /^(\d{2})(\d{5})(\d{4})$/,
    landline: /^(\d{2})(\d{4})(\d{4})$/,
    mobileFormatted: /^\(\d{2}\)\s\d{5}-\d{4}$/,
    landlineFormatted: /^\(\d{2}\)\s\d{4}-\d{4}$/,
  },
  US: {
    mobile: /^(\d{3})(\d{3})(\d{4})$/,
    landline: /^(\d{3})(\d{3})(\d{4})$/,
    mobileFormatted: /^\(\d{3}\)\s\d{3}-\d{4}$/,
    landlineFormatted: /^\(\d{3}\)\s\d{3}-\d{4}$/,
  },
};

/**
 * Removes all non-numeric characters from phone number
 */
export function cleanPhoneNumber(value: string): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}

/**
 * Determines phone type based on number of digits and country
 */
export function getPhoneType(cleanNumber: string, country: CountryCode = "BR"): PhoneType {
  if (!cleanNumber) return "UNKNOWN";

  switch (country) {
    case "BR":
      if (cleanNumber.length === 11 && cleanNumber[2] === "9") {
        return "MOBILE";
      } else if (cleanNumber.length === 10) {
        return "LANDLINE";
      }
      break;
    case "US":
      if (cleanNumber.length === 10) {
        // In US, both mobile and landline have 10 digits
        // We'll default to mobile for simplicity
        return "MOBILE";
      }
      break;
  }

  return "UNKNOWN";
}

/**
 * Validates phone number based on country and type
 */
export function validatePhoneNumber(cleanNumber: string, country: CountryCode = "BR"): boolean {
  if (!cleanNumber) return false;

  const patterns = PHONE_PATTERNS[country];

  switch (country) {
    case "BR":
      // Brazilian mobile: 11 digits, 3rd digit must be 9
      if (cleanNumber.length === 11 && cleanNumber[2] === "9") {
        return patterns.mobile.test(cleanNumber);
      }
      // Brazilian landline: 10 digits
      if (cleanNumber.length === 10) {
        return patterns.landline.test(cleanNumber);
      }
      break;
    case "US":
      // US numbers: 10 digits
      if (cleanNumber.length === 10) {
        return patterns.mobile.test(cleanNumber);
      }
      break;
  }

  return false;
}

/**
 * Formats phone number based on country and type
 */
export function formatPhoneNumber(cleanNumber: string, country: CountryCode = "BR"): string {
  if (!cleanNumber) return "";

  const patterns = PHONE_PATTERNS[country];
  const type = getPhoneType(cleanNumber, country);

  switch (country) {
    case "BR":
      if (type === "MOBILE" && cleanNumber.length === 11) {
        return cleanNumber.replace(patterns.mobile, "($1) $2-$3");
      } else if (type === "LANDLINE" && cleanNumber.length === 10) {
        return cleanNumber.replace(patterns.landline, "($1) $2-$3");
      }
      break;
    case "US":
      if (cleanNumber.length === 10) {
        return cleanNumber.replace(patterns.mobile, "($1) $2-$3");
      }
      break;
  }

  return cleanNumber;
}

/**
 * Real-time input mask for phone numbers (as user types)
 */
export function phoneInputMask(value: string, config: PhoneNumberConfig = {}): string {
  const { country = "BR" } = config;
  const cleanNumber = cleanPhoneNumber(value);

  if (!cleanNumber) return "";

  switch (country) {
    case "BR": {
      const limitedBR = cleanNumber.slice(0, 11);

      if (limitedBR.length <= 2) {
        return `(${limitedBR}`;
      } else if (limitedBR.length <= 6) {
        return `(${limitedBR.slice(0, 2)}) ${limitedBR.slice(2)}`;
      } else if (limitedBR.length <= 10) {
        return `(${limitedBR.slice(0, 2)}) ${limitedBR.slice(2, 6)}-${limitedBR.slice(6)}`;
      } else {
        return `(${limitedBR.slice(0, 2)}) ${limitedBR.slice(2, 7)}-${limitedBR.slice(7)}`;
      }
    }

    case "US": {
      const limitedUS = cleanNumber.slice(0, 10);

      if (limitedUS.length <= 3) {
        return `(${limitedUS}`;
      } else if (limitedUS.length <= 6) {
        return `(${limitedUS.slice(0, 3)}) ${limitedUS.slice(3)}`;
      } else {
        return `(${limitedUS.slice(0, 3)}) ${limitedUS.slice(3, 6)}-${limitedUS.slice(6)}`;
      }
    }

    default:
      return cleanNumber;
  }
}

/**
 * Complete phone number processing (validation + formatting)
 */
export function phoneNumberMask(value: string, config: PhoneNumberConfig = {}): PhoneNumberResult {
  const { country = "BR" } = config;
  const cleanNumber = cleanPhoneNumber(value);
  const type = getPhoneType(cleanNumber, country);
  const isValid = validatePhoneNumber(cleanNumber, country);
  const formatted = formatPhoneNumber(cleanNumber, country);

  return {
    formatted,
    raw: cleanNumber,
    isValid,
    type,
    country,
  };
}

/**
 * Get phone type description for display
 */
export function getPhoneTypeDescription(type: PhoneType, country: CountryCode = "BR"): string {
  switch (type) {
    case "MOBILE":
      return country === "BR" ? "Celular" : "Mobile";
    case "LANDLINE":
      return country === "BR" ? "Fixo" : "Landline";
    default:
      return "";
  }
}

/**
 * Legacy compatibility - maintains existing phoneNumberMask function
 */
export function legacyPhoneNumberMask(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d)(\d{4})$/, "$1-$2");
}

/**
 * Legacy compatibility - maintains existing cellPhoneNumberMask function
 */
export function legacyCellPhoneNumberMask(value: string): string {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2 ")
    .replace(/(\d)(\d{4})$/, "$1-$2");
}
