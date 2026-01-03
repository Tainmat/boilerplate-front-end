import { Skeleton } from "@shared/components/Core/Skeleton";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { ITotalizingCardData } from "@shared/hooks/services/Dashboard/useTotalizingCards";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from "chart.js";
import { Card } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { useStatusPieChartRules } from "./useStatusPieChartRules";

// Registrar componentes necessários do Chart.js
ChartJS.register(ArcElement, ChartTooltip, Legend);

interface StatusPieChartProps {
  data: ITotalizingCardData | null;
  loading: boolean;
}

export function StatusPieChart({ data, loading }: StatusPieChartProps) {
  const { processedData, pieChartOptions, pieChartData } = useStatusPieChartRules({ data });

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Subtitle size="xs" className="mb-3">
          Distribuição por Status
        </Subtitle>
        {loading ? (
          <div style={{ height: "300px" }}>
            <Skeleton />
          </div>
        ) : pieChartData && processedData && processedData.data.some((value) => value > 0) ? (
          <div style={{ height: "300px" }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
            <Paragraph size="sm">Sem dados disponíveis</Paragraph>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
