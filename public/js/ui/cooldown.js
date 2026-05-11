export const cooldown = {
  end: 0
}

export function setCooldown(end) {
  cooldown.end = end
}

export function isCooldownActive() {
  return Date.now() < cooldown.end
}

export function getCooldownRemaining() {
  return Math.max(
    0,
    cooldown.end - Date.now()
  )
}
