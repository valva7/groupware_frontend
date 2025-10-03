import dayjs from "dayjs";

export const dateTime = {
  now: () => dayjs().format("YYYY-MM-DD HH:mm:ss"),

  formatDate: (date: string | Date, format = "YYYY-MM-DD") =>
      dayjs(date).format(format),

  formatTime: (date: string | Date, format = "HH:mm") =>
      dayjs(date).format(format),

  addDays: (date: string | Date, days: number) =>
      dayjs(date).add(days, "day").toDate(),

  diffInDays: (start: string | Date, end: string | Date) =>
      dayjs(end).diff(dayjs(start), "day"),
};
