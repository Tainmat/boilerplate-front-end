import { Col, Row } from "react-bootstrap";

import { Card } from "@/shared/components/Core/Card";
import { Caption } from "@/shared/components/Core/Typography/Caption";
import { Heading } from "@/shared/components/Core/Typography/Heading";
import { IOfflineInspectionCard } from "@/shared/store/modules/OfflineInspection";

interface InspectionCardProps {
  inspection: Omit<IOfflineInspectionCard, "isSyncing" | "syncAttempts" | "quantityPhotos"> & {
    isSyncing?: boolean;
    erroSync?: string | undefined;
    syncAttempts?: number;
    quantityPhotos?: number;
  };
}

export function InspectionCard({ inspection }: InspectionCardProps) {
  return (
    <Card>
      <Row>
        <Col className="d-flex flex-row align-items-baseline gap-2">
          <Heading size="xs">Cliente: </Heading>
          <Caption size="lg">{inspection.customer.fantasyName}</Caption>
        </Col>
      </Row>
    </Card>
  );
}
