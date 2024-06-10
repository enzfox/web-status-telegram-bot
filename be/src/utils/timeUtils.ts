export const secondsToMs = (s: number) => s * 1000;

export function formatDownTime(downTime: number): string {
  const downTimeHours = Math.floor(downTime / 3600)
    .toString()
    .padStart(2, "0");
  const downTimeMinutes = Math.floor((downTime % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const downTimeSeconds = Math.floor(downTime % 60)
    .toString()
    .padStart(2, "0");

  return `${downTimeHours}:${downTimeMinutes}:${downTimeSeconds}`;
}
