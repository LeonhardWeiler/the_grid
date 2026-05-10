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

  // zu weit rausgezoomt
  if (step < 8) return

  ctx.strokeStyle = "rgba(255,255,255,1)"
  ctx.lineWidth = 1

  const startWorldX =
    Math.floor(camera.x - canvas.width / 2 / step)

  const endWorldX =
    Math.ceil(camera.x + canvas.width / 2 / step)

  const startWorldY =
    Math.floor(camera.y - canvas.height / 2 / step)

  const endWorldY =
    Math.ceil(camera.y + canvas.height / 2 / step)

  // verticale linien
  for (let x = startWorldX; x <= endWorldX; x++) {

    const screenX =
      Math.round(
        (x - camera.x) * step +
        canvas.width / 2
      ) + 0.5

    ctx.beginPath()
    ctx.moveTo(screenX, 0)
    ctx.lineTo(screenX, canvas.height)
    ctx.stroke()
  }

  // horizontale linien
  for (let y = startWorldY; y <= endWorldY; y++) {

    const screenY =
      Math.round(
        (y - camera.y) * step +
        canvas.height / 2
      ) + 0.5

    ctx.beginPath()
    ctx.moveTo(0, screenY)
    ctx.lineTo(canvas.width, screenY)
    ctx.stroke()
  }
}

// =========================
// PIXELS
// =========================
function drawPixels() {

  for (const [key, color] of pixels) {

    const [x, y] = key.split(":").map(Number)

    const size =
      BASE_PIXEL_SIZE * camera.zoom

    const screenX =
      (x - camera.x) *
      size +
      canvas.width / 2

    const screenY =
      (y - camera.y) *
      size +
      canvas.height / 2

    // nur skippen wenn komplett außerhalb
    if (
      screenX + size < 0 ||
      screenY + size < 0 ||
      screenX > canvas.width ||
      screenY > canvas.height
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

  // Hintergrund
  ctx.fillStyle = "#111"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Reihenfolge wichtig
  drawGrid()
  drawPixels()

  needsRedraw = false
}
