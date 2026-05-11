import { canvas, coordsEl } from "../dom.js"

import {
  camera,
  BASE_PIXEL_SIZE,
  GRID_SIZE,
  clampCamera
} from "./camera.js"

import { screenToWorld } from "../utils/coords.js"
import { requestRender } from "../render/render.js"
import { state } from "../state.js"

let dragging = false

let last = {
  x: 0,
  y: 0
}

export function setupControls() {

  canvas.addEventListener("mousedown", (e) => {
    dragging = true
    last.x = e.clientX
    last.y = e.clientY
  })

  window.addEventListener("mouseup", () => {
    dragging = false
  })

  window.addEventListener("mousemove", (e) => {

    if (dragging) {

      const dx = e.clientX - last.x
      const dy = e.clientY - last.y

      camera.tx -= dx / (BASE_PIXEL_SIZE * camera.tzoom)
      camera.ty -= dy / (BASE_PIXEL_SIZE * camera.tzoom)

      clampCamera()

      last.x = e.clientX
      last.y = e.clientY
    }

    const world = screenToWorld(
      e.clientX,
      e.clientY
    )

    if (
      world.x < 0 ||
      world.x >= GRID_SIZE ||
      world.y < 0 ||
      world.y >= GRID_SIZE
    ) return

    state.hoverPixel = world

    const centeredX =
      world.x - Math.floor(GRID_SIZE / 2)

    const centeredY =
      -(world.y - Math.floor(GRID_SIZE / 2))

    coordsEl.textContent =
      `${centeredX} / ${centeredY}`

    requestRender()
  })

  window.addEventListener("wheel", (e) => {

    e.preventDefault()

    const factor = 1.1

    if (e.deltaY < 0) {
      camera.tzoom *= factor
    } else {
      camera.tzoom /= factor
    }

    camera.tzoom =
      Math.max(0.08, Math.min(2, camera.tzoom))

    clampCamera()

  }, { passive: false })

  window.addEventListener("resize", () => {

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    requestRender()
  })
}
