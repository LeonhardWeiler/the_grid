import { canvas, ctx } from "../dom"
import { drawMinimap } from "./minimap.js"
import { drawGrid } from "./grid.js"
import { drawPixels } from "./pixels.js"
import { drawPreview } from "./preview.js"

export const pixels = new Map()

let needsRender = true

export function requestRender() {
  needsRender = true
}

export function render() {

  if (!needsRender) return

  ctx.fillStyle = "#111"

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  )

  drawGrid()
  drawPixels()
  drawPreview()
  drawMinimap()

  needsRender = false
}
