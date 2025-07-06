/* import { useNavigate } from "react-router-dom"; */

import { Icon } from "@/shared/components/Core/Icons/Icon";
import { useAuthContext } from "@/shared/contexts/Auth";

import * as S from "./Dropdown.styles";

interface UserDropdownProps {
  onClose?: () => void;
}

export function UserDropdown({ onClose }: UserDropdownProps) {
  /* const navigate = useNavigate(); */
  const { signOut } = useAuthContext();
  
  const handleLogout = () => {
    if (onClose) onClose();
    signOut();
  };
  
  return (
    <S.Container>
      <S.List>
        {/* <S.Item onClick={() => navigate(ROUTE_USERS_PROFILE)}>
          <Icon icon="person" size="xs" />
          <p>Perfil</p>
        </S.Item> */}
        <S.Item className="logout" onClick={handleLogout}>
          <Icon icon="exit_to_app" size="xs" mode="warning" />
          <p>Logout</p>
        </S.Item>
      </S.List>
    </S.Container>
  );
}
