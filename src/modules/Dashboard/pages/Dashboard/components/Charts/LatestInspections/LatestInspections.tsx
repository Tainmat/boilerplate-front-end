import { useEffect } from "react";
import { Card } from "react-bootstrap";

import { ROUTE_LIST_INSPECTIONS } from "@/modules/Admin/Inspections/routes/Inspection.paths";
import { ButtonLink } from "@/shared/components/Core/Buttons/ButtonLink";
import { Skeleton } from "@/shared/components/Core/Skeleton";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/shared/components/Core/Table";
import { Tag } from "@/shared/components/Core/Tag";
import { Heading } from "@/shared/components/Core/Typography/Heading";
import { Paragraph } from "@/shared/components/Core/Typography/Paragraph";
import { Subtitle } from "@/shared/components/Core/Typography/Subtitle";

import { IDashboardParams } from "../../../useDashboardRules";
import { useLatestInspectionsRules } from "./useLatestInspectionsRules";

interface Props {
  params: IDashboardParams | null;
  onRefetchReady?: (refetch: () => void) => void;
}

export function LatestInspections({ params, onRefetchReady }: Props) {
  const {
    isSmartphone,
    getStatusColor,
    result: dashboardData,
    loading,
    refetch,
  } = useLatestInspectionsRules({ params });

  useEffect(() => {
    if (onRefetchReady && refetch) {
      onRefetchReady(refetch);
    }
  }, [onRefetchReady, refetch]);

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Subtitle size="xs" className="mb-3">
          Últimas Inspeções
        </Subtitle>

        <div className="table-responsive">
          <Table $responsive $hover $bordered>
            <Thead>
              <Tr>
                <Th style={{ width: "10%" }}>
                  <Heading size="xs">Nº Relatório</Heading>
                </Th>
                <Th style={{ width: "10%" }} hideOnMobile={isSmartphone}>
                  <Heading size="xs">Data</Heading>
                </Th>
                <Th hideOnMobile={isSmartphone}>
                  <Heading size="xs">Cliente</Heading>
                </Th>
                <Th>
                  <Heading size="xs">Tipo Peça</Heading>
                </Th>
                <Th style={{ width: "25%" }}>
                  <Heading size="xs">Componente</Heading>
                </Th>
                <Th>
                  <div className="d-flex justify-content-center">
                    <Heading size="xs">Status</Heading>
                  </div>
                </Th>
                <Th hideOnMobile={isSmartphone}>
                  <Heading size="xs">Inspetor</Heading>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Tr key={index}>
                      <Td colSpan={7}>
                        <Skeleton />
                      </Td>
                    </Tr>
                  ))
              ) : dashboardData && dashboardData.data.length > 0 ? (
                <>
                  {dashboardData?.data.map((inspecao, index) => (
                    <Tr key={index} expandable={isSmartphone}>
                      <Td>
                        <Paragraph size="sm">{inspecao.reportNumber}</Paragraph>
                      </Td>
                      <Td hideOnMobile={isSmartphone}>
                        <Paragraph size="sm">
                          {new Date(inspecao.reportStartDate).toLocaleDateString("pt-BR")}
                        </Paragraph>
                      </Td>
                      <Td hideOnMobile={isSmartphone}>
                        <Paragraph size="sm">{inspecao.customer.fantasyName}</Paragraph>
                      </Td>
                      <Td>
                        <Paragraph size="sm">{inspecao.partType.name}</Paragraph>
                      </Td>
                      <Td>
                        <Paragraph size="sm">{inspecao.componentId}</Paragraph>
                      </Td>
                      <Td>
                        <div className="d-flex justify-content-center">
                          <Tag
                            size="sm"
                            status={getStatusColor(inspecao.inspectionStatus.description)}
                          >
                            {inspecao.inspectionStatus.description}
                          </Tag>
                        </div>
                      </Td>
                      <Td hideOnMobile={isSmartphone}>
                        <Paragraph size="sm">{inspecao.inspectorUser.name}</Paragraph>
                      </Td>
                    </Tr>
                  ))}

                  <Tr>
                    <Td colSpan={6}>
                      <div className="d-flex justify-content-center">
                        <ButtonLink route={ROUTE_LIST_INSPECTIONS} mode="dark" size="sm">
                          Ver Mais
                        </ButtonLink>
                      </div>
                    </Td>
                  </Tr>
                </>
              ) : (
                <Tr>
                  <Td colSpan={6}>
                    <div className="text-center py-4">
                      <Paragraph size="sm">Nenhuma inspeção encontrada</Paragraph>
                    </div>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}
