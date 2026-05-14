import { cooldownEl } from "../dom"
import { GRID_SIZE } from "../camera/camera.js"
import { state } from "../state"

import {
  toCenteredCoords
} from "../utils/gridCoords.js"

import {
  getCooldownRemaining
} from "./cooldown"


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

  const centered =
    toCenteredCoords(
      state.selectedPixel.x,
      state.selectedPixel.y
    )

  cooldownEl.textContent = `Click to accept (${centered.x} / ${centered.y})`
}
