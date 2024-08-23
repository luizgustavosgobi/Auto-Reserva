import { dayToReserve, dayToReserveStr, daysOfWeek } from "./variables.js";

export function getDayToReserve() {
  const day = new Date();
  day.setDate(day.getDate() + 1);

  switch (day.getDay()) {
    case 0:
      day.setDate(day.getDate() + 1);
      break;
    case 6:
      day.setDate(day.getDate() + 2);
      break;
  }

  return day;
}

export function dayToString(day) {
  return day.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
}

export function isDayToReserve(userDays) {
  if (
    userDays.reserve &&
    ((userDays.daysOfWeek?.includes(daysOfWeek[dayToReserve.getDay()]) &&
      !userDays.deletedDays?.includes(dayToReserveStr)) ||
      userDays.extraDays?.includes(dayToReserveStr))
  ) {
    return true;
  }
  return false;
}
