import ProgressBar from "progressbar.js";
import { useCallback, useEffect, useRef, useState } from "react";

import { getStorageSize } from "@/shared/services/indexedDB/inspectionsDB";

const STORAGE_LIMIT_MB = 10;

export function useStorageBar() {
  function formatSize(mb: number) {
    if (mb < 1) {
      return `${(mb * 1024).toFixed(0)} KB`;
    }
    return `${mb.toFixed(2)} MB`;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<InstanceType<typeof ProgressBar.Line> | null>(null);
  const [usedMB, setUsedMB] = useState(0);
  const [storageQuotaMB] = useState(STORAGE_LIMIT_MB);
  const [percentage, setPercentage] = useState(0);

  const recalculate = useCallback(async () => {
    const used = await getStorageSize();
    const newPercentage = Math.min((used / STORAGE_LIMIT_MB) * 100, 100);

    setUsedMB(used);
    setPercentage(newPercentage);

    if (barRef.current) {
      barRef.current.animate(newPercentage / 100);
    }
  }, []);

  useEffect(() => {
    async function loadStorageSize() {
      const used = await getStorageSize();
      const newPercentage = Math.min((used / STORAGE_LIMIT_MB) * 100, 100);

      setUsedMB(used);
      setPercentage(newPercentage);

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

  return {
    formatSize,
    containerRef,
    usedMB,
    storageQuotaMB,
    percentage,
    recalculate,
  };
}
