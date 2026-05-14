import { ctx, canvas } from "../dom"
import { pixels } from "./render"
import { worldToScreen } from "../utils/coords"

export function drawPixels(): void {
  for (const [key, color] of pixels) {
    const [x, y]: number[] = key.split(":").map(Number)

    const pos: { x: number; y: number; size: number } = worldToScreen(x, y)

    if (
      pos.x + pos.size < 0 ||
      pos.y + pos.size < 0 ||
      pos.x > canvas.width ||
      pos.y > canvas.height
    ) continue

    ctx.fillStyle = color
    ctx.fillRect(pos.x, pos.y, pos.size, pos.size)
  }
}
