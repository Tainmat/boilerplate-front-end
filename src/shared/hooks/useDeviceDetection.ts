"use client";

import { useMediaQuery } from "react-responsive";

export function useDeviceDetection() {
  const isSmartphone = useMediaQuery({ minWidth: 320, maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isNotebook = useMediaQuery({ minWidth: 1024, maxWidth: 1399 });
  const isDesktop = useMediaQuery({ minWidth: 1400 });
  const isMediumScreen = useMediaQuery({ minWidth: 992, maxWidth: 1399 });
  const isSmallScreen = useMediaQuery({ maxWidth: 991 });

  let deviceDetection: "smartphone" | "tablet" | "notebook" | "desktop" = "desktop";
  if (isSmartphone) deviceDetection = "smartphone";
  else if (isTablet) deviceDetection = "tablet";
  else if (isNotebook) deviceDetection = "notebook";

  return {
    isSmartphone,
    isTablet,
    isNotebook,
    isDesktop,
    isMediumScreen,
    isSmallScreen,
    deviceDetection,
  };
}
export type DeviceDetection = ReturnType<typeof useDeviceDetection>;
export type DeviceType = "smartphone" | "tablet" | "notebook" | "desktop";
