/* global console */

/**
 * Writes a message to console.log().
 * @customfunction LOG
 * @param message String to write.
 * @returns String to write.
 */
export function logMessage(message: string): string {
  console.log(message);

  return message;
}

/**
 * Writes multiple message to console.log().
 * @customfunction
 * @param range A 2D range from Excel.
 */
export function logRange(range: string[][]): void {
  console.log(range);
}
