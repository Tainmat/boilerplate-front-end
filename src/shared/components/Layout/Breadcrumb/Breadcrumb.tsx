import { Icon } from "@shared/components/Core/Icons/Icon";
import { Caption } from "@shared/components/Core/Typography/Caption";
import { IBreadcrumb } from "@shared/components/Layout/Breadcrumb/Breadcrumb.interface";
import * as S from "@shared/components/Layout/Breadcrumb/Breadcrumb.styles";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { useMemo } from "react";
import { Link } from "react-router-dom";

interface Props {
  items: IBreadcrumb[];
}

export function Breadcrumb({ items }: Props) {
  const { isSmartphone, isTablet, isSmallScreen } = useDeviceDetection();

  const displayItems = useMemo(() => {
    if (!items || items.length === 0) return [];

    if (isSmartphone && items.length > 2) {
      return [{ text: "...", route: items[0]?.route }, ...items.slice(-1)];
    }
    if (isTablet && items.length > 3) {
      return [items[0], { text: "...", route: undefined }, ...items.slice(-2)];
    }
    if (isSmallScreen && items.length > 4) {
      return [items[0], { text: "...", route: undefined }, ...items.slice(-3)];
    }

    return items;
  }, [items, isSmartphone, isTablet, isSmallScreen]);

  if (!items || items.length === 0) return null;

  return (
    <S.Container>
      {displayItems.map((item, idx) => (
        // Chave estável baseada no texto e índice, não UUID aleatório
        <S.Wrapper key={`${item.text}-${idx}`}>
          {idx + 1 === displayItems.length ? (
            <>
              <Icon icon="keyboard_arrow_right" className="separator" />
              <Caption size="lg" className="current">
                {item.text}
              </Caption>
            </>
          ) : (
            <>
              {idx > 0 && <Icon icon="keyboard_arrow_right" className="separator" />}
              {item.route ? (
                <Link to={String(item.route)} className="breadcrumb-link">
                  <Caption size="lg" className="path">
                    {item.text}
                  </Caption>
                </Link>
              ) : (
                <Caption size="lg">{item.text}</Caption>
              )}
            </>
          )}
        </S.Wrapper>
      ))}
    </S.Container>
  );
}
