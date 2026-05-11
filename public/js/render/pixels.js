import { ctx, canvas } from "../dom.js"
import { pixels } from "./render.js"
import { worldToScreen } from "../utils/coords.js"

export function drawPixels() {

  for (const [key, color] of pixels) {

    const [x, y] =
      key.split(":").map(Number)

    const pos =
      worldToScreen(x, y)

    if (
      pos.x + pos.size < 0 ||
      pos.y + pos.size < 0 ||
      pos.x > canvas.width ||
      pos.y > canvas.height
    ) continue

    ctx.fillStyle = color

    ctx.fillRect(
      pos.x,
      pos.y,
      pos.size,
      pos.size
    )
  }
}
