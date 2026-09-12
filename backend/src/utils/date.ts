export function getMonthRange(month?: string): { start: string; end: string } {
  const reference = month ? new Date(`${month}-01T00:00:00Z`) : new Date();
  const year = reference.getUTCFullYear();
  const monthIndex = reference.getUTCMonth();

  const start = new Date(Date.UTC(year, monthIndex, 1));
  const end = new Date(Date.UTC(year, monthIndex + 1, 0));

  const format = (d: Date) => d.toISOString().slice(0, 10);

  return { start: format(start), end: format(end) };
}
