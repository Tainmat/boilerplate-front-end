import { convertIsoDateToPtBr } from "@/shared/utils/date";

export const PDF_FIELD_LABELS: Record<string, string> = {
  isActive: "Ativo",
  customer: "Cliente",
  componentId: "Cód. Componente",
  isDM: "DM",
  reportEndDate: "Dt. Fim",
  reportStartDate: "Dt. Início",
  isDU: "DU",
  mdaInformation: "Inf. MDA",
  inspectorUser: "Inspetor",
  instruments: "Instrumentos",
  isCleaningChemistry: "Limp. Química",
  isSandingBrushSandblasting: "Lixamento/Escova",
  inspectionLocation: "Local Inspeção",
  isLP: "LP",
  sheetNumber: "Nº Folha",
  reportNumber: "Nº Relatório",
  revisionNumber: "Nº Revisão",
  isPM: "PM",
  positionNumber: "Posição",
  inspectionStatus: "Status",
  partType: "Tipo de Peça",
  isUS: "US",
  isVI: "VI",
};

export const AVAILABLE_PDF_FIELDS = Object.keys(PDF_FIELD_LABELS);

const BOOLEAN_FIELDS = new Set([
  "isVI",
  "isDM",
  "isPM",
  "isUS",
  "isLP",
  "isDU",
  "isSandingBrushSandblasting",
  "isCleaningChemistry",
  "isActive",
]);

const DATE_FIELDS = new Set(["reportStartDate", "reportEndDate"]);

const NESTED_RESOLVERS: Record<string, (item: any) => string> = {
  customer: (item) => item.customer?.fantasyName || "-",
  inspectorUser: (item) => item.inspectorUser?.name || "-",
  partType: (item) => item.partType?.name || "-",
  inspectionStatus: (item) => item.inspectionStatus?.description || "-",
};

export function transformInspectionDataForPdf(
  data: any[],
  fields: string[],
): Record<string, string>[] {
  return data.map((item) => {
    const row: Record<string, string> = {};

    fields.forEach((field) => {
      if (NESTED_RESOLVERS[field]) {
        row[field] = NESTED_RESOLVERS[field](item);
      } else if (BOOLEAN_FIELDS.has(field)) {
        row[field] = item[field] ? "Sim" : "Não";
      } else if (DATE_FIELDS.has(field)) {
        row[field] = item[field] ? convertIsoDateToPtBr(item[field]) : "-";
      } else {
        row[field] = item[field] != null ? String(item[field]) : "-";
      }
    });

    return row;
  });
}
