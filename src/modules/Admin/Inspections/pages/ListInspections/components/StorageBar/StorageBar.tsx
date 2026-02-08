import { Heading } from "@/shared/components/Core/Typography/Heading";

import * as S from "./StorageBar.styles";

interface StorageBarProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  usedMB: number;
  storageQuotaMB: number;
  percentage: number;
  formatSize: (mb: number) => string;
}

export function StorageBar({
  containerRef,
  usedMB,
  storageQuotaMB,
  percentage,
  formatSize,
}: StorageBarProps) {
  return (
    <S.Container>
      <Heading size="sm">Armazenamento Interno</Heading>
      <S.BarContainer ref={containerRef} />
      <S.UsageText usagePercentage={percentage}>
        {formatSize(usedMB)} / {formatSize(storageQuotaMB)} - {percentage.toFixed(2)}%
      </S.UsageText>
    </S.Container>
  );
}
