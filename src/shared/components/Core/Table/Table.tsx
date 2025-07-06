import { Order } from "@shared/components/Core/Table/Order";
import { IOrder } from "@shared/components/Core/Table/Order/Order.interface";
import { Container, Scrollable, Wrapper } from "@shared/components/Core/Table/Table.styles";
import { ReactNode, useState, useEffect } from "react";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";

interface Props {
  innerRef?: any;
  style?: any;
  id?: string;
  className?: string;
  children?: ReactNode;
  onClick?: (event: any) => void;
}

interface TableProps extends Props {
  $isLoading?: boolean;
  $responsive?: boolean;
  $bordered?: boolean;
  $hover?: boolean;
  scrollable?: boolean;
}

interface TfootProps extends Props {
  size: "md" | "lg";
}

interface TrProps extends Props {
  stroke?: "success" | "helper" | "warning";
  highlight?: "success" | "helper" | "warning";
  expandable?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

interface ThProps extends Props {
  colSpan?: number;
  order?: IOrder;
  orderBy?: string;
  onChange?: (order: IOrder, orderBy: string) => void;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
}

interface TdProps extends Props {
  colSpan?: number;
  showOnHover?: boolean;
  style?: React.CSSProperties;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
}

function Table({
  innerRef,
  $isLoading,
  $responsive,
  scrollable,
  $bordered,
  $hover,
  children,
  ...props
}: TableProps) {
  if (!scrollable) {
    return (
      <Wrapper $responsive={$responsive} $bordered={$bordered}>
        <Container
          {...props}
          ref={innerRef}
          $isLoading={$isLoading}
          $hover={$hover}
          $bordered={$bordered}
        >
          {children}
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper $bordered={$bordered}>
      <Scrollable>
        <Container
          ref={innerRef}
          $isLoading={$isLoading}
          scrollable={true}
          $hover={$hover}
          $bordered={$bordered}
          {...props}
        >
          {children}
        </Container>
      </Scrollable>
    </Wrapper>
  );
}

function Thead({ innerRef, children, ...props }: Props) {
  return (
    <thead ref={innerRef} {...props}>
      {children}
    </thead>
  );
}

function Tbody({ innerRef, children, ...props }: Props) {
  return (
    <tbody ref={innerRef} {...props}>
      {children}
    </tbody>
  );
}

function Tfoot({ innerRef, size, children, ...props }: TfootProps) {
  return (
    <tfoot ref={innerRef} className={`size-${size}`} {...props}>
      {children}
    </tfoot>
  );
}

function Tr({ 
  innerRef, 
  stroke, 
  highlight, 
  style, 
  className, 
  children, 
  expandable,
  expanded,
  onToggleExpand,
  ...props 
}: TrProps) {
  const classes = `${className || ""} 
    ${highlight ? `highlight-${highlight}` : ""}
    ${stroke ? `stroke-${stroke}` : ""}
    ${expandable ? "expandable" : ""}
    ${expanded ? "show" : ""}`;

  const handleClick = (e: React.MouseEvent) => {
    if (expandable && onToggleExpand) {
      onToggleExpand();
    }
    
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <tr 
      ref={innerRef} 
      style={style} 
      className={classes} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </tr>
  );
}

function Th({ 
  colSpan, 
  order, 
  orderBy, 
  onChange, 
  innerRef, 
  children,
  hideOnMobile,
  hideOnTablet,
  ...props 
}: ThProps) {
  const [currentOrder, setCurrentOrder] = useState<IOrder>(order);
  const { isSmartphone, isTablet } = useDeviceDetection();
  
  // Hide column based on screen size
  if ((hideOnMobile && isSmartphone) || (hideOnTablet && isTablet)) {
    return null;
  }

  function handleOnClick() {
    if (onChange && orderBy) {
      let order: IOrder;

      switch (currentOrder) {
        case "asc":
          order = "desc";
          break;

        case "desc":
          order = undefined;
          break;

        case undefined:
          order = "asc";
          break;

        default:
          break;
      }

      setCurrentOrder(order);

      onChange(order, orderBy);
    }
  }

  return onChange ? (
    <th ref={innerRef} colSpan={colSpan} {...props}>
      <Order order={currentOrder} onClick={() => handleOnClick()}>
        {children}
      </Order>
    </th>
  ) : (
    <th ref={innerRef} colSpan={colSpan} {...props}>
      {children}
    </th>
  );
}

function Td({ 
  colSpan, 
  showOnHover, 
  style, 
  innerRef, 
  children,
  hideOnMobile,
  hideOnTablet,
  ...props 
}: TdProps) {
  const { isSmartphone, isTablet } = useDeviceDetection();
  
  // Hide column based on screen size
  if ((hideOnMobile && isSmartphone) || (hideOnTablet && isTablet)) {
    return null;
  }
  
  return showOnHover ? (
    <td
      ref={innerRef}
      colSpan={colSpan}
      style={{ 
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis", 
        maxWidth: "250px", 
        ...style 
      }}
      {...props}
    >
      <div className="show-on-hover" title={typeof children === 'string' ? children : undefined}>{children}</div>
    </td>
  ) : (
    <td
      ref={innerRef}
      colSpan={colSpan}
      style={{ 
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis", 
        maxWidth: "250px", 
        ...style 
      }}
      title={typeof children === 'string' ? children : undefined}
      {...props}
    >
      {children}
    </td>
  );
}

export { Table, Tbody, Td, Tfoot, Th, Thead, Tr };