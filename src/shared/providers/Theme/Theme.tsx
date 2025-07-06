import { theme } from "@shared/styles/theme";
import { ReactNode } from "react";
import { ThemeProvider as Theme } from "styled-components";

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return <Theme theme={theme}>{children}</Theme>;
}
