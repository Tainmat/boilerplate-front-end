import LogoLatini from "@assets/images/logo.png";
import * as S from "@modules/Auth/shared/components/Layout/AuthLayout.styles";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { ReactNode } from "react";

export type DeviceType = "smartphone" | "tablet" | "notebook" | "desktop";

interface Props {
  children: ReactNode;
  deviceType?: DeviceType;
}

export function AuthLayout({ children, deviceType }: Props) {
  const deviceDetection = useDeviceDetection();
  const isSmartphone = deviceType === "smartphone" || deviceDetection.isSmartphone;
  const isTablet = deviceType === "tablet" || deviceDetection.isTablet;

  return (
    <>
      <S.MainContainer>
        <S.LoginContainer $isSmartphone={isSmartphone}>
          <S.LoginContent>
            <img src={LogoLatini} className="logo-usincheck" alt="Logo UsinCheck" />
            {children}
          </S.LoginContent>
        </S.LoginContainer>
      </S.MainContainer>
    </>
  );
}