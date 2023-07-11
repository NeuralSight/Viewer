export function formatValueToPercentage(value: number): string {
  const percentage = value * 100;
  const percentageFixed = percentage.toFixed(2);
  return `${percentageFixed}%`;
}
