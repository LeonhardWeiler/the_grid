import {
  canvas,
  ctx,
  cooldownEl,
  coordsEl
} from "./dom.js"

import {
  camera,
  BASE_PIXEL_SIZE,
  GRID_SIZE
} from "./camera.js"

import {
  drawAll,
  setNeedsRedraw
} from "./render.js"

// =========================
// STATE
// =========================
let dragging = false
let last = { x: 0, y: 0 }

// =========================
// PAN
// =========================
export function setupPanControls() {

  canvas.addEventListener("mousedown", (e) => {

    dragging = true

    last.x = e.clientX
    last.y = e.clientY
  })

  window.addEventListener("mouseup", () => {
    dragging = false
  })

  window.addEventListener("mousemove", (e) => {

    if (!dragging) return

    const dx = e.clientX - last.x
    const dy = e.clientY - last.y

    camera.tx -= dx / (BASE_PIXEL_SIZE * camera.tzoom)
    camera.ty -= dy / (BASE_PIXEL_SIZE * camera.tzoom)

    clampCamera();

    camera.tx =
      Math.max(0, Math.min(GRID_SIZE, camera.tx))

    camera.ty =
      Math.max(0, Math.min(GRID_SIZE, camera.ty))

    last.x = e.clientX
    last.y = e.clientY

    setNeedsRedraw(true)
    drawAll()
  })

  canvas.addEventListener("mousemove", (e) => {

    const worldX = Math.floor(
      (e.clientX - canvas.width / 2) /
      (BASE_PIXEL_SIZE * camera.zoom) +
      camera.x
    )

    const worldY = Math.floor(
      (e.clientY - canvas.height / 2) /
      (BASE_PIXEL_SIZE * camera.zoom) +
      camera.y
    )

    // Mittelpunkt auf 0/0 verschieben
    const centeredX =
      worldX - Math.floor(GRID_SIZE / 2)

    const centeredY =
      -(worldY - Math.floor(GRID_SIZE / 2))

    coordsEl.textContent =
      `${centeredX} / ${centeredY}`
  })

  window.addEventListener("resize", () => {

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    setNeedsRedraw(true)
    drawAll()
  })
}

function clampCamera() {

  const visibleWidth =
    canvas.width / (BASE_PIXEL_SIZE * camera.zoom)

  const visibleHeight =
    canvas.height / (BASE_PIXEL_SIZE * camera.zoom)

  const halfW = visibleWidth / 2
  const halfH = visibleHeight / 2

  camera.tx = Math.max(
    halfW,
    Math.min(GRID_SIZE - halfW, camera.tx)
  )

  camera.ty = Math.max(
    halfH,
    Math.min(GRID_SIZE - halfH, camera.ty)
  )
}

// =========================
// ZOOM
// =========================
export function setupZoomControls() {

  window.addEventListener("wheel", (e) => {

    e.preventDefault()

    const zoomFactor = 1.1

    if (e.deltaY < 0) {
      camera.tzoom *= zoomFactor
    } else {
      camera.tzoom /= zoomFactor
    }

    camera.tzoom =
      Math.max(0.08, Math.min(2, camera.tzoom))

    clampCamera();

  }, { passive: false })
}
