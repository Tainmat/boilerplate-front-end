import { useOfflineInspections } from "@/shared/hooks/offline/useOfflineInspections";

export function TestOffline() {
  const { addNewInspection, cardsList, loadCards } = useOfflineInspections();

  const handleTest = async () => {
    try {
      await addNewInspection({
        reportNumber: "TEST-001",
        customerId: "customer-1",
        partTypeId: "part-1",
        componentId: "ABC123",
        finalConclusion: "2025-01-01",
        inspectionLocation: "Usina",
        inspectionStatusId: "123",
        inspectorUserId: "123",
        instruments: "Trena",
        isActive: true,
        isCleaningChemistry: false,
        isDM: false,
        isDU: false,
        isLP: false,
        isPM: false,
        isSandingBrushSandblasting: false,
        isUS: true,
        isVI: true,
        mdaInformation: "Teste",
        positionNumber: "1,3",
        reportEndDate: "2025-01-01",
        reportStartDate: "2025-01-01",
        revisionNumber: "123",
        selectedPositions: [1, 3],
        sheetNumber: "af123",
      });

      console.log("✅ Inspeção teste criada!");
      await loadCards();
      console.log("Cards:", cardsList);
    } catch (error) {
      console.error("❌ Erro no teste:", error);
    }
  };

  return (
    <div>
      <h1>Teste Offline</h1>
      <button onClick={handleTest}>Criar Inspeção Teste</button>
      <p>Total de cards: {cardsList.length}</p>
    </div>
  );
}
