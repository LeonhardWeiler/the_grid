import { canvas, ctx } from "../dom"

import {
  camera,
  BASE_PIXEL_SIZE,
  GRID_SIZE
} from "../camera/camera"

export function drawGrid() {

  const baseStep =
    BASE_PIXEL_SIZE * camera.zoom

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

  for (
    let x = Math.floor(startWorldX / cellStep) * cellStep;
    x <= endWorldX;
    x += cellStep
  ) {

    const screenX =
      (x - camera.x) * baseStep +
      canvas.width / 2

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
      (y - camera.y) * baseStep +
      canvas.height / 2

    ctx.beginPath()
    ctx.moveTo(0, screenY)
    ctx.lineTo(canvas.width, screenY)
    ctx.stroke()
  }
}
