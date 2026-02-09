import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ROUTE_HOME } from "@/modules/Home/routes/Home.paths";
import { IOption } from "@/shared/components/Core/Form/Fields/Select/Select.interface";
import { DEFAULT_ITEMS_PER_PAGE } from "@/shared/constants/options";
import { TITLE_ADMIN_INSPECTIONS } from "@/shared/constants/title.browser";
import { useAlertContext } from "@/shared/contexts/Alert";
import { useBreadcrumbContext } from "@/shared/contexts/Layout/Breadcrumb";
import { useLoaderContext } from "@/shared/contexts/Loader";
import { useOnlineStatus } from "@/shared/contexts/OnlineStatus";
import { useToastContext } from "@/shared/contexts/Toast";
import { useOfflineInspections } from "@/shared/hooks/offline/useOfflineInspections";
import { IInspectionDetail, useInspection } from "@/shared/hooks/services/Admin/useInspection";
import { useInspections } from "@/shared/hooks/services/Admin/useInspections";
import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";
import { put } from "@/shared/services/api/api.service";

import { ROUTE_SAVE_INSPECTION, ROUTE_UPDATE_INSPECTION } from "../../routes/Inspection.paths";
import {
  IInspectionSearchForm,
  initialInspectionSearchValues,
} from "./components/InspectionSearchForm";
import { useStorageBar } from "./components/StorageBar/useStorageBar";

