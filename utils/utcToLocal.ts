/**
 * Конвертирует UTC timestamp (в секундах) в локальное время клиента
 * @param utcTimestamp Unix timestamp в секундах (UTC)
 * @returns Date в локальном часовом поясе клиента
 */
export function utcTimestampToLocalDate(utcTimestamp: number): Date {
  return new Date(utcTimestamp * 1000);
}
