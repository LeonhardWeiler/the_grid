import { GRID_SIZE } from "../camera/camera.js"

export function toCenteredCoords(x, y) {
  return {
    x:
      x - Math.floor(GRID_SIZE / 2),

    y:
      -(y - Math.floor(GRID_SIZE / 2))
  }
}
