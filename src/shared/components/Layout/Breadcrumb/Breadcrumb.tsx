import { Icon } from "@shared/components/Core/Icons/Icon";
import { Caption } from "@shared/components/Core/Typography/Caption";
import { IBreadcrumb } from "@shared/components/Layout/Breadcrumb/Breadcrumb.interface";
import * as S from "@shared/components/Layout/Breadcrumb/Breadcrumb.styles";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { Link } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import { useEffect, useState, useMemo } from "react";

interface Props {
  items: IBreadcrumb[];
}

export function Breadcrumb({ items }: Props) {
  const { isSmartphone, isTablet, isSmallScreen } = useDeviceDetection();
  const [displayItems, setDisplayItems] = useState<IBreadcrumb[]>([]);

  // Memoize the breadcrumb items to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => items, [items]);

  // Adjust displayed breadcrumb items based on screen size
  useEffect(() => {
    if (!items || items.length === 0) {
      setDisplayItems([]);
      return;
    }

    if (isSmartphone && items.length > 2) {
      // On small mobile, show only the last item with ellipsis
      setDisplayItems([{ text: "...", route: items[0]?.route }, ...items.slice(-1)]);
    } else if (isTablet && items.length > 3) {
      // On tablet, show first and last 2 items
      setDisplayItems([items[0], { text: "...", route: undefined }, ...items.slice(-2)]);
    } else if (isSmallScreen && items.length > 4) {
      // On small screens, show first and last 3 items
      setDisplayItems([items[0], { text: "...", route: undefined }, ...items.slice(-3)]);
    } else {
      // On larger screens, show all items
      setDisplayItems(items);
    }
  }, [memoizedItems, isSmartphone, isTablet, isSmallScreen]);

  if (!items || items.length === 0) return null;

  return (
    <S.Container>
      {displayItems.map((item, idx) => (
        <S.Wrapper key={uuidV4()}>
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