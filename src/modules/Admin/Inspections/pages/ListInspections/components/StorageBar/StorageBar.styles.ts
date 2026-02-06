import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
`;

export const BarContainer = styled.div``;

export const UsageText = styled.span<{ usagePercentage: number }>`
  ${({ theme, usagePercentage }) => css`
    font-size: 0.75rem;
    color: ${theme.colors.feedback.success.medium};
    text-align: right;
    font-weight: ${theme.font.weight.medium};

    ${usagePercentage >= 50 && `color: ${theme.colors.feedback.helper.pure};`}
    ${usagePercentage >= 80 && `color: ${theme.colors.feedback.warning.pure};`}
  `}
`;
