import { Select } from "@shared/components/Core/Form/Fields/Select";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import * as S from "@shared/components/Core/Table/ItemsPerPage/ItemsPerPage.styles";
import { Heading } from "@shared/components/Core/Typography/Heading";
import { ITEMS_PER_PAGE } from "@shared/constants/options";
import { useEffect, useState } from "react";

interface Props {
  options?: IOption[];
  onChange?: (option: IOption) => void;
}

export function ItemsPerPage({ options, onChange }: Props) {
  const [useOptions, setUseOptions] = useState<IOption[]>(ITEMS_PER_PAGE);

  useEffect(() => {
    if (options) {
      setUseOptions(options);
    }
  }, [options]);

  return (
    <S.Container>
      <Heading size={"xs"}>Visualizando </Heading>
      <div>
        <Select
          size="sm"
          options={useOptions}
          onChange={onChange}
          $itemsPerPage
          value={useOptions[0].value}
        />
      </div>
      <Heading size={"xs"}> itens por página</Heading>
    </S.Container>
  );
}
