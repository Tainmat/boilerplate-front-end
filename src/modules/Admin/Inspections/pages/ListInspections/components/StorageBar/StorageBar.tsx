import ProgressBar from "progressbar.js";
import { useEffect, useRef, useState } from "react";

import { Heading } from "@/shared/components/Core/Typography/Heading";

import * as S from "./StorageBar.styles";

function formatSize(mb: number) {
  if (mb < 1) {
    return `${(mb * 1024).toFixed(0)} KB`;
  }
  return `${mb.toFixed(2)} MB`;
}

export function StorageBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<InstanceType<typeof ProgressBar.Line> | null>(null);
  const [usedMB, setUsedMB] = useState(0);
  const [storageQuotaMB, setStorageQuotaMB] = useState(0);
  const [percentage, setPercentage] = useState(0);

  async function getStorageQuota() {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();

      return {
        usage: estimate.usage || 0, // Bytes usados
        quota: estimate.quota || 0, // Bytes totais
        usageInMB: (estimate.usage || 0) / (1024 * 1024),
        quotaInMB: (estimate.quota || 0) / (1024 * 1024),
        percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
      };
    }

    return null;
  }

  useEffect(() => {
    async function loadStorageSize() {
      const storageQuota = await getStorageQuota();
      setUsedMB(storageQuota ? storageQuota.usageInMB : 0);
      setStorageQuotaMB(storageQuota ? storageQuota.quotaInMB : 0);
      setPercentage(storageQuota ? storageQuota.percentage : 0);

      if (!containerRef.current) return;

      barRef.current = new ProgressBar.Line(containerRef.current, {
        strokeWidth: 3,
        trailWidth: 3,
        easing: "easeInOut",
        duration: 2000,
        color: "#9bff82",
        trailColor: "#eee",
        svgStyle: { width: "100%", height: "16px", borderRadius: "8px" },
        from: { color: "#9bff82" },
        to: { color: "#ED6A5A" },
        step: (state, bar) => {
          if (bar.path) {
            bar.path.setAttribute("stroke", state.color);
          }
        },
      });

      barRef.current.animate(percentage / 100);
    }

    loadStorageSize();

    return () => {
      if (barRef.current) {
        barRef.current.destroy();
      }
    };
  }, [percentage]);

  return (
    <S.Container>
      <Heading size="sm">Armazenamento Interno</Heading>
      <S.BarContainer ref={containerRef} />
      <S.UsageText usagePercentage={percentage}>
        {formatSize(usedMB)} / {formatSize(storageQuotaMB)}
      </S.UsageText>
    </S.Container>
  );
}
