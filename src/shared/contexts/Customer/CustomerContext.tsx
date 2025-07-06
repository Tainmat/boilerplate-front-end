import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ICustomer } from "@/shared/hooks/services/Admin/useCustomers";
import { getLocalStorageItem, setLocalStorageItem } from "@/shared/utils/storage/local";

interface CustomerContextData {
  customer: ICustomer;
  selectCustomer: (customer: ICustomer) => void;
}

const Context = createContext<CustomerContextData>({} as CustomerContextData);

interface Props {
  children: ReactNode;
}

function CustomerContext({ children }: Props) {
  const [customer, setCustomer] = useState<ICustomer>({} as ICustomer);

  useEffect(() => {
    const storedCustomer = getLocalStorageItem("Usincheck@JOmetto:customer");

    storedCustomer && setCustomer(storedCustomer);
  }, []);

  const selectCustomer = useCallback((customer: ICustomer) => {
    setLocalStorageItem("Usincheck@JOmetto:customer", customer);
    setCustomer(customer);
  }, []);

  const providerValue = useMemo(
    () => ({
      customer,
      selectCustomer,
    }),
    [customer, selectCustomer],
  );

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

function useCustomerContext(): CustomerContextData {
  return useContext(Context);
}

export { CustomerContext, useCustomerContext };
