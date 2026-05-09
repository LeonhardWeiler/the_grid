import { canvas, ctx, cooldownEl } from "./dom.js"
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
// WS
// =========================
const ws = new WebSocket("ws://localhost:4000/ws")

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "init_client",
    clientId: clientId
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
      drawAll()
      break
    }

    case "pixel_update": {
      const key = `${msg.x}:${msg.y}`

      pixels.set(key, msg.color)

      setNeedsRedraw(true)
      drawAll()

      break
    }

    case "sync": {
      if (!Array.isArray(msg.events)) return

      for (const ev of msg.events) {
        const key = `${ev.x}:${ev.y}`
        pixels.set(key, ev.color)
      }

      setNeedsRedraw(true)
      drawAll()

      break
    }

    case "cooldown": {
      handleCooldown(msg)
      break
    }
  }
}

// =========================
// CLICK
// =========================
canvas.addEventListener("click", (e) => {

  if (Date.now() < cooldownEndRef.value) return

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

  ws.send(JSON.stringify({
    type: "set_pixel",
    x: worldX,
    y: worldY,
    color: "#ff0000"
  }))
})

// =========================
// CONTROLS
// =========================
setupPanControls()
setupZoomControls()

// =========================
// INIT
// =========================
fitToScreen()
drawAll()
