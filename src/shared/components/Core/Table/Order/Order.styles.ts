import { IOrder } from "@shared/components/Core/Table/Order/Order.interface";
import styled, { css } from "styled-components";

interface Props {
  order: IOrder;
}

export const Container = styled.div<Props>`
  ${(props) => css`
    cursor: pointer;

    display: flex;
    align-items: center;

    width: fit-content;

    > span {
      margin-left: 0.5rem;

      ${!props.order &&
      css`
        opacity: ${props.theme.opacity.level.medium};
      `}
    }
  `}
`;
