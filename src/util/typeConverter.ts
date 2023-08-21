/**
 * Converts a string input to its respective union type if it matches.
 * This is a generic function that works with any union type derived from an array of string literals.
 *
 * @customfunction
 * @param input The string that needs to be converted.
 * @param validValues An array of valid string literals for the respective union type.
 * @returns The string if it matches the union type, otherwise null.
 * @example
 * const sizes = ["small", "medium", "large"] as const;
 * type Size = typeof sizes[number];
 * const mySize = convertToType("medium", sizes);
 */
export function convertStringToUnionType<T extends string>(input: string, validValues: readonly T[]): T | null {
  return validValues.includes(input as T) ? (input as T) : null;
}
