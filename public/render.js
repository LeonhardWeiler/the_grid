import { canvas, ctx } from "./dom.js"

import {
  camera,
  BASE_PIXEL_SIZE,
  GRID_SIZE
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

  const baseStep =
    BASE_PIXEL_SIZE * camera.zoom

  // dynamischer Abstand
  let cellStep = 1
  let step = baseStep

  while (step < 12) {
    cellStep *= 2
    step = baseStep * cellStep
  }

  ctx.strokeStyle = "rgba(255,255,255,0.15)"
  ctx.lineWidth = 1

  const visibleWidth =
    canvas.width / baseStep

  const visibleHeight =
    canvas.height / baseStep

  const startWorldX =
    Math.max(
      0,
      Math.floor(camera.x - visibleWidth / 2)
    )

  const endWorldX =
    Math.min(
      GRID_SIZE,
      Math.ceil(camera.x + visibleWidth / 2)
    )

  const startWorldY =
    Math.max(
      0,
      Math.floor(camera.y - visibleHeight / 2)
    )

  const endWorldY =
    Math.min(
      GRID_SIZE,
      Math.ceil(camera.y + visibleHeight / 2)
    )

  // vertikale Linien
  for (
    let x =
      Math.floor(startWorldX / cellStep) * cellStep;
    x <= endWorldX;
    x += cellStep
  ) {

    const screenX =
      Math.round(
        (x - camera.x) * baseStep +
        canvas.width / 2
      ) + 0.5

    ctx.beginPath()
    ctx.moveTo(screenX, 0)
    ctx.lineTo(screenX, canvas.height)
    ctx.stroke()
  }

  // horizontale Linien
  for (
    let y =
      Math.floor(startWorldY / cellStep) * cellStep;
    y <= endWorldY;
    y += cellStep
  ) {

    const screenY =
      Math.round(
        (y - camera.y) * baseStep +
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
