/**
 * Converts an ISO date string to Brazilian date format (DD/MM/YYYY)
 */
export function convertIsoDateToPtBr(isoDate: string): string {
  if (!isoDate) return "";

  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
  } catch {
    return isoDate;
  }
}

/**
 * Formats a date object to a string in the specified format
 */
export function formatDate(date: Date, format: string = "dd/MM/yyyy"): string {
  if (!date) return "";

  try {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return format
      .replace("dd", day)
      .replace("MM", month)
      .replace("yyyy", year.toString())
      .replace("yy", year.toString().slice(-2));
  } catch {
    return "";
  }
}

/**
 * Converts a date string from one format to another
 */
export function convertDateFormat(
  dateStr: string,
  fromFormat: "iso" | "br" = "iso",
  toFormat: "iso" | "br" = "br",
): string {
  if (!dateStr) return "";

  try {
    let date: Date;

    if (fromFormat === "br") {
      const [day, month, year] = dateStr.split("/").map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateStr);
    }

    if (toFormat === "br") {
      return date.toLocaleDateString("pt-BR");
    } else {
      return date.toISOString();
    }
  } catch {
    return dateStr;
  }
}

export function formatDateWithUnderline(date: Date): string {
  if (!date) return "";

  try {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
  } catch {
    return "";
  }
}
