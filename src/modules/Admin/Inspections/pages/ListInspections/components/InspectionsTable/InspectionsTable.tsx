import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Table, Tbody, Td, Th, Thead, Tr } from "@shared/components/Core/Table";
import { Tag } from "@shared/components/Core/Tag";
import { Tooltip } from "@shared/components/Core/Tooltip";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";

import { Empty } from "@/shared/components/Core/Table/Empty";
import { LoadingLines } from "@/shared/components/Core/Table/LoadingLines";
import { Heading } from "@/shared/components/Core/Typography/Heading";
import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";
import { IOfflineInspectionCard } from "@/shared/store/modules/OfflineInspection";

interface IInspectionTable
  extends Omit<IOfflineInspectionCard, "isSyncing" | "syncAttempts" | "quantityPhotos"> {
  isSyncing?: boolean;
  erroSync?: string | undefined;
  syncAttempts?: number;
  quantityPhotos?: number;
}

interface Props {
  data: IInspectionTable[] | null;
  onEdit: (id: string) => void;
  onGeneratePdf: (id: string) => void;
  handleOnChangeStatusInspection: (id: string, inStatus: boolean) => void;
  offline: boolean;
}

function getStatusColor(
  status: string,
): "success" | "warning" | "helper" | "default" | "brand-secondary-pure" {
  switch (status.toLowerCase()) {
    case "aprovado":
      return "success";
    case "com restrição":
      return "helper"; // azul
    case "não conforme":
      return "warning"; // vermelho
    case "em análise":
    case "em andamento":
      return "brand-secondary-pure";
    case "rejeitado":
    case "cancelado":
      return "warning";
    default:
      return "default";
  }
}

export function InspectionsTable({
  data,
  onEdit,
  handleOnChangeStatusInspection,
  onGeneratePdf,
  offline,
}: Props) {
  const { isSystemAdmin } = useAuthRoles();
  const { isInspectionChanger } = useAuthRoles();

  return (
    <Table $bordered $isLoading={data === null} $hover={!!data?.length} $responsive>
      <Thead>
        <Tr>
          <Th>
            <Heading size="xs">Nº Relatório</Heading>
          </Th>

          <Th className="d-none d-md-table-cell">
            <Heading size="xs">Revisão</Heading>
          </Th>

          <Th className="d-none d-sm-table-cell">
            <Heading size="xs">Cliente</Heading>
          </Th>

          <Th>
            <div className="d-flex justify-content-center">
              <Heading size="xs">Status</Heading>
            </div>
          </Th>

          <Th className="d-none d-lg-table-cell">
            <Heading size="xs">Inspetor</Heading>
          </Th>

          <Th>
            <div className="d-flex justify-content-center">
              <Heading size="xs">Ações</Heading>
            </div>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {data ? (
          data.length > 0 ? (
            data.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <div>
                    <Paragraph size="sm" title={item.reportNumber}>
                      {item.reportNumber}
                    </Paragraph>
                    <div className="d-sm-none">
                      <small className="text-muted d-block">
                        Rev: {item.revisionNumber} |{" "}
                        {item.customer.fantasyName || item.customer.corporateName}
                      </small>
                      <small className="text-muted">Inspetor: {item.inspectorUser.name}</small>
                    </div>
                  </div>
                </Td>

                <Td className="d-none d-md-table-cell">
                  <Paragraph size="sm" title={item.revisionNumber}>
                    {item.revisionNumber}
                  </Paragraph>
                </Td>

                <Td className="d-none d-sm-table-cell">
                  <Paragraph
                    size="sm"
                    title={item.customer.fantasyName || item.customer.corporateName}
                  >
                    {item.customer.fantasyName || item.customer.corporateName}
                  </Paragraph>
                </Td>

                <Td>
                  <div className="d-flex justify-content-center">
                    <Tag size="lg" status={getStatusColor(item.inspectionStatus.description)}>
                      {item.inspectionStatus.description}
                    </Tag>
                  </div>
                </Td>

                <Td className="d-none d-lg-table-cell">
                  <Paragraph size="sm" title={item.inspectorUser.name}>
                    {item.inspectorUser.name}
                  </Paragraph>
                </Td>

                <Td>
                  <div className="d-flex justify-content-center gap-2">
                    <Tooltip
                      title={isInspectionChanger() ? "Editar" : "Visualizar"}
                      place="top-start"
                    >
                      <ButtonIcon
                        disabled={!item.isActive}
                        size="sm"
                        icon={isInspectionChanger() ? "edit" : "open_in_new"}
                        onClick={() => onEdit(item.id)}
                      />
                    </Tooltip>

                    {!offline && (
                      <>
                        <Tooltip title="Gerar PDF" place="top-start">
                          <ButtonIcon
                            disabled={!item.isActive}
                            size="sm"
                            icon="picture_as_pdf"
                            onClick={() => onGeneratePdf(item.id)}
                          />
                        </Tooltip>

                        <Tooltip title={item.isActive ? "Desativar" : "Ativar"} place="top-start">
                          <ButtonIcon
                            disabled={!isSystemAdmin()}
                            size="sm"
                            icon={item.isActive ? "toggle_on" : "toggle_off"}
                            mode={item.isActive ? "success" : "warning"}
                            onClick={() => handleOnChangeStatusInspection(item.id, item.isActive)}
                          />
                        </Tooltip>
                      </>
                    )}
                  </div>
                </Td>
              </Tr>
            ))
          ) : (
            <Empty columns={6} />
          )
        ) : (
          <LoadingLines lines={10} columns={6} />
        )}
      </Tbody>
    </Table>
  );
}
