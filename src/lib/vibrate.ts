export function vibrate(pattern: number | number[]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

export function vibrateShort(): void {
  vibrate(15);
}

export function vibrateSuccess(): void {
  vibrate([20, 40, 30, 40, 60]);
}

export function vibrateClick(): void {
  vibrate(10);
}
