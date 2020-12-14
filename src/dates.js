const currentYearFormat = new Intl.DateTimeFormat([], {
  month: "short",
  day: "2-digit",
});
const notCurrentYearFormat = new Intl.DateTimeFormat([], {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

export function formatDate(date) {
  return date.getFullYear() === new Date().getFullYear()
    ? currentYearFormat.format(date)
    : notCurrentYearFormat.format(date);
}
