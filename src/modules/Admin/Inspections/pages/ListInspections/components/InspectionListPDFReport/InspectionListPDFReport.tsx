import Logo from "@assets/images/logo2.png";
import { Table, Tbody, Td, Th, Thead, Tr } from "@shared/components/Core/Table";

import { formatDateTimeBR } from "@/shared/utils/date/dayjs";

import { PDF_FIELD_LABELS } from "./inspectionPdfFields";

const ROWS_PER_PAGE = 13;

interface Props {
  data: Record<string, string>[];
  fields: string[];
  generatedAt: Date;
}

export function InspectionListPDFReport({ data, fields, generatedAt }: Props) {
  const totalPages = Math.max(1, Math.ceil(data.length / ROWS_PER_PAGE));
  const generatedAtFormatted = formatDateTimeBR(generatedAt);

  const pages = Array.from({ length: totalPages }, (_, i) =>
    data.slice(i * ROWS_PER_PAGE, (i + 1) * ROWS_PER_PAGE),
  );

  return (
    <div>
      {pages.map((pageRows, pageIndex) => (
        <div
          key={pageIndex}
          className="pdf-page"
          style={{
            width: "297mm",
            height: "210mm",
            overflow: "hidden",
            padding: "8mm",
            boxSizing: "border-box",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Cabeçalho — repetido em todas as páginas */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "2px solid #333",
              paddingBottom: "3mm",
              marginBottom: "4mm",
            }}
          >
            <img src={Logo} style={{ height: "16mm", width: "auto" }} alt="Logo" />

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: "bold", letterSpacing: "1px" }}>
                RELATÓRIO DE INSPEÇÕES
              </div>
            </div>

            {/* Espaçador para centralizar o título */}
            <div style={{ width: "80px" }} />
          </div>

          {/* Tabela */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <Table $bordered>
              <Thead>
                <Tr>
                  {fields.map((field) => (
                    <Th
                      key={field}
                      style={{
                        fontSize: "9px",
                        padding: "2mm 3mm",
                        whiteSpace: "nowrap",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      {PDF_FIELD_LABELS[field] ?? field}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {pageRows.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {fields.map((field) => (
                      <Td
                        key={field}
                        style={{
                          fontSize: "8px",
                          padding: "2mm 3mm",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "50mm",
                        }}
                      >
                        {row[field] ?? "-"}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>

          {/* Rodapé */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid #ccc",
              paddingTop: "2mm",
              marginTop: "2mm",
              fontSize: "8px",
              color: "#555",
            }}
          >
            <span>Gerado em: {generatedAtFormatted}</span>
            <span>
              {pageIndex + 1}/{totalPages}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
