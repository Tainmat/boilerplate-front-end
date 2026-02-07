import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Table, Tbody, Td, Th, Thead, Tr } from "@shared/components/Core/Table";
import { Tag } from "@shared/components/Core/Tag";
import { Tooltip } from "@shared/components/Core/Tooltip";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";
import { Col, Row } from "react-bootstrap";

import { Icon } from "@/shared/components/Core/Icons/Icon";
import { Empty } from "@/shared/components/Core/Table/Empty";
import { LoadingLines } from "@/shared/components/Core/Table/LoadingLines";
import { Heading } from "@/shared/components/Core/Typography/Heading";
import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";
import { IOfflineInspectionCard } from "@/shared/store/modules/OfflineInspection";

import { useInspectionsRules } from "../../useInspectionsRules";
import { StorageBar } from "../StorageBar";

interface IInspectionTable
  extends Omit<IOfflineInspectionCard, "isSyncing" | "syncAttempts" | "quantityPhotos"> {
  isSyncing?: boolean;
  erroSync?: string | undefined;
  syncAttempts?: number;
  quantityPhotos?: number;
}

interface StorageBarData {
  containerRef: React.RefObject<HTMLDivElement | null>;
  usedMB: number;
  storageQuotaMB: number;
  percentage: number;
  formatSize: (mb: number) => string;
}

interface Props {
  data: IInspectionTable[] | null;
  onEdit: (id: string) => void;
  onGeneratePdf: (id: string) => void;
  handleOnChangeStatusInspection: (id: string, inStatus: boolean) => void;
  handleDeleteInspection?: (id: string) => void;
  onRetrySync?: (id: string) => void;
  offline: boolean;
  storageBarData?: StorageBarData;
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
  handleDeleteInspection,
  onGeneratePdf,
  onRetrySync,
  offline,
  storageBarData,
}: Props) {
  const { isSystemAdmin } = useAuthRoles();
  const { isInspectionChanger } = useAuthRoles();
  const { isOnline } = useInspectionsRules();

  return (
    <>
      {offline && storageBarData && (
        <Row>
          <Col className="mb-4">
            <StorageBar {...storageBarData} />
          </Col>
        </Row>
      )}
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
                    <div className="d-flex justify-content-center gap-2 align-items-center">
                      {offline && item.erroSync && isOnline && (
                        <Tooltip title="Tentar Sincronizar Novamente" place="top">
                          <ButtonIcon
                            size="sm"
                            icon="sync"
                            mode="warning"
                            onClick={() => {
                              if (onRetrySync) onRetrySync(item.id);
                            }}
                            disabled={item.isSyncing}
                          />
                        </Tooltip>
                      )}

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

                      {offline && (
                        <>
                          {handleDeleteInspection && (
                            <Tooltip title="Remover Inspeção" place="top-start">
                              <ButtonIcon
                                disabled={!item.isActive}
                                size="sm"
                                icon="delete"
                                onClick={() => handleDeleteInspection(item.id)}
                                mode="warning"
                              />
                            </Tooltip>
                          )}
                          <div
                            style={{
                              display: "flex",
                              width: "40px",
                              height: "40px",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {item.isSyncing ? (
                              <Tooltip title="Sincronizando..." place="top">
                                <div
                                  className="spinner-border spinner-border-sm text-primary"
                                  role="status"
                                  style={{ width: "40px", height: "40px" }}
                                >
                                  <span className="visually-hidden">Sincronizando...</span>
                                </div>
                              </Tooltip>
                            ) : item.erroSync ? (
                              <Tooltip
                                title={`Erro: ${item.erroSync} (${item.syncAttempts || 0} tentativas)`}
                                place="top"
                              >
                                <Icon icon="error" size="sm" mode="warning" />
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title={`Aguardando sincronização (${item.syncAttempts || 0} tentativas)`}
                                place="top"
                              >
                                <Icon icon="schedule" size="sm" mode="helper" />
                              </Tooltip>
                            )}
                          </div>
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
    </>
  );
}
