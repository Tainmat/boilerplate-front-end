import { Skeleton } from "@shared/components/Core/Skeleton";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { Subtitle } from "@shared/components/Core/Typography/Subtitle";
import { ITemporalEvolutionData } from "@shared/hooks/services/Dashboard/useTemporalEvolution";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip as ChartTooltip,
} from "chart.js";
import { Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";

import { useTemporalEvolutionChartRules } from "./useTemporalEvolutionChartRules";

// Registrar componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler,
);

interface TemporalEvolutionChartProps {
  data: ITemporalEvolutionData[] | null;
  loading: boolean;
}

export function TemporalEvolutionChart({ data, loading }: TemporalEvolutionChartProps) {
  const { areaChartOptions, areaChartData } = useTemporalEvolutionChartRules({ data });

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Subtitle size="xs" className="mb-3">
          Comparativo: Aprovadas vs. Com Restrição vs. Não Conforme
        </Subtitle>
        {loading ? (
          <div style={{ height: "300px" }}>
            <Skeleton />
          </div>
        ) : areaChartData ? (
          <div style={{ height: "300px" }}>
            <Line data={areaChartData} options={areaChartOptions} />
          </div>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "300px" }}
          >
            <Paragraph size="sm">Sem dados disponíveis</Paragraph>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
