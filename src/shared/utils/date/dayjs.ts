import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");

// Converter para UTC
export const convertToUTC = (date: Date): string => {
  return dayjs(date).local().format("YYYY-MM-DD");
};

// Comparar em horas
export const compareInHours = (start_date: Date, end_date: Date): number => {
  const end_date_utc = convertToUTC(end_date);
  const start_date_utc = convertToUTC(start_date);
  return dayjs(end_date_utc).diff(start_date_utc, "hours");
};

// Data atual
export const dateNow = (): Date => {
  return dayjs().toDate();
};

// Comparar em dias
export const compareInDays = (start_date: Date, end_date: Date): number => {
  const end_date_utc = convertToUTC(end_date);
  const start_date_utc = convertToUTC(start_date);
  return dayjs(end_date_utc).diff(start_date_utc, "days");
};

// Adicionar dias
export const addDays = (days: number): Date => {
  return dayjs().add(days, "days").toDate();
};

// Adicionar horas
export const addHours = (hours: number): Date => {
  return dayjs().add(hours, "hour").toDate();
};

// Comparar se é anterior
export const compareIfBefore = (start_date: Date, end_date: Date): boolean => {
  return dayjs(start_date).isBefore(end_date);
};

// Último dia do mês
export const lastDayInMonth = (date: Date): number => {
  return dayjs(date).daysInMonth();
};

// Datas do mês paginadas
export const monthDates = (date: Date, page: number): string[] => {
  const dates = [];
  const lastDayMonth = dayjs(date).daysInMonth();
  const month = dayjs(date).month();

  if (page > 4 || (month === 1 && page > 3)) return [];

  const range = {
    initialDate: page * 10 - 9,
    finalDate: page * 10 < lastDayMonth ? page * 10 : lastDayMonth,
  };

  for (let i = range.initialDate; i <= range.finalDate; i++) {
    const diaDoMes = dayjs(date).date(i);
    dates.push(diaDoMes.format("YYYY-MM-DD"));
  }

  return dates;
};

// Converter data para dia da semana
export const convertDateToWeekDay = (date: Date): string => {
  const weekDays = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
  ];

  return weekDays[dayjs(date).day()] || "";
};

// ===== Funções adicionais úteis para o PDF =====

// Formatar data BR
export const formatDateBR = (date: string | Date | undefined): string => {
  if (!date) return "";
  return dayjs(date).tz("America/Sao_Paulo").format("DD/MM/YYYY");
};

// Formatar data e hora BR
export const formatDateTimeBR = (date: string | Date | undefined): string => {
  if (!date) return "";
  return dayjs(date).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm");
};

// Formatar apenas hora
export const formatTime = (date: string | Date | undefined): string => {
  if (!date) return "";
  return dayjs(date).tz("America/Sao_Paulo").format("HH:mm");
};

// Formatar data por extenso
export const formatDateExtensive = (date: string | Date | undefined): string => {
  if (!date) return "";
  const d = dayjs(date).tz("America/Sao_Paulo");
  const day = d.format("DD");
  const month = d.format("MMMM");
  const year = d.format("YYYY");
  return `${day} de ${month} de ${year}`;
};

// Verificar se é hoje
export const isToday = (date: Date): boolean => {
  return dayjs(date).isSame(dayjs(), "day");
};

// Verificar se é amanhã
export const isTomorrow = (date: Date): boolean => {
  return dayjs(date).isSame(dayjs().add(1, "day"), "day");
};

// Verificar se é ontem
export const isYesterday = (date: Date): boolean => {
  return dayjs(date).isSame(dayjs().subtract(1, "day"), "day");
};

export const firstDayOfMonth = (): string => {
  return dayjs().startOf("month").format("YYYY-MM-DD");
};

export const lastDayOfMonth = (): string => {
  return dayjs().endOf("month").format("YYYY-MM-DD");
};
