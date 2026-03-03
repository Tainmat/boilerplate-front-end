import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePdfFile = async (
  fileName: string,
  pdfRef: React.RefObject<HTMLDivElement | null>,
  options?: {
    scale?: number;
    orientation?: "portrait" | "landscape";
    format?: "a4" | "letter";
    unit?: "mm" | "cm" | "in" | "pt";
    /**
     * Fator de escala aplicado sobre a imagem no PDF (0.1 a 1.0).
     * Use para reduzir o conteúdo quando ele está sendo cortado.
     * @default 1
     */
    pageScale?: number;
  },
) => {
  if (!pdfRef.current) return;

  // ESSENCIAL: espera o DOM realmente pintar
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const canvas = await html2canvas(pdfRef.current, {
    scale: options?.scale || 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: options?.orientation || "portrait",
    unit: "mm",
    format: options?.format || "a4",
  });

  const pageScale = options?.pageScale ?? 1;
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Calcular dimensões mantendo aspect ratio
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const imgRatio = imgWidth / imgHeight;
  const pageRatio = pdfWidth / pdfHeight;

  let finalWidth = pdfWidth * pageScale;
  let finalHeight = pdfHeight * pageScale;

  // Ajustar para caber na página mantendo proporção
  if (imgRatio > pageRatio) {
    // Imagem mais larga que a página
    finalHeight = finalWidth / imgRatio;
  } else {
    // Imagem mais alta que a página
    finalWidth = finalHeight * imgRatio;
  }

  // Centralizar na página
  const x = (pdfWidth - finalWidth) / 2;
  const y = (pdfHeight - finalHeight) / 2;

  pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
  pdf.save(`${fileName}.pdf`);
};

export const generateMultiPagePdfFile = async (
  fileName: string,
  containerRef: React.RefObject<HTMLDivElement | null>,
  options?: { scale?: number },
) => {
  if (!containerRef.current) return;

  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const pages = containerRef.current.querySelectorAll<HTMLElement>(".pdf-page");
  if (pages.length === 0) return;

  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) pdf.addPage();

    const canvas = await html2canvas(pages[i], {
      scale: options?.scale ?? 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, pdfWidth, pdfHeight);
  }

  pdf.save(`${fileName}.pdf`);
};

export const generateDashboardPdfFile = async (
  fileName: string,
  pdfRef: React.RefObject<HTMLDivElement | null>,
  options?: {
    scale?: number;
    orientation?: "portrait" | "landscape";
    format?: "a4" | "letter";
    unit?: "mm" | "cm" | "in" | "pt";
    /**
     * Fator de escala aplicado sobre a imagem no PDF (0.1 a 1.0).
     * Use para reduzir o conteúdo quando ele está sendo cortado.
     * @default 1
     */
    pageScale?: number;
  },
) => {
  if (!pdfRef.current) return;

  // ESSENCIAL: espera o DOM realmente pintar
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const canvas = await html2canvas(pdfRef.current, {
    scale: options?.scale || 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: options?.orientation || "portrait",
    unit: "mm",
    format: options?.format || "a4",
  });

  const pageScale = options?.pageScale ?? 1;
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Calcular dimensões mantendo aspect ratio
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const imgRatio = imgWidth / imgHeight;
  const pageRatio = pdfWidth / pdfHeight;

  let finalWidth = pdfWidth * pageScale;
  let finalHeight = pdfHeight * pageScale;

  // Ajustar para caber na página mantendo proporção
  if (imgRatio > pageRatio) {
    // Imagem mais larga que a página
    finalHeight = finalWidth / imgRatio;
  } else {
    // Imagem mais alta que a página
    finalWidth = finalHeight * imgRatio;
  }

  // Centralizar na página
  const x = (pdfWidth - finalWidth) / 2;
  const y = (pdfHeight - finalHeight) / 2;

  pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
  pdf.save(`${fileName}.pdf`);
};
