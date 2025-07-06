export const STATUS_OPTIONS = [
  {
    value: "",
    label: "Todos",
  },
  {
    value: "true",
    label: "Ativos",
  },
  {
    value: "false",
    label: "Inativos",
  },
];

export const DEFAULT_ITEMS_PER_PAGE = 5;

export const ITEMS_PER_PAGE = [
  {
    value: 5,
    label: "5",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 15,
    label: "15",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 25,
    label: "25",
  },
];

export type StringBoolean = "true" | "false";

export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => ({
  value: i,
  label: i.toString().padStart(2, "0"),
}));

export const HOURS_OPTIONS = Array.from({ length: 100 }, (_, i) => ({
  value: i,
  label: i.toString().padStart(2, "0"),
}));
