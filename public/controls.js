import { canvas } from "./dom.js"

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

    camera.x -= dx / (BASE_PIXEL_SIZE * camera.zoom)
    camera.y -= dy / (BASE_PIXEL_SIZE * camera.zoom)

    camera.x =
      Math.max(0, Math.min(GRID_SIZE, camera.x))

    camera.y =
      Math.max(0, Math.min(GRID_SIZE, camera.y))

    last.x = e.clientX
    last.y = e.clientY

    setNeedsRedraw(true)
    drawAll()
  })

  window.addEventListener("resize", () => {

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    setNeedsRedraw(true)
    drawAll()
  })
}

// =========================
// ZOOM
// =========================
export function setupZoomControls() {

  window.addEventListener("wheel", (e) => {

    e.preventDefault()

    const zoomFactor = 1.1

    if (e.deltaY < 0) {
      camera.zoom *= zoomFactor
    } else {
      camera.zoom /= zoomFactor
    }

    camera.zoom =
      Math.max(0.05, Math.min(2, camera.zoom))

    setNeedsRedraw(true)
    drawAll()

  }, { passive: false })
}
