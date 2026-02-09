import { ReactNode } from "react";
import { Provider } from "react-redux";

import { store } from "@/shared/store/store";

interface Props {
  children: ReactNode;
}

export function ReduxProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
