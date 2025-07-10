export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes > 0 ? `${minutes} мин. ` : ``} ${seconds.toString()} сек.`;
}
