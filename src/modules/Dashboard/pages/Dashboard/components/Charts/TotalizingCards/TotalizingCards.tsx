import { Icon } from "@/shared/components/Core/Icons/Icon";
import { Skeleton } from "@/shared/components/Core/Skeleton";
import { Heading } from "@/shared/components/Core/Typography/Heading";
import { Subtitle } from "@/shared/components/Core/Typography/Subtitle";
import { IDashboardParams } from "@/shared/hooks/services/Dashboard/useDashboard";
import { Card, Col, Row } from "react-bootstrap";
import { useTotalizingCardRules } from "./useTotalizingCardRules";

interface Props {
  params: IDashboardParams | null;
}

export function TotalizingCards({ params }: Props) {
  const { isSmartphone, data, loading } = useTotalizingCardRules({ params });

  return (
    <Row className="mb-4 g-3 d-flex justify-content-center">
      {data?.map((card, index) => (
        <Col
          key={index}
          className="d-flex justify-content-center"
          style={{
            flex: "1 1 0",
            minWidth: isSmartphone ? "100%" : "200px",
            maxWidth: isSmartphone ? "100%" : "240px",
          }}
        >
          <Card className="w-100 shadow-sm" style={{ minHeight: "140px" }}>
            <Card.Body className="d-flex flex-column justify-content-between text-center">
              {loading ? (
                <Skeleton />
              ) : (
                <>
                  <Subtitle size="xs" color="primary" className="mb-2">
                    {card.title}
                  </Subtitle>
                  <div className="mb-2">
                    <Heading size="md">
                      {card.title === "Taxa de Aprovação" ? `${card.value}%` : card.value}
                    </Heading>
                  </div>
                  <div className="d-flex justify-content-center">
                    <Icon icon={card.icon} size="md" mode={card.status} />
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
