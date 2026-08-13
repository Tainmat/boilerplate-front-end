import Logo from "@assets/images/logo-blue-vertical.svg";
import * as S from "@modules/Auth/shared/components/Layout/AuthLayout.styles";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { ReactNode } from "react";

type DeviceType = "smartphone" | "tablet" | "notebook" | "desktop";

interface Props {
  children: ReactNode;
  deviceType?: DeviceType;
}

export function AuthLayout({ children, deviceType }: Props) {
  const deviceDetection = useDeviceDetection();
  const isSmartphone = deviceType === "smartphone" || deviceDetection.isSmartphone;

  return (
    <>
      <S.MainContainer>
        <S.LoginContainer $isSmartphone={isSmartphone}>
          <S.LoginContent>
            <img src={Logo} className="logo-app" alt="Logo App" />
            {children}
          </S.LoginContent>
        </S.LoginContainer>
      </S.MainContainer>
    </>
  );
}
