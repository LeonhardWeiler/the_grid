import {
  minimap,
  minimapCtx,
  canvas
} from "../dom"

import {
  GRID_SIZE,
  camera,
  BASE_PIXEL_SIZE
} from "../camera/camera"

import { pixels } from "./render.js"

const MINIMAP_SIZE = 180

minimap.width = MINIMAP_SIZE
minimap.height = MINIMAP_SIZE

export function drawMinimap() {

  minimapCtx.clearRect(
    0,
    0,
    MINIMAP_SIZE,
    MINIMAP_SIZE
  )

  minimapCtx.fillStyle = "#111"

  minimapCtx.fillRect(
    0,
    0,
    MINIMAP_SIZE,
    MINIMAP_SIZE
  )

  const scale =
    MINIMAP_SIZE / GRID_SIZE

  for (const [key, color] of pixels) {

    const [x, y] =
      key.split(":").map(Number)

    minimapCtx.fillStyle = color

    minimapCtx.fillRect(
      x * scale,
      y * scale,
      Math.max(1, scale),
      Math.max(1, scale)
    )
  }

  const visibleWidth =
    canvas.width /
    (BASE_PIXEL_SIZE * camera.zoom)

  const visibleHeight =
    canvas.height /
    (BASE_PIXEL_SIZE * camera.zoom)

  const viewX =
    (camera.x - visibleWidth / 2) * scale

  const viewY =
    (camera.y - visibleHeight / 2) * scale

  const viewW =
    visibleWidth * scale

  const viewH =
    visibleHeight * scale

  minimapCtx.strokeStyle = "white"

  minimapCtx.lineWidth = 1

  minimapCtx.strokeRect(
    viewX,
    viewY,
    viewW,
    viewH
  )
}
