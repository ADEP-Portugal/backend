export function getCurrentWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const startOfWeek = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
  );
  startOfWeek.setDate(now.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek + 1));
  const endOfWeek = new Date(
    startOfWeek.getFullYear(),
    startOfWeek.getMonth(),
    startOfWeek.getDate(),
    23,
    59,
    59,
    999,
  );
  endOfWeek.setDate(startOfWeek.getUTCDate() + 5);
  return { startOfWeek, endOfWeek };
}

export function getCurrentMonthRange() {
  const now = new Date();

  const startOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );
  const endOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0),
  );
  endOfMonth.setUTCHours(23, 59, 59, 999);

  return { startOfMonth, endOfMonth };
}
