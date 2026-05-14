import { ctx } from "../dom"
import { state } from "../state"
import { worldToScreen } from "../utils/coords.js"

export function drawPreview() {

  if (state.hoverPixel) {

    const pos = worldToScreen(
      state.hoverPixel.x,
      state.hoverPixel.y
    )

    ctx.fillStyle =
      "rgba(255,255,255,0.2)"

    ctx.fillRect(
      pos.x,
      pos.y,
      pos.size,
      pos.size
    )
  }

  if (state.selectedPixel) {

    const pos = worldToScreen(
      state.selectedPixel.x,
      state.selectedPixel.y
    )

    ctx.strokeStyle = "yellow"
    ctx.lineWidth = 2

    ctx.strokeRect(
      pos.x,
      pos.y,
      pos.size,
      pos.size
    )
  }
}
