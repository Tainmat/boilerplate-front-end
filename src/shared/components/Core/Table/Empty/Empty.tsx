import { EmptyResult } from "@shared/components/Core/EmptyResult";
import { Td, Tr } from "@shared/components/Core/Table";

interface Props {
  columns: number;
}

export function Empty({ columns }: Props) {
  return (
    <Tr>
      <Td colSpan={columns}>
        <EmptyResult />
      </Td>
    </Tr>
  );
}
