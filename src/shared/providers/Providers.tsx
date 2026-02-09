import { ReactQueryProvider } from "@shared/providers/ReactQuery";
import { ThemeProvider } from "@shared/providers/Theme";
import { ReactNode } from "react";

import { ReduxProvider } from "./Redux";

interface Props {
  children: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <ThemeProvider>
      <ReduxProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
