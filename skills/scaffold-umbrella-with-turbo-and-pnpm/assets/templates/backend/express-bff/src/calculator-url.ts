export function calculatorValueUrl(base: string): string {
  return `${base.replace(/\/$/, '')}/value`;
}
