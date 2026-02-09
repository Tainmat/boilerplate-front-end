import { IDropdown } from "@shared/components/Core/Dropdown/Dropdown.interface";
import {
  Container,
  Item,
  ItemWrapper,
  Label,
  List,
  Wrapper,
} from "@shared/components/Core/Dropdown/Dropdown.styles";
import { Icon } from "@shared/components/Core/Icons/Icon";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { v4 } from "uuid";

interface Props {
  children: ReactNode;
  display?: "block";
  type: "hover" | "click";
  list: IDropdown[];
  onOpen?: (open: boolean) => void;
}

export function Dropdown({ children, display, type, list, onOpen }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    onOpen?.(open);
  }, [onOpen, open]);

  function handleOnClick() {
    if (type === "click") setOpen((open) => !open);
  }

  function handleOnMouseEnter() {
    if (type === "hover") setOpen(true);
  }

  function handleOnMouseLeave() {
    if (type === "hover") setOpen(false);
  }

  return (
    <Wrapper
      ref={wrapperRef}
      open={open}
      onClick={() => handleOnClick()}
      onMouseEnter={() => handleOnMouseEnter()}
      onMouseLeave={() => handleOnMouseLeave()}
    >
      {children}

      <Container>
        <List display={display}>
          {list
            .filter((el) => !el.hide)
            .map((item) => (
              <Item
                key={v4()}
                danger={item.danger}
                onClick={item.onClick}
                className={item.route ? "route" : "no-route"}
              >
                {item.route ? (
                  <Link to={item.route}>
                    {item.icon && <Icon icon={item.icon} />}

                    <Label>{item.text}</Label>
                  </Link>
                ) : (
                  <ItemWrapper>
                    {item.icon && <Icon icon={item.icon} />}

                    <Label>{item.text}</Label>
                  </ItemWrapper>
                )}
              </Item>
            ))}
        </List>
      </Container>
    </Wrapper>
  );
}
