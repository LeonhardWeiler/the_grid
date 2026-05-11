import { cooldownEl } from "../dom.js"

import {
  getCooldownRemaining
} from "./cooldown.js"

import { state } from "../state.js"

export function updateButtonUI() {

  const remaining =
    getCooldownRemaining()

  if (remaining > 0) {

    cooldownEl.textContent =
      `Cooldown: ${(remaining / 1000).toFixed(1)}s`

    cooldownEl.classList.add("disabled")

    return
  }

  cooldownEl.classList.remove("disabled")

  if (!state.selectedPixel) {
    cooldownEl.textContent = "Select Pixel"
    return
  }

  cooldownEl.textContent =
    `Click to accept (${state.selectedPixel.x}/${state.selectedPixel.y})`
}
