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
import { useDropdownsRedux } from "@/shared/hooks/redux/useDropdownsRedux";
import { IInspectionDetail, useInspection } from "@/shared/hooks/services/Admin/useInspection";
import { useInspections } from "@/shared/hooks/services/Admin/useInspections";
import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";
import { get, getBlob, put } from "@/shared/services/api/api.service";
import { formatDateWithUnderline } from "@/shared/utils/date";
import { removeEmptyEntries } from "@/shared/utils/generic";
import { generateMultiPagePdfFile, generatePdfFile } from "@/shared/utils/pdf";

import { ROUTE_SAVE_INSPECTION, ROUTE_UPDATE_INSPECTION } from "../../routes/Inspection.paths";
import { transformInspectionDataForPdf } from "./components/InspectionListPDFReport/inspectionPdfFields";
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
  const { customersDropdown } = useDropdownsRedux();

  // Estados locais
  const [loaded, setLoaded] = useState(false);
  const [tableMode, setTableMode] = useState<"online" | "offline">(isOnline ? "online" : "offline");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showExportPDFModal, setShowExportPDFModal] = useState(false);

  // PDF individual
  const pdfRef = useRef<HTMLDivElement>(null);
  const [inspectionToPrint, setInspectionToPrint] = useState<IInspectionDetail | null>(null);

  // PDF listagem
  const pdfListRef = useRef<HTMLDivElement>(null);
  const [pdfListData, setPdfListData] = useState<{
    data: Record<string, string>[];
    fields: string[];
    generatedAt: Date;
  } | null>(null);

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

  // Dispara geração do PDF após o componente InspectionListPDFReport renderizar no DOM
  useEffect(() => {
    if (!pdfListData) return;

    const generate = async () => {
      try {
        await generateMultiPagePdfFile(
          `Relatório_Inspeções_${formatDateWithUnderline(pdfListData.generatedAt)}`,
          pdfListRef,
        );
        addToast({
          type: "success",
          title: "Exportação concluída",
          description: "O relatório PDF foi gerado com sucesso.",
        });
      } catch {
        addToast({
          type: "warning",
          title: "Erro ao gerar PDF",
          description: "Não foi possível gerar o relatório PDF.",
        });
      } finally {
        setPdfListData(null);
        hideLoader();
      }
    };

    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfListData]);

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
            await generatePdfFile(documentTitle, pdfRef);
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

  function handleExportExcel() {
    setShowExportModal(true);
  }

  function handleExportPDF() {
    setShowExportPDFModal(true);
  }

  const handleConfirmExportPDF = async (startDate: string, endDate: string, fields: string[]) => {
    setShowExportPDFModal(false);
    showLoader();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { records, page, order, ...cleanExportParams } = params || ({} as any);
      const payload = removeEmptyEntries(cleanExportParams);

      const { data: responseBody } = await get(
        "/operational/parts-inspection/data/export-pdf-data",
        { ...payload, initialReportStartDate: startDate, finalReportStartDate: endDate },
      );

      const items = responseBody?.data ?? responseBody ?? [];
      const transformedData = transformInspectionDataForPdf(items, fields);

      setPdfListData({ data: transformedData, fields, generatedAt: new Date() });
    } catch (error: any) {
      hideLoader();

      if (error?.response?.status === 404) {
        addToast({
          type: "helper",
          title: "Sem dados",
          description:
            error.response?.data?.message || "Nenhum dado encontrado para os filtros selecionados.",
        });
      } else {
        addToast({
          type: "warning",
          title: "Erro ao exportar",
          description: "Não foi possível exportar os dados para PDF.",
        });
      }
    }
  };

  const handleConfirmExport = async (initialDate: string, finalDate: string) => {
    setShowExportModal(false);

    try {
      showLoader();

      let customerName = "Todos";
      const customerId = params?.customerId;

      if (customerId) {
        const foundCustomer = customersDropdown.find((c) => c.id === customerId);
        if (foundCustomer) {
          customerName = foundCustomer.fantasyName.replace(/\s+/g, "_");
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { records, page, order, ...cleanExportParams } = params || ({} as any);
      const payload = removeEmptyEntries(cleanExportParams);

      const blobData = await getBlob(`/operational/parts-inspection/data/export-excel`, {
        ...payload,
        initialReportStartDate: initialDate,
        finalReportStartDate: finalDate,
      });

      const url = window.URL.createObjectURL(blobData);
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute(
        "download",
        `Relatório_${customerName}_${formatDateWithUnderline(new Date())}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      addToast({
        type: "success",
        title: "Exportação concluída",
        description: "O relatório Excel foi gerado com sucesso.",
      });
    } catch (error: any) {
      if (error?.response?.status === 404) {
        const blob: Blob = error.response.data;
        const text = await blob.text();
        const parsed = JSON.parse(text);

        addToast({
          type: "helper",
          title: "Sem dados",
          description: parsed?.message || "Nenhum dado encontrado para os filtros selecionados.",
        });
      } else {
        addToast({
          type: "warning",
          title: "Erro ao exportar",
          description: "Não foi possível exportar os dados para o Excel.",
        });
      }
    } finally {
      hideLoader();
    }
  };

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
    handleExportExcel,

    // Export Excel modal
    showExportModal,
    handleCloseExportModal: () => setShowExportModal(false),
    handleConfirmExport,

    // Export PDF modal
    showExportPDFModal,
    handleCloseExportPDFModal: () => setShowExportPDFModal(false),
    handleExportPDF,
    handleConfirmExportPDF,

    // PDF listagem
    pdfListRef,
    pdfListData,
  };
}
