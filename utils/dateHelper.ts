export function getTodayFormatted(): { day: string; month: string; year: string; fullDate: string } {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = String(today.getFullYear());
  const fullDate = `${day}/${month}/${year}`;
  return { day, month, year, fullDate };
}

export function getTomorrowFormatted(): { day: string; month: string; year: string; fullDate: string } {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const day = String(tomorrow.getDate()).padStart(2, '0');
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const year = String(tomorrow.getFullYear());
  const fullDate = `${day}/${month}/${year}`;
  return { day, month, year, fullDate };
}
