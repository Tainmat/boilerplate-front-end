import { Icon } from "@shared/components/Core/Icons/Icon";
import { useSideMenuOpenContext } from "@shared/components/Layout/contexts/SideMenuOpen/SideMenuOpen";
import { nav } from "@shared/components/Layout/SideMenu/SideMenu.navigation";
import * as S from "@shared/components/Layout/SideMenu/SideMenu.Styles";
import { useSideMenuContext } from "@shared/contexts/Layout/SideMenu";
import { useAuthRoles } from "@shared/hooks/services/Rules/Auth/useRoles";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Filter navigation items based on device type
const filterNavItems = (items: any[], isMobile: boolean) => {
  if (!isMobile) return items;
  return items.filter((item) => item.mobileVisible !== false);
};

export function SideMenu() {
  const location = useLocation();
  const { visible } = useSideMenuContext();
  const { hover, closeMenu, isSmartphone, isTablet } = useSideMenuOpenContext();
  const { checkIfUserHasRole } = useAuthRoles();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Filter navigation items for mobile
  const filteredNav = filterNavItems(nav, isSmartphone);

  // Close menu when clicking on overlay (all resolutions)
  const handleOverlayClick = () => {
    closeMenu();
  };

  // Close menu when route changes on mobile
  useEffect(() => {
    if ((isSmartphone || isTablet) && hover) {
      closeMenu();
    }
  }, [location.pathname, isSmartphone, isTablet, closeMenu, hover]);

  if (!visible) return null;

  return (
    <>
      {/* Universal Overlay for all screen sizes */}
      <S.MenuOverlay $visible={hover} onClick={handleOverlayClick} />

      <S.Container $hover={hover} $isMobile={isSmartphone} $isTablet={isTablet}>
        {/* Close Button for all screen sizes when menu is open */}
        {hover && (
          <S.CloseButton onClick={closeMenu}>
            <Icon icon="close" mode="light" size="sm" />
          </S.CloseButton>
        )}

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
                    {item.list
                      ?.filter((subitem: any) => !isSmartphone || subitem.mobileVisible !== false)
                      .filter((subitem: any) => {
                        if (subitem.allowedRoles) {
                          return subitem.allowedRoles.some((role: string) =>
                            checkIfUserHasRole(role),
                          );
                        }
                        return true;
                      })
                      .map((subitem: any, subidx: number) => (
                        <S.SubItem
                          key={subidx}
                          className={location.pathname === subitem.route ? "item-selected" : ""}
                          $openSubItems={expandedIndex === idx}
                          $hover={hover}
                        >
                          <Link to={subitem.route}>
                            <Icon
                              appearance={
                                location.pathname === subitem.route ? undefined : "filled"
                              }
                              icon={subitem.icon}
                              mode="light"
                              size="xs"
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
