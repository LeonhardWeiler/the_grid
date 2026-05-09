import { canvas } from "./dom.js"

export const GRID_SIZE = 1000
export const BASE_PIXEL_SIZE = 40

export const camera = {
  x: GRID_SIZE / 2,
  y: GRID_SIZE / 2,
  zoom: 1
}

export function fitToScreen() {

  // schöner Startzoom
  camera.zoom = 0.5

  camera.x = GRID_SIZE / 2
  camera.y = GRID_SIZE / 2
}
