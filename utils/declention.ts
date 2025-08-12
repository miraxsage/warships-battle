/**
 * Возвращает правильную форму слова в зависимости от числа
 *
 * @param number - Число для определения склонения
 * @param words - Массив из 3 форм слова: [одна форма, две формы, много форм]
 *
 * @example
 * ```typescript
 * declension(1, ['корабль', 'корабля', 'кораблей']) // 'корабль'
 * ```
 *
 * @returns Правильная форма слова для указанного числа
 */
export function declension(number: number, words: string[], combine?: boolean) {
  const cases = [2, 0, 1, 1, 1, 2];
  const n = Math.abs(number);
  const caseIndex = Math.min(n % 10, 5);
  const index = n % 100 > 4 && n % 100 < 20 ? 2 : cases[caseIndex] ?? 2;
  const result = words[index] || words[2];
  if (combine) {
    return `${number} ${result}`;
  }
  return result;
}
