import { createContext, ReactNode, useCallback, useContext, useMemo, useState, useEffect } from "react";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { useMediaQuery } from "react-responsive";

interface SideMenuOpenContextData {
  hover: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void; 
}

const Context = createContext<SideMenuOpenContextData>({} as SideMenuOpenContextData);

interface Props {
  children: ReactNode;
}

function SideMenuOpenContext({ children }: Props) {
  const { isSmartphone, isTablet, isDesktop } = useDeviceDetection();
  const isLargeScreen = useMediaQuery({ minWidth: 1200 });
  const [hover, setHover] = useState(isDesktop && !isSmartphone && !isTablet);

  // Adjust menu state based on device type
  useEffect(() => {
    if (isSmartphone || isTablet) {
      // On mobile and tablet, menu should be closed by default
      setHover(false);
    } else if (isDesktop) {
      // On desktop, open by default only on large screens
      setHover(isLargeScreen);
    }
  }, [isSmartphone, isTablet, isDesktop, isLargeScreen]);

  const openMenu = useCallback(() => {
    setHover(true);
  }, []);

  const closeMenu = useCallback(() => {
    setHover(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setHover(prev => !prev);
  }, []);

  const providerValue = useMemo(
    () => ({ hover, openMenu, closeMenu, toggleMenu }),
    [hover, openMenu, closeMenu, toggleMenu],
  );

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

function useSideMenuOpenContext(): SideMenuOpenContextData {
  return useContext(Context);
}

export { SideMenuOpenContext, useSideMenuOpenContext };