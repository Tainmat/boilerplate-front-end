import { Heading } from "@/shared/components/Core/Typography/Heading";
import { IEquipmentDropdown } from "@/shared/store/modules/Dropdowns";

import * as S from "./CardEquipment.styles";

interface CardEquipmentProps {
  equipment: IEquipmentDropdown;
  onSelect: () => void;
}

export function CardEquipment({ equipment, onSelect }: CardEquipmentProps) {
  const { name, croqui } = equipment;

  return (
    <S.CardEquipmentContainer onClick={onSelect}>
      <S.ImageWrapper>
        <S.CardEquipmentImage src={croqui} alt={name} loading="lazy" />
      </S.ImageWrapper>
      <div>
        <Heading size="xs" className="text-neutral-high-pure">
          {name}
        </Heading>
      </div>
    </S.CardEquipmentContainer>
  );
}
