import { ButtonIcon } from "@shared/components/Core/Buttons/ButtonIcon";
import { Td, Tr } from "@shared/components/Core/Table";
import { Tag } from "@shared/components/Core/Tag";
import { Tooltip } from "@shared/components/Core/Tooltip";
import { Paragraph } from "@shared/components/Core/Typography/Paragraph";

import { IInspection } from "@/shared/hooks/services/Admin/useInspections";
import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";

interface Props {
  data: IInspection;
  onEdit: () => void;
  onGeneratePdf: () => void;
  handleOnChangeStatusInspection: () => void;
}

function getStatusColor(status: string): "success" | "warning" | "helper" | "default" {
  switch (status.toLowerCase()) {
    case "aprovado":
      return "success";
    case "com restrição":
      return "default"; // azul
    case "não conforme":
      return "warning"; // vermelho
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

export function InspectionsTable({
  data,
  onEdit,
  handleOnChangeStatusInspection,
  onGeneratePdf,
}: Props) {
  const { isSystemAdmin } = useAuthRoles();

  return (
    <Tr>
      <Td>
        <div>
          <Paragraph size="sm" title={data.reportNumber}>
            {data.reportNumber}
          </Paragraph>
          <div className="d-sm-none">
            <small className="text-muted d-block">
              Rev: {data.revisionNumber} |{" "}
              {data.customer.fantasyName || data.customer.corporateName}
            </small>
            <small className="text-muted">Inspetor: {data.inspectorUser.name}</small>
          </div>
        </div>
      </Td>

      <Td className="d-none d-md-table-cell">
        <Paragraph size="sm" title={data.revisionNumber}>
          {data.revisionNumber}
        </Paragraph>
      </Td>

      <Td className="d-none d-sm-table-cell">
        <Paragraph size="sm" title={data.customer.fantasyName || data.customer.corporateName}>
          {data.customer.fantasyName || data.customer.corporateName}
        </Paragraph>
      </Td>

      <Td>
        <div className="d-flex justify-content-center">
          <Tag size="lg" status={getStatusColor(data.inspectionStatus.description)}>
            {data.inspectionStatus.description}
          </Tag>
        </div>
      </Td>

      <Td className="d-none d-lg-table-cell">
        <Paragraph size="sm" title={data.inspectorUser.name}>
          {data.inspectorUser.name}
        </Paragraph>
      </Td>

      <Td>
        <div className="d-flex justify-content-center gap-2">
          <Tooltip title="Editar" place="top-start">
            <ButtonIcon disabled={!data.isActive} size="sm" icon="edit" onClick={() => onEdit()} />
          </Tooltip>

          <Tooltip title="Gerar PDF" place="top-start">
            <ButtonIcon
              disabled={!data.isActive}
              size="sm"
              icon="picture_as_pdf"
              onClick={() => onGeneratePdf()}
            />
          </Tooltip>

          <Tooltip title={data.isActive ? "Desativar" : "Ativar"} place="top-start">
            <ButtonIcon
              disabled={!isSystemAdmin()}
              size="sm"
              icon={data.isActive ? "toggle_on" : "toggle_off"}
              mode={data.isActive ? "success" : "warning"}
              onClick={() => handleOnChangeStatusInspection()}
            />
          </Tooltip>
        </div>
      </Td>
    </Tr>
  );
}
