import AssinaturaLeandro from "@assets/images/assinatura_leandro.png";
import Logo from "@assets/images/logo2.png";
import { forwardRef } from "react";

import { IInspectionDetail } from "@/shared/hooks/services/Admin/useInspection";
import { formatDateBR } from "@/shared/utils/date/dayjs";
import { formatBase64ForImage } from "@/shared/utils/fileToBase64";

import * as S from "./InspectionPDFReport.styles";

interface InspectionPDFReportProps {
  inspection: IInspectionDetail;
}

export const InspectionPDFReport = forwardRef<HTMLDivElement, InspectionPDFReportProps>(
  ({ inspection }, ref) => {
    const getStatusClass = (status: string): string => {
      const statusMap: Record<string, string> = {
        Aprovado: "aprovado",
        "Com restrição": "com-restricao",
        "Não conforme": "nao-conforme",
        "Em análise": "em-analise",
      };
      return statusMap[status] || "";
    };

    const initialDate = formatDateBR(inspection.reportStartDate);
    const finalDate = formatDateBR(inspection.reportEndDate);

    return (
      <S.PDFContainer ref={ref}>
        {/* Header */}
        <S.Header>
          <S.HeaderLeft>
            <img src={Logo} style={{ width: "200px", height: "auto" }} alt="Logo" />
          </S.HeaderLeft>

          <S.HeaderCenter>
            <h1>RELATÓRIO DE INSPEÇÃO PREVENTIVA</h1>
          </S.HeaderCenter>

          <S.HeaderRight>
            <S.HeaderInfo>
              <h6>RELATÓRIO Nº:</h6>
              <S.HeaderInfoValue>{inspection.reportNumber}</S.HeaderInfoValue>
            </S.HeaderInfo>
            <S.HeaderInfo>
              <h6>DATA INICIO:</h6>
              <S.HeaderInfoValue>{initialDate}</S.HeaderInfoValue>
            </S.HeaderInfo>
            <S.HeaderInfo>
              <h6>DATA FINAL:</h6>
              <S.HeaderInfoValue>{finalDate}</S.HeaderInfoValue>
            </S.HeaderInfo>
            <S.HeaderInfo>
              <h6>REVISAO Nº:</h6>
              <S.HeaderInfoValue>{inspection.revisionNumber}</S.HeaderInfoValue>
            </S.HeaderInfo>
            <S.HeaderInfo>
              <h6>FOLHA Nº:</h6>
              <S.HeaderInfoValue noBorder>{inspection.sheetNumber}</S.HeaderInfoValue>
            </S.HeaderInfo>
          </S.HeaderRight>
        </S.Header>

        {/* Dados da Inspeção */}
        <S.InspectionDetails>
          <S.InspectionDetailsItem>
            <S.HeaderInfo>
              <h6>Cliente:</h6>
              <S.HeaderInfoValue>{inspection.customer?.fantasyName || "-"}</S.HeaderInfoValue>
            </S.HeaderInfo>

            <S.HeaderInfo>
              <h6>Componente/ID:</h6>
              <S.HeaderInfoValue>{inspection.componentId}</S.HeaderInfoValue>
            </S.HeaderInfo>

            <S.HeaderInfo>
              <h6>Posição:</h6>
              <S.CheckboxGroup>
                {[1, 2, 3, 4, 5, 6].map((pos) => (
                  <S.CheckboxItem key={pos}>
                    <input
                      type="checkbox"
                      id={`position-${pos}`}
                      checked={inspection.positionNumber.split(",").includes(pos.toString())}
                      readOnly
                    />
                    <label htmlFor={`position-${pos}`}>{pos}º</label>
                  </S.CheckboxItem>
                ))}
              </S.CheckboxGroup>
            </S.HeaderInfo>

            <S.HeaderInfo>
              <h6>Tipo de limpeza</h6>
              <S.CheckboxGroup noBorder>
                <S.CheckboxItem>
                  <input type="checkbox" checked={inspection.isSandingBrushSandblasting} readOnly />
                  <label>Lixamento/Escova/Jateado*</label>
                </S.CheckboxItem>
                <S.CheckboxItem>
                  <input type="checkbox" checked={inspection.isCleaningChemistry} readOnly />
                  <label>Limp.Quím.</label>
                </S.CheckboxItem>
              </S.CheckboxGroup>
            </S.HeaderInfo>
          </S.InspectionDetailsItem>

          <S.Separator />

          <S.InspectionDetailsItem>
            <S.HeaderInfo>
              <h6>Local de inspeção:</h6>
              <S.HeaderInfoValue>{inspection.inspectionLocation}</S.HeaderInfoValue>
            </S.HeaderInfo>

            <S.HeaderInfo>
              <h6>Inform. da Mda:</h6>
              <S.HeaderInfoValue>{inspection.mdaInformation}</S.HeaderInfoValue>
            </S.HeaderInfo>

            <S.HeaderInfo>
              <h6>Ensaios Realizados:</h6>
              <S.CheckboxGroup>
                <S.CheckboxItem>
                  <input type="checkbox" checked={inspection.isVI} readOnly />
                  <label>VI</label>
                </S.CheckboxItem>
                <S.CheckboxItem>
                  <input type="checkbox" checked={inspection.isDM} readOnly />
                  <label>DM</label>
                </S.CheckboxItem>
                <S.CheckboxItem>
                  <input type="checkbox" checked={inspection.isPM} readOnly />
                  <label>PM</label>
                </S.CheckboxItem>
                <S.CheckboxItem>
                  <input type="checkbox" checked={inspection.isUS} readOnly />
                  <label>US</label>
                </S.CheckboxItem>
                <S.CheckboxItem>
                  <input type="checkbox" checked={inspection.isLP} readOnly />
                  <label>LP</label>
                </S.CheckboxItem>
                <S.CheckboxItem>
                  <input type="checkbox" checked={inspection.isDU} readOnly />
                  <label>DU</label>
                </S.CheckboxItem>
              </S.CheckboxGroup>
            </S.HeaderInfo>

            <S.HeaderInfo>
              <h6>Instrumentos:</h6>
              <S.HeaderInfoValue noBorder>{inspection.instruments}</S.HeaderInfoValue>
            </S.HeaderInfo>
          </S.InspectionDetailsItem>
        </S.InspectionDetails>

        {/* Croqui */}
        <S.CroquiSection>
          <S.SectionTitle>CROQUI DO EQUIPAMENTO</S.SectionTitle>
          <S.CroquiImage>
            {inspection.partType?.coverUrl || (inspection.partType as any)?.croqui ? (
              <img
                src={formatBase64ForImage(
                  (inspection.partType as any)?.croqui || inspection.partType?.coverUrl,
                )}
                alt="Croqui"
              />
            ) : (
              <p>Sem croqui disponível</p>
            )}
          </S.CroquiImage>
        </S.CroquiSection>

        {/* Conclusões */}
        <S.ReportSection>
          <S.SectionTitle>2. Considerações Gerais e Conclusões</S.SectionTitle>
          <S.ReportContent
            dangerouslySetInnerHTML={{
              __html: inspection.finalConclusion || "<p>Sem conclusões registradas</p>",
            }}
          />
        </S.ReportSection>

        {/* Fotos */}
        <S.PhotoSection>
          <S.SectionTitle>3. Registro fotográfico</S.SectionTitle>
          <S.ImagesGrid>
            {inspection.attachments && inspection.attachments.length > 0 ? (
              inspection.attachments.map((attachment: any, index) => (
                <img
                  key={index}
                  src={formatBase64ForImage(attachment.url || attachment.inspectionAttachmentUrl)}
                  alt={`Registro ${index + 1}`}
                />
              ))
            ) : (
              <p>Sem registros fotográficos</p>
            )}
          </S.ImagesGrid>
        </S.PhotoSection>

        {/* Assinaturas */}
        <S.SignatureSection>
          <S.SignatureItem>
            <h6>Inspetor:</h6>
            {inspection.inspectorUser?.signature && (
              <img src={formatBase64ForImage(inspection.inspectorUser.signature)} />
            )}
          </S.SignatureItem>

          <S.Separator />

          <S.SignatureItem>
            <h6>Supervisão:</h6>
            <img src={AssinaturaLeandro} alt="Assinatura Supervisão" />
          </S.SignatureItem>

          <S.Separator />

          <S.SignatureItem>
            <h6>CLIENTE/FISCALIZAÇÃO:</h6>
          </S.SignatureItem>

          <S.Separator />

          <S.StatusItem>
            <S.StatusText status={getStatusClass(inspection.inspectionStatus?.description || "")}>
              {inspection.inspectionStatus?.description || "Em análise"}
            </S.StatusText>
          </S.StatusItem>
        </S.SignatureSection>

        {/* Footer */}
        <S.Footer>
          <h5>J. OMETTO & CIA PROTEÇÃO RADIOLÓGICA E ENGENHARIA DE MATERIAIS LTDA - ME</h5>
          <h5>CNPJ: 07.795.903/0001-55</h5>
          <p>
            Rua Cristiano Cleopath, 2084 – Bairro: Alemães – CEP: 13419-310 – Piracicaba – SP
            Telefone: (19) 3927-0881 www.jometto.com.br
          </p>
        </S.Footer>
      </S.PDFContainer>
    );
  },
);

InspectionPDFReport.displayName = "InspectionPDFReport";
