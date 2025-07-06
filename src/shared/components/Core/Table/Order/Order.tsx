import { Icon } from "@shared/components/Core/Icons/Icon";
import { IOrder } from "@shared/components/Core/Table/Order/Order.interface";
import { Container } from "@shared/components/Core/Table/Order/Order.styles";
import { ReactNode } from "react";

interface Props {
  order: IOrder;
  onClick: () => void;
  children: ReactNode;
}

export function Order({ order, onClick, children }: Props) {
  function handleIcon() {
    switch (order) {
      case "asc":
        return "expand_less";

      case "desc":
        return "expand_more";

      default:
        return "unfold_more";
    }
  }

  return (
    <Container order={order} onClick={onClick}>
      {children}

      <Icon size="sm" icon={handleIcon()} />
    </Container>
  );
}
