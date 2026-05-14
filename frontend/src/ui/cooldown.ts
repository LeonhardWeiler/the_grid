export const cooldown = {
  end: 0,
}

export function setCooldown(end: number): void {
  cooldown.end = end
}

export function isCooldownActive(): boolean {
  return Date.now() < cooldown.end
}

export function getCooldownRemaining(): number {
  return Math.max(0, cooldown.end - Date.now())
}
