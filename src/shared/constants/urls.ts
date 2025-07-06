// API Base URL
export const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

// Auth
export const URL_LOGIN = `${API_BASE_URL}/auth/login`;
export const URL_RECOVER_PASSWORD = `${API_BASE_URL}/auth/recover-password`;

// Users
export const URL_LIST_USUA = `${API_BASE_URL}/users`;
export const URL_SAVE_USUA = `${API_BASE_URL}/users`;

// Profiles
export const URL_LIST_PERF = `${API_BASE_URL}/profiles`;
export const URL_SAVE_PERF = `${API_BASE_URL}/profiles`;

// User Profiles
export const URL_LIST_ASSO_PERF_USUA = `${API_BASE_URL}/user-profiles`;
export const URL_SAVE_ASSO_PERF_USUA = `${API_BASE_URL}/user-profiles`;

// Customers
export const URL_PROC_LIST_CLIE = `${API_BASE_URL}/customers`;
export const URL_PROC_SAVE_CLIE = `${API_BASE_URL}/customers`;

// Customer Contacts
export const URL_PROC_LIST_CONT_CLIE = `${API_BASE_URL}/customer-contacts`;
export const URL_PROC_SAVE_CONT_CLIE = `${API_BASE_URL}/customer-contacts`;

// Equipments
export const URL_PROC_LIST_EQUIP = `${API_BASE_URL}/equipments`;
export const URL_PROC_SAVE_EQUIP = `${API_BASE_URL}/equipments`;

// Inspections
export const URL_PROC_LIST_INSP = `${API_BASE_URL}/inspections`;
export const URL_PROC_SAVE_INSP = `${API_BASE_URL}/inspections`;