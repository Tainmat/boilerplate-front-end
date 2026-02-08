import { adminRecordsPath } from "@modules/Admin/shared/routes/Admin.paths";

const path = `${adminRecordsPath}/inspections`;

export const ROUTE_LIST_INSPECTIONS = `${path}`;
export const ROUTE_SAVE_INSPECTION = `${path}/create`;
export const ROUTE_UPDATE_INSPECTION = `${path}/edit`;
export const ROUTE_UPDATE_INSPECTION_OFFLINE = `${path}/edit/:uuid/offline`;
