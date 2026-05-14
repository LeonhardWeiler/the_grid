import { canvas, ctx } from "../dom"
import { drawMinimap } from "./minimap"
import { drawGrid } from "./grid"
import { drawPixels } from "./pixels"
import { drawPreview } from "./preview"

export const pixels: Map<string, string> = new Map()

let needsRender = true

export function requestRender(): void {
  needsRender = true
}

export function render(): void {
  if (!needsRender) return

  ctx.fillStyle = "#111"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  drawGrid()
  drawPixels()
  drawPreview()
  drawMinimap()

  needsRender = false
}
