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
  switch (status) {
    case "CONCLUIDA":
      return "success";
    case "EM_ANDAMENTO":
      return "helper";
    case "CANCELADA":
      return "warning";
    default:
      return "default";
  }
}

function getPriorityColor(priority: string): "success" | "warning" | "helper" | "default" {
  switch (priority) {
    case "CRITICA":
      return "warning";
    case "ALTA":
      return "helper";
    case "MEDIA":
      return "default";
    default:
      return "success";
  }
}

export function InspectionsTable({ data, onEdit, onShowLogs }: Props) {
  return (
    <Tr>
      <Td>
        <Paragraph size="sm">{data.idInspecao}</Paragraph>
      </Td>

      <Td>
        <Paragraph size="sm" title={data.numeroInspecao}>{data.numeroInspecao}</Paragraph>
      </Td>

      <Td>
        <Paragraph size="sm" title={data.dsTipoInspecao}>{data.dsTipoInspecao}</Paragraph>
      </Td>

      <Td>
        <Paragraph size="sm" title={data.nomeCliente}>{data.nomeCliente}</Paragraph>
      </Td>

      <Td>
        <Paragraph size="sm" title={data.nomeEquipamento}>{data.nomeEquipamento}</Paragraph>
      </Td>

      <Td>
        <Paragraph size="sm" title={data.nomeInspector}>{data.nomeInspector}</Paragraph>
      </Td>

      <Td>
        <Paragraph size="sm" title={new Date(data.dataInspecao).toLocaleDateString('pt-BR')}>{new Date(data.dataInspecao).toLocaleDateString('pt-BR')}</Paragraph>
      </Td>

      <Td>
        <div className="d-flex justify-content-center">
          <Tag size="lg" status={getStatusColor(data.statusInspecao)}>
            {data.dsStatusInspecao}
          </Tag>
        </div>
      </Td>

      <Td>
        <div className="d-flex justify-content-center">
          <Tag size="lg" status={getPriorityColor(data.prioridadeInspecao)}>
            {data.dsPrioridadeInspecao}
          </Tag>
        </div>
      </Td>

      <Td>
        <div className="d-flex justify-content-center">
          <Tag size="lg" status={data.inStatusCadastroInspecao ? "success" : "warning"}>
            {data.dsStatusCadastroInspecao}
          </Tag>
        </div>
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