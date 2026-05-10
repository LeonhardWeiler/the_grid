import { cooldownEl } from "./dom.js"

export const cooldownEndRef = {
  value: 0
}

let cooldownRunning = false

export function handleCooldown(msg) {
  cooldownEndRef.value = msg.end
  startCooldownUI()
}

function startCooldownUI() {
  if (cooldownRunning) return
  cooldownRunning = true
  requestAnimationFrame(updateCooldownUI)
}

function updateCooldownUI() {

  const remaining = cooldownEndRef.value - Date.now()

  if (remaining <= 0) {
    cooldownEndRef.value = 0
    cooldownRunning = false
    return
  }

  cooldownEl.textContent =
    `Cooldown: ${(remaining / 1000).toFixed(1)}s`

  requestAnimationFrame(updateCooldownUI)
}
