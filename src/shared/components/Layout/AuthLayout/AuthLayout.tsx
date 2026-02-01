import { ReactNode } from "react";

export type DeviceType = "smartphone" | "tablet" | "notebook" | "desktop";

interface Props {
  children: ReactNode;
  deviceType?: DeviceType;
}

export { Props as AuthLayoutProps };
