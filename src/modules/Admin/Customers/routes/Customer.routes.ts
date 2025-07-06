import { IRouteProps } from "@shared/routes/routes.interface";
import { lazy } from "react";

import {
  ROUTE_LIST_CUSTOMERS,
  ROUTE_SAVE_CUSTOMER,
  ROUTE_UPDATE_CUSTOMER,
} from "@/modules/Admin/Customers/routes/Customer.paths";

const ListCustomers = lazy(() =>
  import("@/modules/Admin/Customers/pages/ListCustomers").then((module) => ({
    default: module.ListCustomers,
  })),
);

const CreateCustomer = lazy(() =>
  import("@/modules/Admin/Customers/pages/CreateCustomer").then((module) => ({
    default: module.CreateCustomer,
  })),
);

const ListCustomerContacts = lazy(() =>
  import("@/modules/Admin/Customers/pages/CustomerContacts/List").then((module) => ({
    default: module.ListCustomerContacts,
  })),
);

const CreateCustomerContacts = lazy(() =>
  import("@/modules/Admin/Customers/pages/CustomerContacts/Create").then((module) => ({
    default: module.CreateCustomerContact,
  })),
);

export const customersRoutes: IRouteProps[] = [
  {
    path: ROUTE_LIST_CUSTOMERS,
    component: ListCustomers,
    isPrivate: true,
  },
  {
    path: ROUTE_SAVE_CUSTOMER,
    component: CreateCustomer,
    isPrivate: true,
  },
  {
    path: `${ROUTE_UPDATE_CUSTOMER}/:uuid`,
    component: CreateCustomer,
    isPrivate: true,
  },
  {
    path: `${ROUTE_LIST_CUSTOMERS}/:uuid/contacts`,
    component: ListCustomerContacts,
    isPrivate: true,
  },
  {
    path: `${ROUTE_LIST_CUSTOMERS}/:uuid/contacts/new`,
    component: CreateCustomerContacts,
    isPrivate: true,
  },
  {
    path: `${ROUTE_LIST_CUSTOMERS}/:uuid/contacts/edit/:uuidContato`,
    component: CreateCustomerContacts,
    isPrivate: true,
  },
];
