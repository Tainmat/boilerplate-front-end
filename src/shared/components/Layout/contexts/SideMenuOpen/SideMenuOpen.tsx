import { createContext, ReactNode, useContext, useState, useEffect, useCallback } from "react";

interface SideMenuOpenContextData {
  hover: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void; 
  isMenuAlwaysVisible: boolean;
  shouldShowOverlay: boolean;
  isSmartphone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const Context = createContext<SideMenuOpenContextData>({} as SideMenuOpenContextData);

interface Props {
  children: ReactNode;
}

function SideMenuOpenContext({ children }: Props) {
  const [hover, setHover] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determinar comportamento baseado na resolução usando window width
  const isSmartphone = windowWidth <= 767;
  const isTablet = windowWidth >= 768 && windowWidth <= 1023;
  const isDesktop = windowWidth >= 1024;
  
  // Now menu is always overlay, so these properties change
  const isMenuAlwaysVisible = false; // Menu is never always visible, always overlay
  const shouldShowOverlay = true; // Always show overlay when menu is open
  
  // Configurar estado inicial APENAS na primeira renderização
  useEffect(() => {
    // Menu always starts closed since it's now always overlay mode
    setHover(false);
  }, []); // Array vazio - roda apenas uma vez

  const openMenu = useCallback(() => {
    setHover(true);
  }, []);

  const closeMenu = useCallback(() => {
    setHover(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setHover(prev => !prev);
  }, []);

  // Criar o value do provider
  const providerValue = { 
    hover, 
    openMenu, 
    closeMenu, 
    toggleMenu,
    isMenuAlwaysVisible,
    shouldShowOverlay,
    isSmartphone,
    isTablet,
    isDesktop
  };

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

function useSideMenuOpenContext(): SideMenuOpenContextData {
  return useContext(Context);
}

export { SideMenuOpenContext, useSideMenuOpenContext };