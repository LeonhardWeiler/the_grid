const canvasEl = document.getElementById("canvas")
if (!(canvasEl instanceof HTMLCanvasElement)) {
  throw new Error("Canvas element not found")
}
export const canvas: HTMLCanvasElement = canvasEl

const ctxEl = canvas.getContext("2d")
if (!ctxEl) {
  throw new Error("2D context not available")
}
export const ctx: CanvasRenderingContext2D = ctxEl

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const minimapEl = document.getElementById("minimap")
if (!(minimapEl instanceof HTMLCanvasElement)) {
  throw new Error("Minimap element not found")
}
export const minimap: HTMLCanvasElement = minimapEl

const minimapCtxEl = minimap.getContext("2d")
if (!minimapCtxEl) {
  throw new Error("Minimap 2D context not available")
}
export const minimapCtx: CanvasRenderingContext2D = minimapCtxEl

const cooldownElRaw = document.getElementById("cooldown")
if (!(cooldownElRaw instanceof HTMLElement)) {
  throw new Error("Cooldown element not found")
}
export const cooldownEl: HTMLElement = cooldownElRaw

const coordsElRaw = document.getElementById("coords")
if (!(coordsElRaw instanceof HTMLElement)) {
  throw new Error("Coords element not found")
}
export const coordsEl: HTMLElement = coordsElRaw

const paletteElRaw = document.getElementById("palette")
if (!(paletteElRaw instanceof HTMLElement)) {
  throw new Error("Palette element not found")
}
export const paletteEl: HTMLElement = paletteElRaw
