import {
  canvas,
  ctx,
  cooldownEl,
  coordsEl
} from "./dom.js"

import {
  camera,
  BASE_PIXEL_SIZE,
  GRID_SIZE,
  fitToScreen
} from "./camera.js"

import {
  pixels,
  drawAll,
  setNeedsRedraw
} from "./render.js"

import {
  cooldownEndRef,
  handleCooldown
} from "./cooldown.js"

import {
  setupPanControls,
  setupZoomControls
} from "./controls.js"

// =========================
// CLIENT ID
// =========================
let clientId = localStorage.getItem("clientId")

if (!clientId) {
  clientId = crypto.randomUUID()
  localStorage.setItem("clientId", clientId)
}

// =========================
// STATE
// =========================
let selectedPixel = null
let hoverPixel = null

// =========================
// WS
// =========================
const ws = new WebSocket("ws://localhost:4000/ws")

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "init_client",
    clientId
  }))
}

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)

  switch (msg.type) {

    case "init": {
      for (const key in msg.pixels) {
        pixels.set(key, msg.pixels[key])
      }
      setNeedsRedraw(true)
      drawAll(hoverPixel, selectedPixel)
      break
    }

    case "pixel_update": {
      const key = `${msg.x}:${msg.y}`
      pixels.set(key, msg.color)

      setNeedsRedraw(true)
      drawAll(hoverPixel, selectedPixel)
      break
    }

    case "sync": {
      if (!Array.isArray(msg.events)) return

      for (const ev of msg.events) {
        const key = `${ev.x}:${ev.y}`
        pixels.set(key, ev.color)
      }

      setNeedsRedraw(true)
      drawAll(hoverPixel, selectedPixel)
      break
    }

    case "cooldown": {
      handleCooldown(msg)
      break
    }
  }
}

// =========================
// MOUSE MOVE (HOVER PREVIEW)
// =========================
canvas.addEventListener("mousemove", (e) => {

  const worldX = Math.floor(
    (e.clientX - canvas.width / 2) /
    (BASE_PIXEL_SIZE * camera.zoom) +
    camera.x
  )

  const worldY = Math.floor(
    (e.clientY - canvas.height / 2) /
    (BASE_PIXEL_SIZE * camera.zoom) +
    camera.y
  )

  if (
    worldX < 0 || worldX >= GRID_SIZE ||
    worldY < 0 || worldY >= GRID_SIZE
  ) return

  hoverPixel = { x: worldX, y: worldY }

  setNeedsRedraw(true)
  drawAll(hoverPixel, selectedPixel)
})

// =========================
// CLICK (SELECT)
// =========================
canvas.addEventListener("click", (e) => {

  const worldX = Math.floor(
    (e.clientX - canvas.width / 2) /
    (BASE_PIXEL_SIZE * camera.zoom) +
    camera.x
  )

  const worldY = Math.floor(
    (e.clientY - canvas.height / 2) /
    (BASE_PIXEL_SIZE * camera.zoom) +
    camera.y
  )

  if (
    worldX < 0 || worldX >= GRID_SIZE ||
    worldY < 0 || worldY >= GRID_SIZE
  ) return

  selectedPixel = { x: worldX, y: worldY }

  updateButtonUI()
})

// =========================
// CONFIRM BUTTON
// =========================

function confirmPixel() {

  if (!selectedPixel) return

  const now = Date.now()

  if (now < cooldownEndRef.value) return

  ws.send(JSON.stringify({
    type: "set_pixel",
    x: selectedPixel.x,
    y: selectedPixel.y,
    color: "#ff0000"
  }))

  selectedPixel = null
  updateButtonUI()
}

cooldownEl.addEventListener("click", () => {
  confirmPixel()
})

window.addEventListener("keydown", (e) => {

  if (e.code !== "Space") return

  // verhindert Scrollen
  e.preventDefault()

  confirmPixel()
})

// =========================
// UI
// =========================

function updateButtonUI() {

  const now = Date.now()
  const remaining = cooldownEndRef.value - now

  // =========================
  // COOLDOWN ACTIVE
  // =========================
  if (remaining > 0) {

    cooldownEl.textContent =
      `Cooldown: ${(remaining / 1000).toFixed(1)}s`

    cooldownEl.classList.add("disabled")
    return
  }

  // =========================
  // READY STATE
  // =========================
  cooldownEl.classList.remove("disabled")

  if (!selectedPixel) {
    cooldownEl.textContent = "Select Pixel"
  } else {
    cooldownEl.textContent =
      `Click to accept (${selectedPixel.x}/${selectedPixel.y})`
  }
}

// =========================
// CONTROLS
// =========================
setupPanControls()
setupZoomControls()

// =========================
// INIT
// =========================
fitToScreen()
drawAll(null, null)

function updateCamera() {

  camera.x += (camera.tx - camera.x) * 0.15
  camera.y += (camera.ty - camera.y) * 0.15

  camera.zoom += (camera.tzoom - camera.zoom) * 0.15

  setNeedsRedraw(true)
  drawAll(hoverPixel, selectedPixel)

  requestAnimationFrame(updateCamera)
}

updateCamera()

function uiLoop() {
  updateButtonUI()
  requestAnimationFrame(uiLoop)
}

uiLoop()
