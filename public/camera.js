import { canvas } from "./dom.js"

export const GRID_SIZE = 1000
export const BASE_PIXEL_SIZE = 40

export const camera = {
  x: GRID_SIZE / 2,
  y: GRID_SIZE / 2,

  tx: GRID_SIZE / 2,
  ty: GRID_SIZE / 2,

  zoom: 1,
  tzoom: 1
}

export function fitToScreen() {

  camera.zoom = 0.6
  camera.tzoom = 0.6

  camera.x = GRID_SIZE / 2
  camera.y = GRID_SIZE / 2

  camera.tx = GRID_SIZE / 2
  camera.ty = GRID_SIZE / 2
}
