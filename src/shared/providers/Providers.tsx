import { ReactQueryProvider } from "@shared/providers/ReactQuery";
import { ThemeProvider } from "@shared/providers/Theme";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <ThemeProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  );
}
