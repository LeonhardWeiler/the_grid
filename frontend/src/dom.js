export const canvas = document.getElementById("canvas")
export const ctx = canvas.getContext("2d")
export const cooldownEl = document.getElementById("cooldown")
export const coordsEl = document.getElementById("coords")
export const paletteEl = document.getElementById("palette")
export const minimap = document.getElementById("minimap")
export const minimapCtx = minimap.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight
