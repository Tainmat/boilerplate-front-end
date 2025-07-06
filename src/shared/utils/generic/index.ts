export function removeEmptyEntries(object: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== "" && (value !== null || value !== undefined),
    ),
  );
}
