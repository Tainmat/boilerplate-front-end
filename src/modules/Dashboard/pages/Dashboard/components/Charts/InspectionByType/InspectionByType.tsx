import { Skeleton } from "@/shared/components/Core/Skeleton";
import { Paragraph } from "@/shared/components/Core/Typography/Paragraph";
import { Subtitle } from "@/shared/components/Core/Typography/Subtitle";
import { IInspectionPartType } from "@/shared/hooks/services/Dashboard/useInspectionPartType";
import { Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { useInspectionByTypeRules } from "./useInspectionByTypeRules";

interface Props {
  data: IInspectionPartType[] | null;
  loading: boolean;
}

export function InspectionByType({ data, loading }: Props) {
  const { barChartOptions, barChartData } = useInspectionByTypeRules({ data });

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Subtitle size="xs" className="mb-3">
          Inspeções por Tipo
        </Subtitle>
        {loading ? (
          <div style={{ height: "300px" }}>
            <Skeleton />
          </div>
        ) : barChartData ? (
          <div style={{ height: "300px" }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Paragraph size="sm">Sem dados disponíveis</Paragraph>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
