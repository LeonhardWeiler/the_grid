import { canvas, coordsEl } from "../dom"
import { toCenteredCoords } from "../utils/gridCoords"

import {
  camera,
  BASE_PIXEL_SIZE,
  GRID_SIZE,
  clampCamera
} from "./camera.js"

import { screenToWorld } from "../utils/coords"
import { requestRender } from "../render/render.js"
import { state } from "../state"

let dragging = false
let moved = false

let last = {
  x: 0,
  y: 0
}

export function setupControls() {

  canvas.addEventListener("mousedown", (e) => {
    dragging = true
    moved = false

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

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        moved = true
      }

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
    ) {

      if (state.hoverPixel !== null) {
        state.hoverPixel = null
        requestRender()
      }

      return
    }

    state.hoverPixel = world

    const centered = toCenteredCoords(world.x, world.y)

    coordsEl.textContent = `${centered.x} / ${centered.y}`

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

export function didDrag() {
  return moved
}