export function useInspectionsRules() {
  // Navegação
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Contextos
  const { isOnline, syncInspection } = useOnlineStatus();
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const { addToast, handleApiRejection } = useToastContext();
  const { showLoader, hideLoader } = useLoaderContext();
  const { addAlert } = useAlertContext();

  // Hooks de dados
  const { fetchInspection } = useInspection();
  const { result, params, setParams, refetch } = useInspections();
  const { cardsList: offlineInspections, removeInspection } = useOfflineInspections();
  const { recalculate, containerRef, usedMB, storageQuotaMB, percentage, formatSize } =
    useStorageBar();

  // Permissões
  const { isInspectionChanger } = useAuthRoles();

  // Estados locais
  const [loaded, setLoaded] = useState(false);
  const [tableMode, setTableMode] = useState<"online" | "offline">(isOnline ? "online" : "offline");

  // PDF
  const pdfRef = useRef<HTMLDivElement>(null);
  const [inspectionToPrint, setInspectionToPrint] = useState<IInspectionDetail | null>(null);

  useLayoutEffect(() => {
    document.title = TITLE_ADMIN_INSPECTIONS;

    setPageBreadcrumb([
      { text: "Home", route: ROUTE_HOME },
      { text: "Admin" },
      { text: "Cadastros" },
      { text: "Inspeções" },
    ]);

    setLoaded(true);
  }, [setPageBreadcrumb]);

  const errorsCount = useMemo(() => {
    return offlineInspections?.filter((i) => i.erroSync).length || 0;
  }, [offlineInspections]);

  const handleSearchParams = useCallback(
    (params: Record<string, any>) => {
      setSearchParams({
        q: window.btoa(JSON.stringify(params)),
      });

      setParams(params);
    },
    [setSearchParams, setParams],
  );

  useEffect(() => {
    if (params === null && loaded) {
      let params;

      if (searchParams.get("q")) {
        params = JSON.parse(window.atob(String(searchParams.get("q"))));
      } else {
        params = {
          ...initialInspectionSearchValues,
          records: DEFAULT_ITEMS_PER_PAGE,
          page: 1,
          order: "reportNumber",
        };
      }

      handleSearchParams(params);
    }
  }, [params, loaded, searchParams, handleSearchParams]);

  function handleOnSearch(data: IInspectionSearchForm) {
    if (params) {
      const { search, searchingBy, inspectionStatusId, status } = data;

      const newParams = {
        ...params,
        page: 1,
        searchingBy,
        search,
        inspectionStatusId,
        status,
      };

      handleSearchParams(newParams);
    }
  }

  function handleOnChangeItemsPerPage(records: number) {
    if (params) {
      const newParams = {
        ...params,
        page: 1,
        records,
      };

      handleSearchParams(newParams);
    }
  }

  function handleOnChangePage(page: number) {
    if (params) {
      if (params.page !== page) {
        const newParams = {
          ...params,
          page,
        };

        handleSearchParams(newParams);
      }
    }
  }

  function addNew(uuid?: string) {
    navigate(!uuid ? ROUTE_SAVE_INSPECTION : `${ROUTE_UPDATE_INSPECTION}/${uuid}`);
  }

  function updateOfflineInspection(uuid: string) {
    navigate(`${ROUTE_UPDATE_INSPECTION}/${uuid}/offline`);
  }

  const generatePdfFile = useCallback(async (fileName: string) => {
    if (!pdfRef.current) return;

    // ⛔ ESSENCIAL: espera o DOM realmente pintar
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);
  }, []);

  // const printPdf = useCallback((documentTitle: string) => {
  //   // Inject print-only CSS dynamically
  //   const style = document.createElement("style");
  //   style.id = "pdf-print-styles";
  //   style.textContent = `
  //     @media print {
  //       @page { size: A4 portrait; margin: 0; }
  //       body * { visibility: hidden !important; }
  //       .pdf-print-area, .pdf-print-area * { visibility: visible !important; }
  //       .pdf-print-area {
  //         position: fixed !important;
  //         top: 0 !important;
  //         left: 0 !important;
  //         width: 210mm !important;
  //         opacity: 1 !important;
  //         z-index: 99999 !important;
  //         overflow: visible !important;
  //       }
  //       body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  //     }
  //   `;
  //   document.head.appendChild(style);

  //   const cleanup = () => {
  //     style.remove();
  //     document.title = TITLE_ADMIN_INSPECTIONS;
  //     setInspectionToPrint(null);
  //     window.removeEventListener("afterprint", cleanup);
  //   };

  //   window.addEventListener("afterprint", cleanup);

  //   document.title = documentTitle;
  //   window.print();
  // }, []);

  async function handleGeneratePdf(inspectionId: string, documentTitle: string) {
    try {
      showLoader();
      const data = await fetchInspection(inspectionId);

      if (data) {
        setInspectionToPrint(data);
        hideLoader();

        addAlert({
          iconModal: "success",
          iconType: "success",
          buttonType: "success",
          title: "Download PDF",
          description: `Deseja fazer o download do relatório ${data.reportNumber}?`,
          cancelTxt: "Cancelar",
          confirmTxt: "Download",
          onConfirm: async () => {
            await generatePdfFile(documentTitle);
            setInspectionToPrint(null);
          },
          onCancel: () => {
            setInspectionToPrint(null);
          },
        });
      }
    } catch {
      hideLoader();
      handleApiRejection();
      addToast({
        type: "warning",
        title: "Erro ao buscar dados",
        description: "Não foi possível buscar os dados da inspeção.",
      });
    }
  }

  async function handleOnChangeStatusInspection(inspectionId: string, inStatus: boolean) {
    showLoader();

    try {
      const { data } = await put(`/operational/parts-inspection/${inspectionId}/in-status`, {
        inStatus,
      });

      if (data) {
        addToast({
          description: `A inspeção foi ${inStatus ? "ativada" : "inativada"} com sucesso.`,
          type: "success",
          title: "Sucesso",
        });
      }

      refetch();
    } catch {
      handleApiRejection();
    } finally {
      hideLoader();
    }
  }

  const handleDeleteInspection = async (inspectionId: string) => {
    addAlert({
      iconModal: "error",
      iconType: "warning",
      buttonType: "warning",
      title: "Remover inspeção",
      description:
        "Ao remover a inspeção, todos os dados serão perdidos, não será possível reverter essa ação.",
      cancelTxt: "Voltar",
      confirmTxt: "Remover inspeção",
      onConfirm: async () => {
        await removeInspection(inspectionId);
        await recalculate();
      },
    });
  };

  const handleSyncInspection = useCallback(
    async (id: string) => {
      addAlert({
        iconModal: "success",
        iconType: "success",
        buttonType: "success",
        title: "Reenviar inspeção",
        description: "Deseja reenviar inspeção para o servidor?",
        cancelTxt: "Cancelar",
        confirmTxt: "Reenviar inspeção",
        onConfirm: async () => {
          const success = await syncInspection(id);
          await recalculate();
          if (success) {
            refetch();
          }
        },
      });
    },
    [syncInspection, recalculate, addAlert, refetch],
  );

  const SEARCH_OPTIONS: IOption[] = [
    {
      value: "reportNumber",
      label: "Número do Relatório",
    },
    {
      value: "componentId",
      label: "Código do Equipamento",
    },
    {
      value: "corporateName",
      label: "Nome do Cliente",
    },
  ];

  return {
    // Estados
    loaded,
    tableMode,
    setTableMode,
    isOnline,

    // Permissões
    isInspectionChanger,

    // Constantes
    SEARCH_OPTIONS,

    // Hook inspections
    result,
    params,
    setParams,
    refetch,

    // Hook offline inspections
    offlineInspections,
    errorsCount,

    // Storage bar
    storageBarData: { containerRef, usedMB, storageQuotaMB, percentage, formatSize },

    // PDF
    pdfRef,
    inspectionToPrint,
    handleGeneratePdf,

    // Callbacks de busca/paginação
    handleOnSearch,
    handleOnChangeItemsPerPage,
    handleOnChangePage,

    // Callbacks de ações
    addNew,
    updateOfflineInspection,
    handleOnChangeStatusInspection,
    handleDeleteInspection,
    handleSyncInspection,
  };
}
