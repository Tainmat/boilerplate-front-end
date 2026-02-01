import { Card } from "@/shared/components/Core/Card";
import { rgba } from "polished";
import styled from "styled-components";

export const CardEquipmentContainer = styled(Card)`
  cursor: pointer;
  padding: 0 !important;
  background-color: ${(props) => rgba(props.theme.colors.brand.primary.pure, 0.85)} !important;
  margin-bottom: 0 !important;

  div:last-child {
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ImageWrapper = styled.div`
  width: 100%;
  /* aspect-ratio: 1 / 1; */
  background: ${(props) => rgba(props.theme.colors.neutral.high.dark, 0.05)};

  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CardEquipmentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;
