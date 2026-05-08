const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let clientId = localStorage.getItem("clientId")

if (!clientId) {
  clientId = crypto.randomUUID()
  localStorage.setItem("clientId", clientId)
}

let cooldownEnd = 0
const cooldownEl = document.getElementById("cooldown")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ws = new WebSocket("ws://localhost:4000/ws")

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "init_client",
    clientId: clientId
  }))
}

// =========================
// WORLD
// =========================
let pixels = new Map()

const GRID_SIZE = 1000

// =========================
// CAMERA
// =========================
let camera = {
  x: GRID_SIZE / 2,
  y: GRID_SIZE / 2,
  zoom: 1
}

const BASE_PIXEL_SIZE = 100

// =========================
// INPUT STATE
// =========================
let dragging = false
let dragMoved = false
let last = { x: 0, y: 0 }

// =========================
// DIRTY FLAGS (OPTIMIZATION)
// =========================
let needsRedraw = true

// =========================
// FIT TO SCREEN (FIXED)
// =========================
function fitToScreen() {
  const scaleX = canvas.width / (GRID_SIZE * BASE_PIXEL_SIZE)
  const scaleY = canvas.height / (GRID_SIZE * BASE_PIXEL_SIZE)

  camera.zoom = Math.min(scaleX, scaleY)

  camera.x = GRID_SIZE / 2
  camera.y = GRID_SIZE / 2

  needsRedraw = true
  drawAll()
}

// =========================
// DRAW GRID (OPTIMIZED)
// =========================
function drawGrid() {
  const step = BASE_PIXEL_SIZE * camera.zoom

  ctx.strokeStyle = "rgba(255,255,255,0.05)"
  ctx.lineWidth = 1

  const offsetX = (camera.x * step)
  const offsetY = (camera.y * step)

  const startX = -offsetX + canvas.width / 2
  const startY = -offsetY + canvas.height / 2

  // 🔥 draw only visible lines
  const cols = Math.ceil(canvas.width / step)
  const rows = Math.ceil(canvas.height / step)

  for (let x = 0; x <= cols; x++) {
    const sx = startX + x * step
    ctx.beginPath()
    ctx.moveTo(sx, 0)
    ctx.lineTo(sx, canvas.height)
    ctx.stroke()
  }

  for (let y = 0; y <= rows; y++) {
    const sy = startY + y * step
    ctx.beginPath()
    ctx.moveTo(0, sy)
    ctx.lineTo(canvas.width, sy)
    ctx.stroke()
  }
}

// =========================
// DRAW PIXELS
// =========================
function drawPixels() {
  for (const [key, color] of pixels) {
    const [x, y] = key.split(":").map(Number)

    const screenX =
      (x - camera.x) * BASE_PIXEL_SIZE * camera.zoom + canvas.width / 2

    const screenY =
      (y - camera.y) * BASE_PIXEL_SIZE * camera.zoom + canvas.height / 2

    const size = BASE_PIXEL_SIZE * camera.zoom

    if (
      screenX < -50 ||
      screenY < -50 ||
      screenX > canvas.width + 50 ||
      screenY > canvas.height + 50
    ) continue

    ctx.fillStyle = color
    ctx.fillRect(screenX, screenY, size, size)
  }
}

// =========================
// MAIN RENDER LOOP (BETTER THAN SPAM REDRAW)
// =========================
function drawAll() {
  if (!needsRedraw) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawPixels()
  drawGrid()

  needsRedraw = false
}

// =========================
// WS
// =========================
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)

  switch (msg.type) {

    case "init": {
      for (const key in msg.pixels) {
        pixels.set(key, msg.pixels[key])
      }
      needsRedraw = true
      drawAll()
      break
    }

    case "pixel_update": {
      const key = `${msg.x}:${msg.y}`
      pixels.set(key, msg.color)

      needsRedraw = true
      drawAll()
      break
    }

    case "sync": {
      if (!Array.isArray(msg.events)) return

      for (const ev of msg.events) {
        const key = `${ev.x}:${ev.y}`
        pixels.set(key, ev.color)
      }

      needsRedraw = true
      drawAll()
      break
    }

    case "cooldown": {
      handleCooldown(msg)
      break
    }
  }
}

function handleCooldown(msg) {
  cooldownEnd = msg.end
  startCooldownUI()
}

// =========================
// CLICK (SAFE + BOUND)
// =========================
canvas.addEventListener("click", (e) => {
  if (Date.now() < cooldownEnd) return  // optional UX guard
  if (dragMoved) return

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
// PAN
// =========================
canvas.addEventListener("mousedown", (e) => {
  dragging = true
  dragMoved = false

  last.x = e.clientX
  last.y = e.clientY
})

window.addEventListener("mouseup", () => {
  dragging = false
})

window.addEventListener("mousemove", (e) => {
  if (!dragging) return

  const dx = e.clientX - last.x
  const dy = e.clientY - last.y

  if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
    dragMoved = true
  }

  camera.x -= dx / (BASE_PIXEL_SIZE * camera.zoom)
  camera.y -= dy / (BASE_PIXEL_SIZE * camera.zoom)

  camera.x = Math.max(0, Math.min(GRID_SIZE, camera.x))
  camera.y = Math.max(0, Math.min(GRID_SIZE, camera.y))

  last.x = e.clientX
  last.y = e.clientY

  needsRedraw = true
  drawAll()
})

// =========================
// ZOOM
// =========================
window.addEventListener("wheel", (e) => {
  e.preventDefault()

  const zoomFactor = 1.1

  if (e.deltaY < 0) camera.zoom *= zoomFactor
  else camera.zoom /= zoomFactor

  camera.zoom = Math.max(0.2, Math.min(5, camera.zoom))

  needsRedraw = true
  drawAll()
}, { passive: false })

let cooldownRunning = false

function startCooldownUI() {
  if (cooldownRunning) return

  cooldownRunning = true
  requestAnimationFrame(updateCooldownUI)
}

function updateCooldownUI() {
  const remaining = cooldownEnd - Date.now()

  if (remaining <= 0) {
    cooldownEnd = 0
    cooldownEl.textContent = "Ready"
    cooldownRunning = false
    return
  }

  cooldownEl.textContent = `Cooldown: ${(remaining / 1000).toFixed(1)}s`

  requestAnimationFrame(updateCooldownUI)
}

// =========================
// INIT
// =========================
fitToScreen()
