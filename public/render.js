import { canvas, ctx } from "./dom.js"
import { camera, BASE_PIXEL_SIZE, GRID_SIZE } from "./camera.js"

export const pixels = new Map()

let needsRedraw = true

export function setNeedsRedraw(v) {
  needsRedraw = v
}

// =========================
// GRID
// =========================
function drawGrid() {

  const baseStep = BASE_PIXEL_SIZE * camera.zoom

  let cellStep = 1
  let step = baseStep

  while (step < 12) {
    cellStep *= 2
    step = baseStep * cellStep
  }

  ctx.strokeStyle = "rgba(255,255,255,0.15)"
  ctx.lineWidth = 1

  const visibleWidth = canvas.width / baseStep
  const visibleHeight = canvas.height / baseStep

  const startWorldX = Math.max(0, Math.floor(camera.x - visibleWidth / 2))
  const endWorldX = Math.min(GRID_SIZE, Math.ceil(camera.x + visibleWidth / 2))

  const startWorldY = Math.max(0, Math.floor(camera.y - visibleHeight / 2))
  const endWorldY = Math.min(GRID_SIZE, Math.ceil(camera.y + visibleHeight / 2))

  for (
    let x = Math.floor(startWorldX / cellStep) * cellStep;
    x <= endWorldX;
    x += cellStep
  ) {

    const screenX =
      (x - camera.x) * baseStep + canvas.width / 2

    ctx.beginPath()
    ctx.moveTo(screenX, 0)
    ctx.lineTo(screenX, canvas.height)
    ctx.stroke()
  }

  for (
    let y = Math.floor(startWorldY / cellStep) * cellStep;
    y <= endWorldY;
    y += cellStep
  ) {

    const screenY =
      (y - camera.y) * baseStep + canvas.height / 2

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

  const size = BASE_PIXEL_SIZE * camera.zoom

  for (const [key, color] of pixels) {

    const [x, y] = key.split(":").map(Number)

    const screenX = (x - camera.x) * size + canvas.width / 2
    const screenY = (y - camera.y) * size + canvas.height / 2

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
// PREVIEW
// =========================
function drawPreview(hoverPixel, selectedPixel) {

  const size = BASE_PIXEL_SIZE * camera.zoom

  // HOVER
  if (hoverPixel) {
    const x = (hoverPixel.x - camera.x) * size + canvas.width / 2
    const y = (hoverPixel.y - camera.y) * size + canvas.height / 2

    ctx.fillStyle = "rgba(255,255,255,0.2)"
    ctx.fillRect(x, y, size, size)
  }

  // SELECTED
  if (selectedPixel) {
    const x = (selectedPixel.x - camera.x) * size + canvas.width / 2
    const y = (selectedPixel.y - camera.y) * size + canvas.height / 2

    ctx.strokeStyle = "yellow"
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, size, size)
  }
}

// =========================
// DRAW ALL
// =========================
export function drawAll(hoverPixel = null, selectedPixel = null) {

  ctx.fillStyle = "#111"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  drawGrid()
  drawPixels()
  drawPreview(hoverPixel, selectedPixel)

  needsRedraw = false
}
