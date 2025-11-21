import styled from "styled-components";

export const PDFContainer = styled.div`
  background: white;
  font-family: Arial, Helvetica, sans-serif;
  padding: 12px 16px;
  width: 210mm;
  height: 297mm;
  max-height: 297mm;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transform: scale(0.94);

  @media print {
    width: 210mm;
    height: 297mm;
    max-height: 297mm;
    font-size: 12px;
    overflow: hidden;
    page-break-after: avoid;
  }

  * {
    box-sizing: border-box;
  }
`;

export const Section = styled.div`
  border: 1.75px solid #000;
  margin-top: 4px;
  flex-shrink: 0;

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

export const Header = styled(Section)`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  height: 104px;
  margin-top: 0;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.6rem 0.2rem;
`;

export const HeaderCenter = styled.div`
  border-left: 1.75px solid #000;
  border-right: 1.75px solid #000;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  font-weight: bold;

  h1 {
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0 0 1rem;
  gap: 0.25rem;
`;

export const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  h6 {
    font-size: 10px;
    font-weight: bold;
    margin: 0;
  }
`;

export const HeaderInfoValue = styled.div<{ noBorder?: boolean }>`
  font-size: 11px;
  color: blue;
  text-align: center;
  border-bottom: ${(props) => (props.noBorder ? "none" : "1.75px solid #000")};
  width: 90px;
  font-weight: bold;
`;

export const InspectionDetails = styled(Section)`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
`;

export const InspectionDetailsItem = styled.div`
  padding: 0.3rem 0 0.3rem 0.3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  min-height: 86px;

  ${HeaderInfoValue} {
    width: 240px;
  }
`;

export const Separator = styled.div`
  width: 1px;
  height: 100%;
  background-color: #000;
`;

export const CheckboxGroup = styled.div<{ noBorder?: boolean }>`
  display: flex;
  flex-direction: row;
  font-size: 10px;
  border-bottom: ${(props) => (props.noBorder ? "none" : "1.75px solid #000")};
  width: 280px;
  padding-right: 0.25rem;
  justify-content: space-between;
`;

export const CheckboxItem = styled.div`
  align-items: center;
  justify-content: space-between;
  display: flex;
  gap: 2px;

  input[type="checkbox"] {
    margin: 0;
  }

  label {
    font-size: 10px;
  }
`;

export const CroquiSection = styled(Section)`
  display: flex;
  flex-direction: column;
  height: 245px;
  max-height: 245px;
`;

export const SectionTitle = styled.h2`
  background-color: #dedede;
  text-align: center;
  font-weight: bold;
  font-size: 0.75rem;
  padding: 0.2rem 0;
  margin: 0;
  flex-shrink: 0;
`;

export const CroquiImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0.5rem;
  overflow: hidden;

  img {
    max-height: 215px;
    max-width: 100%;
    width: auto;
    object-fit: contain;
  }

  p {
    color: #666;
    font-style: italic;
    font-size: 11px;
  }
`;

export const ReportSection = styled(Section)`
  display: flex;
  flex-direction: column;
  height: 235px;
  max-height: 235px;

  ${SectionTitle} {
    text-align: left;
    padding: 0.2rem;
  }
`;

export const ReportContent = styled.div`
  font-size: 11px;
  padding: 0.3rem 0.4rem;
  color: blue;
  line-height: 1.3;
  flex: 1;
  overflow: hidden;

  * {
    font-size: 11px !important;
    color: blue;
    line-height: 1.3;
  }

  p {
    margin: 0.3rem 0;
  }
`;

export const PhotoSection = styled(Section)`
  display: flex;
  flex-direction: column;
  height: 265px;
  max-height: 265px;

  ${SectionTitle} {
    text-align: left;
    padding: 0.2rem;
  }
`;

export const ImagesGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex: 1;
  padding: 0.5rem;
  flex-wrap: nowrap;
  gap: 0.5rem;
  overflow: hidden;

  img {
    width: 210px;
    height: 210px;
    object-fit: cover;
    border: 1px solid #ddd;
    flex-shrink: 0;
  }

  p {
    color: #666;
    font-style: italic;
    font-size: 11px;
  }
`;

export const SignatureSection = styled(Section)`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  height: 86px;
`;

export const SignatureItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.3rem;
  gap: 0.4rem;
  align-items: start;

  h6 {
    font-size: 10px;
    font-weight: bold;
    margin: 0;
    white-space: nowrap;
  }

  img {
    max-width: 200px;
    max-height: 60px;
    object-fit: contain;
  }
`;

export const StatusItem = styled(SignatureItem)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StatusText = styled.h4<{ status: string }>`
  text-align: center;
  font-weight: bold;
  margin: 0;
  color: ${(props) => {
    if (props.status?.includes("com-restricao")) return "#f59e0b";
    if (props.status?.includes("aprovado")) return "#16a34a";
    if (props.status?.includes("nao-conforme")) return "#dc2626";
    if (props.status?.includes("em-analise")) return "#2563eb";
    return "#000";
  }};
`;

export const Footer = styled.div`
  margin-top: 4px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.2rem;
  padding: 0.5rem 0;
  flex-shrink: 0;

  h5 {
    font-weight: bold;
    font-size: 0.55rem;
    margin: 0;
  }

  p {
    font-size: 0.55rem;
    color: #333;
    margin: 0;
  }
`;
