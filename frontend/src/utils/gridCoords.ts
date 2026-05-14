import { GRID_SIZE } from "../camera/camera"

export interface Pixel {
  x: number
  y: number
}

export function toCenteredCoords(x: number, y: number): Pixel {
  return {
    x: x - Math.floor(GRID_SIZE / 2),
    y: -(y - Math.floor(GRID_SIZE / 2))
  }
}
