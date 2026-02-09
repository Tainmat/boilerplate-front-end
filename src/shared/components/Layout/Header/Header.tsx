import AvatarImage from "@assets/images/profile-sm.png";
import { Breadcrumb } from "@shared/components/Layout/Breadcrumb";
import { useSideMenuOpenContext } from "@shared/components/Layout/contexts/SideMenuOpen";
import * as S from "@shared/components/Layout/Header/Header.styles";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useHeaderContext } from "@shared/contexts/Layout/Header";
import { useState } from "react";

import { useAuthContext } from "@/shared/contexts/Auth";
import { useOnlineStatus } from "@/shared/contexts/OnlineStatus";

import { Icon } from "../../Core/Icons/Icon";
import { Tag } from "../../Core/Tag";
import { Heading } from "../../Core/Typography/Heading";
import { Paragraph } from "../../Core/Typography/Paragraph";
import { UserDropdown } from "./Dropdown";

export function Header() {
  const { hover, toggleMenu, isSmartphone } = useSideMenuOpenContext();
  const { user } = useAuthContext();
  const { visible } = useHeaderContext();
  const { breadcrumb } = useBreadcrumbContext();
  const { isSyncing, isOnline } = useOnlineStatus();

  const handleMenuClick = () => {
    toggleMenu();
  };

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  // Function to handle avatar click
  const handleAvatarClick = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  // Function to close dropdown
  const handleCloseDropdown = () => {
    setMenuIsOpen(false);
  };

  if (!visible) return null;

  return (
    <>
      <S.Container $sideMenuIsOpen={hover}>
        <div className="col1">
          <S.MenuButton onClick={handleMenuClick}>
            <Icon icon={hover ? "close" : "menu"} mode="light" size="sm" />
          </S.MenuButton>

          <div className="username">
            <Paragraph size="lg" className="hello">
              Olá, {isSmartphone ? user?.socialName?.split(" ")[0] : user?.socialName}!
            </Paragraph>
            <span>{String.fromCodePoint(0x1f44b)}</span>
          </div>
        </div>

        <div className="col2 gap-3">
          <Tag status={isOnline ? "success" : "warning"} size="lg" className="gap-2">
            <Icon
              icon={isSyncing ? "cloud_sync" : isOnline ? "cloud_queue" : "cloud_off"}
              mode={!isOnline ? "light" : undefined}
              size="sm"
            />
            <Heading size="xs" className={isOnline ? "" : "text-neutral-high-pure"}>
              {isSyncing ? "Sincronizando" : isOnline ? "Online" : "Offline"}
            </Heading>
          </Tag>

          <S.Avatar onClick={handleAvatarClick}>
            <img src={AvatarImage} alt="Username" />
            {menuIsOpen && <UserDropdown onClose={handleCloseDropdown} />}
          </S.Avatar>
        </div>
      </S.Container>
      <S.BreadcrumbContainer $sideMenuIsOpen={hover}>
        <Breadcrumb items={breadcrumb} />
      </S.BreadcrumbContainer>
    </>
  );
}
