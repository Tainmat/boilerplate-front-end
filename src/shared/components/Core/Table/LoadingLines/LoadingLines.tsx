import { Skeleton } from "@shared/components/Core/Skeleton";
import { Td, Tr } from "@shared/components/Core/Table";
import { v4 } from "uuid";

interface Props {
  lines: number;
  columns: number;
}

export function LoadingLines({ lines, columns }: Props) {
  return (
    <>
      {Array.from({ length: lines }).map(() => (
        <Tr key={v4()}>
          {Array.from({ length: columns }).map(() => (
            <Td key={v4()}>
              <Skeleton />
            </Td>
          ))}
        </Tr>
      ))}
    </>
  );
}
