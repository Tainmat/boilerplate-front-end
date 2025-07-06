import { Icon } from "@shared/components/Core/Icons/Icon";
import { useSideMenuOpenContext } from "@shared/components/Layout/contexts/SideMenuOpen/SideMenuOpen";

import { nav } from "@shared/components/Layout/SideMenu/SideMenu.navigation";
import * as S from "@shared/components/Layout/SideMenu/SideMenu.Styles";
import { useSideMenuContext } from "@shared/contexts/Layout/SideMenu";
import { Link, useLocation } from "react-router-dom";
import { useAuthRoles } from "@shared/hooks/services/Rules/Auth/useRoles";
import { useState, useEffect } from "react";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";

// Filter navigation items based on device type
const filterNavItems = (items: any[], isMobile: boolean) => {
  if (!isMobile) return items;
  return items.filter(item => item.mobileVisible !== false);
};

export function SideMenu() {
  const location = useLocation(); 
  const { visible } = useSideMenuContext();
  const { hover, closeMenu } = useSideMenuOpenContext();
  const { isSmartphone, isTablet } = useDeviceDetection();
  const { checkIfUserHasRole } = useAuthRoles();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Filter navigation items for mobile
  const filteredNav = filterNavItems(nav, isSmartphone);

  // Close menu when clicking on mobile overlay
  const handleOverlayClick = () => {
    if (isSmartphone || isTablet) {
      closeMenu();
    }
  };

  // Close menu when route changes on mobile
  useEffect(() => {
    if ((isSmartphone || isTablet) && hover) {
      closeMenu();
    }
  }, [location.pathname, isSmartphone, isTablet, hover, closeMenu]);

  if (!visible) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <S.MobileOverlay $visible={(isSmartphone || isTablet) && hover} onClick={handleOverlayClick} />
      
      <S.Container $hover={hover} $isMobile={isSmartphone} $isTablet={isTablet}>
        <S.Brand className={`${hover && "open"}`} />

        <S.List className={`${hover && "open"}`}>
          {filteredNav.map((item, idx) => {
            if (item.allowedRoles) {
              const hasPermission = item.allowedRoles.some((role: string) =>
                checkIfUserHasRole(role),
              );

              if (!hasPermission) return null;
            }

            if (item.route) {
              return (
                <S.Item key={idx} $active={location.pathname.indexOf(item.route) >= 0}>
                  <Link to={item.route}>
                    <Icon
                      appearance={location.pathname === item.route ? undefined : "filled"}
                      icon={item.icon}
                      mode="light"
                      size={hover ? "xs" : "sm"}
                    />

                    <span>{item.label}</span>
                  </Link>
                </S.Item>
              );
            }

            return (
              <S.Item key={idx} $openSubItems={expandedIndex === idx} $hasList $hover={hover}>
                <div>
                  <div onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}>
                    <Icon
                      appearance="filled"
                      icon={item.icon}
                      mode="light"
                      size={hover ? "xs" : "sm"}
                    />

                    <span>{item.label}</span>
                  </div>

                  <S.SubList>
                    {item.list?.filter((subitem: any) => !isSmartphone || subitem.mobileVisible !== false)
                      .map((subitem: any, subidx: number) => (
                      <S.SubItem
                        key={subidx}
                        className={location.pathname === subitem.route ? "item-selected" : ""}
                        $openSubItems={expandedIndex === idx}
                        $hover={hover}
                      >
                        <Link to={subitem.route}>
                          <Icon
                            appearance={location.pathname === subitem.route ? undefined : "filled"}
                            icon={subitem.icon}
                            mode="light"
                            size={hover ? "xs" : "sm"}
                          />

                          <span>{subitem.label}</span>
                        </Link>
                      </S.SubItem>
                    ))}
                  </S.SubList>
                </div>
              </S.Item>
            );
          })}
        </S.List>
      </S.Container>
    </>
  );
}