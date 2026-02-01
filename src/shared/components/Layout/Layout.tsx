import { Content } from "@shared/components/Layout/Content";
import { SideMenuOpenContext } from "@shared/components/Layout/contexts/SideMenuOpen";
import { SideMenu } from "@shared/components/Layout/SideMenu";
import { useAuthContext } from "@shared/contexts/Auth";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { ReactNode, useEffect } from "react";

import { Header } from "./Header";
import * as S from "./Layout.styles";

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const { user } = useAuthContext();
  const { isSmartphone, isTablet } = useDeviceDetection();

  // Add responsive class to body
  useEffect(() => {
    const body = document.body;

    if (isSmartphone) {
      body.classList.add("is-smartphone");
      body.classList.remove("is-tablet", "is-desktop");
    } else if (isTablet) {
      body.classList.add("is-tablet");
      body.classList.remove("is-smartphone", "is-desktop");
    } else {
      body.classList.add("is-desktop");
      body.classList.remove("is-smartphone", "is-tablet");
    }

    return () => {
      body.classList.remove("is-smartphone", "is-tablet", "is-desktop");
    };
  }, [isSmartphone, isTablet]);

  return (
    <>
      {user ? (
        <SideMenuOpenContext>
          <S.Container>
            <Header />

            <SideMenu />

            <Content>{children}</Content>
          </S.Container>
        </SideMenuOpenContext>
      ) : (
        <S.Container>{children}</S.Container>
      )}

      <S.Background />
    </>
  );
}
