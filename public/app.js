const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ws = new WebSocket("ws://localhost:4000/ws")

// 🧠 WORLD STATE (1000x1000 bounded)
let pixels = new Map()

const GRID_SIZE = 100

// 📦 CAMERA
let camera = {
  x: GRID_SIZE / 2,
  y: GRID_SIZE / 2,
  zoom: 1
}

// 🎯 SETTINGS
const BASE_PIXEL_SIZE = 20

// 🧠 DRAG STATE
let dragging = false
let dragMoved = false
let last = { x: 0, y: 0 }

// =========================
// DRAW
// =========================

function drawGrid() {
  const size = BASE_PIXEL_SIZE * camera.zoom

  ctx.strokeStyle = "rgba(255,255,255,0.05)"
  ctx.lineWidth = 1

  const startX = -camera.x
  const startY = -camera.y

  for (let x = 0; x <= 1000; x++) {
    const sx =
      (x - camera.x) * size + canvas.width / 2

    ctx.beginPath()
    ctx.moveTo(sx, 0)
    ctx.lineTo(sx, canvas.height)
    ctx.stroke()
  }

  for (let y = 0; y <= 1000; y++) {
    const sy =
      (y - camera.y) * size + canvas.height / 2

    ctx.beginPath()
    ctx.moveTo(0, sy)
    ctx.lineTo(canvas.width, sy)
    ctx.stroke()
  }
}

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const [key, color] of pixels) {
    const [x, y] = key.split(":").map(Number)

    const screenX =
      (x - camera.x) * BASE_PIXEL_SIZE * camera.zoom + canvas.width / 2

    const screenY =
      (y - camera.y) * BASE_PIXEL_SIZE * camera.zoom + canvas.height / 2

    const size = BASE_PIXEL_SIZE * camera.zoom

    // frustum culling
    if (
      screenX < -50 ||
      screenY < -50 ||
      screenX > canvas.width + 50 ||
      screenY > canvas.height + 50
    ) continue

    ctx.fillStyle = color
    ctx.fillRect(screenX, screenY, size, size)
  }

  // optional: draw grid border
  ctx.strokeStyle = "#333"
  ctx.strokeRect(
    (0 - camera.x) * BASE_PIXEL_SIZE * camera.zoom + canvas.width / 2,
    (0 - camera.y) * BASE_PIXEL_SIZE * camera.zoom + canvas.height / 2,
    GRID_SIZE * BASE_PIXEL_SIZE * camera.zoom,
    GRID_SIZE * BASE_PIXEL_SIZE * camera.zoom
  )

  drawGrid()
}

// =========================
// WS
// =========================
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)

  if (msg.type === "init") {
    for (const key in msg.pixels) {
      pixels.set(key, msg.pixels[key])
    }
    drawAll()
  }

  if (msg.type === "pixel_update") {
    const key = `${msg.x}:${msg.y}`
    pixels.set(key, msg.color)
    drawAll()
  }

  if (msg.type === "sync") {
    if (!Array.isArray(msg.events)) return

    for (const ev of msg.events) {
      const key = `${ev.x}:${ev.y}`
      pixels.set(key, ev.color)
    }

    drawAll()
  }
}

// =========================
// CLICK (BOUNDED GRID)
// =========================
canvas.addEventListener("click", (e) => {
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

  // 🚨 BOUND CHECK (1000x1000)
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
// PAN (CLAMPED CAMERA)
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

  // 🚨 CLAMP CAMERA to GRID
  camera.x = Math.max(0, Math.min(GRID_SIZE, camera.x))
  camera.y = Math.max(0, Math.min(GRID_SIZE, camera.y))

  last.x = e.clientX
  last.y = e.clientY

  drawAll()
})

// =========================
// ZOOM
// =========================
window.addEventListener("wheel", (e) => {
  e.preventDefault()

  const zoomFactor = 1.1

  if (e.deltaY < 0) {
    camera.zoom *= zoomFactor
  } else {
    camera.zoom /= zoomFactor
  }

  camera.zoom = Math.max(0.2, Math.min(5, camera.zoom))

  drawAll()
}, { passive: false })

fitToScreen()
