import * as S from "@shared/components/Layout/Content/Content.styles";
import { useSideMenuOpenContext } from "@shared/components/Layout/contexts/SideMenuOpen/SideMenuOpen";
import { useContentContext } from "@shared/contexts/Layout/Content";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

export function Content({ children }: Props) {
  const { hover, closeMenu } = useSideMenuOpenContext();
  const { visible } = useContentContext();
  const { isSmartphone, isTablet } = useDeviceDetection();
  const [, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      // Auto-close menu on small screens when resizing
      if (window.innerWidth < 1024 && hover) {
        closeMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hover, closeMenu]);

  if (!visible) return null;

  // Determine if sidebar should be shown as open based on screen size and hover state
  const showSidebarOpen = hover && !isSmartphone && !isTablet;

  return <S.Container $sideMenuIsOpen={showSidebarOpen}>{children}</S.Container>;
}
