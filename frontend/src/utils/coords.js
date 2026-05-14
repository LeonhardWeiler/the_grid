import { canvas } from "../dom"
import { camera, BASE_PIXEL_SIZE } from "../camera/camera.js"

export function screenToWorld(clientX, clientY) {
  return {
    x: Math.floor(
      (clientX - canvas.width / 2) /
      (BASE_PIXEL_SIZE * camera.zoom) +
      camera.x
    ),

    y: Math.floor(
      (clientY - canvas.height / 2) /
      (BASE_PIXEL_SIZE * camera.zoom) +
      camera.y
    )
  }
}

export function worldToScreen(x, y) {
  const size = BASE_PIXEL_SIZE * camera.zoom

  return {
    x: (x - camera.x) * size + canvas.width / 2,
    y: (y - camera.y) * size + canvas.height / 2,
    size
  }
}
