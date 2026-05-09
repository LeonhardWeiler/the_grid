import { canvas, ctx } from "./dom.js"

import {
  camera,
  BASE_PIXEL_SIZE
} from "./camera.js"

export const pixels = new Map()

let needsRedraw = true

export function setNeedsRedraw(v) {
  needsRedraw = v
}

// =========================
// GRID
// =========================
function drawGrid() {

  const step = BASE_PIXEL_SIZE * camera.zoom
  if (step < 4) return

  ctx.strokeStyle = "rgba(0,0,0,0.2)"
  ctx.lineWidth = 1

  const offsetX = (camera.x * step)
  const offsetY = (camera.y * step)

  const startX = -offsetX + canvas.width / 2
  const startY = -offsetY + canvas.height / 2

  const cols = Math.ceil(canvas.width / step)
  const rows = Math.ceil(canvas.height / step)

  for (let x = 0; x <= cols; x++) {

    const sx = startX + x * step

    ctx.beginPath()
    ctx.moveTo(sx, 0)
    ctx.lineTo(sx, canvas.height)
    ctx.stroke()
  }

  for (let y = 0; y <= rows; y++) {

    const sy = startY + y * step

    ctx.beginPath()
    ctx.moveTo(0, sy)
    ctx.lineTo(canvas.width, sy)
    ctx.stroke()
  }
}

// =========================
// PIXELS
// =========================
function drawPixels() {

  for (const [key, color] of pixels) {

    const [x, y] = key.split(":").map(Number)

    const screenX =
      (x - camera.x) *
      BASE_PIXEL_SIZE *
      camera.zoom +
      canvas.width / 2

    const screenY =
      (y - camera.y) *
      BASE_PIXEL_SIZE *
      camera.zoom +
      canvas.height / 2

    const size =
      BASE_PIXEL_SIZE * camera.zoom

    if (
      screenX < -50 ||
      screenY < -50 ||
      screenX > canvas.width + 50 ||
      screenY > canvas.height + 50
    ) continue

    ctx.fillStyle = color
    ctx.fillRect(screenX, screenY, size, size)
  }
}

// =========================
// DRAW ALL
// =========================
export function drawAll() {

  if (!needsRedraw) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawPixels()
  drawGrid()

  needsRedraw = false
}
