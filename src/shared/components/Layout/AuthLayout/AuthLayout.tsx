import LogoLatini from "@assets/images/logo.png";
import * as S from "@modules/Auth/shared/components/Layout/AuthLayout.styles";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { ReactNode } from "react";

export type DeviceType = "smartphone" | "tablet" | "notebook" | "desktop";

interface Props {
  children: ReactNode;
  deviceType?: DeviceType;
}
