import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Td, Tr } from "@shared/components/Core/Table";
import { Tag } from "@shared/components/Core/Tag";
import { Tooltip } from "@shared/components/Core/Tooltip";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";

import { IInspection } from "@/shared/hooks/services/Admin/useInspections";

interface Props {
  data: IInspection;
  onEdit: () => void;
  onShowLogs?: () => void;
}

function getStatusColor(status: string): "success" | "warning" | "helper" | "default" {
  switch (status.toLowerCase()) {
    case "aprovado":
      return "success";
    case "em análise":
    case "em andamento":
      return "helper";
    case "rejeitado":
    case "cancelado":
      return "warning";
    default:
      return "default";
  }
}

export function InspectionsTable({ data, onEdit, onShowLogs }: Props) {
  return (
    <Tr>
      <Td className="d-none d-lg-table-cell">
        <Paragraph size="sm">{data.id.slice(-8)}</Paragraph>
      </Td>

      <Td>
        <div>
          <Paragraph size="sm" title={data.reportNumber}>{data.reportNumber}</Paragraph>
          <div className="d-sm-none">
            <small className="text-muted d-block">
              Rev: {data.revisionNumber} | {data.customer.fantasyName || data.customer.corporateName}
            </small>
            <small className="text-muted">
              Inspetor: {data.inspectorUser.name}
            </small>
          </div>
        </div>
      </Td>

      <Td className="d-none d-md-table-cell">
        <Paragraph size="sm" title={data.revisionNumber}>{data.revisionNumber}</Paragraph>
      </Td>

      <Td className="d-none d-sm-table-cell">
        <Paragraph size="sm" title={data.customer.fantasyName || data.customer.corporateName}>
          {data.customer.fantasyName || data.customer.corporateName}
        </Paragraph>
      </Td>

      <Td>
        <div className="d-flex justify-content-center">
          <Tag size="lg" status={getStatusColor(data.inspectionStatus.description)}>
            <span className="d-none d-sm-inline">{data.inspectionStatus.description}</span>
            <span className="d-inline d-sm-none">
              {data.inspectionStatus.description.length > 8 
                ? data.inspectionStatus.description.substring(0, 8) + '...' 
                : data.inspectionStatus.description}
            </span>
          </Tag>
        </div>
      </Td>

      <Td className="d-none d-lg-table-cell">
        <Paragraph size="sm" title={data.inspectorUser.name}>{data.inspectorUser.name}</Paragraph>
      </Td>

      <Td>
        <div className="d-flex justify-content-center">
          <Tooltip title="Editar" place="top-start">
            <ButtonIcon size="sm" icon="edit" onClick={() => onEdit()} />
          </Tooltip>

          {/* <Tooltip title="Visualizar Logs" place="top-start">
            <ButtonIcon size="sm" icon="open_in_new" onClick={() => onShowLogs()} />
          </Tooltip> */}
        </div>
      </Td>
    </Tr>
  );
}