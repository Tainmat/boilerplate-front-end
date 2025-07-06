import AvatarImage from "@assets/images/profile-sm.png";
import { Breadcrumb } from "@shared/components/Layout/Breadcrumb";
import { useSideMenuOpenContext } from "@shared/components/Layout/contexts/SideMenuOpen";
import * as S from "@shared/components/Layout/Header/Header.styles";
import { useBreadcrumbContext } from "@shared/contexts/Layout/Breadcrumb";
import { useHeaderContext } from "@shared/contexts/Layout/Header";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { useState } from "react";

import { useAuthContext } from "@/shared/contexts/Auth";

import { ButtonIcon } from "../../Core/Buttons/ButtonIcon";
import { Tooltip } from "../../Core/Tooltip";
import { Paragraph } from "../../Core/Typography/Paragraph";
import { UserDropdown } from "./Dropdown";

export function Header() {
  const { hover, toggleMenu } = useSideMenuOpenContext();
  const { user } = useAuthContext();
  const { isSmartphone, isTablet } = useDeviceDetection();
  const { visible } = useHeaderContext();
  const { breadcrumb } = useBreadcrumbContext();

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
          <div>
            <Tooltip title={hover ? "Fechar menu" : "Abrir menu"} place={isSmartphone ? "bottom" : "bottom-start"}>
              <ButtonIcon
                icon={hover ? "menu_open" : "menu"}
                size="sm"
                appearance="round"
                onClick={toggleMenu}
              />
            </Tooltip>
          </div>

          <div className="username">
            <Paragraph size="lg" className="hello">
              Olá, {isSmartphone ? user?.userName?.split(' ')[0] : user?.userName}!
            </Paragraph>
            <span>{String.fromCodePoint(0x1f44b)}</span>
          </div>
        </div>

        <div className="col2">
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