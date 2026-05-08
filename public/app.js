const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

// 🔥 große Canvas Fläche (Test: bewusst groß)
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ws = new WebSocket("ws://localhost:4000/ws")

// 🧠 WORLD STATE
let pixels = new Map()

// 📦 CAMERA
let camera = {
  x: 0,
  y: 0,
  zoom: 1
}

// 🎯 SETTINGS
const BASE_PIXEL_SIZE = 20

// =========================
// DRAW
// =========================
function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const [key, color] of pixels) {
    const [x, y] = key.split(":").map(Number)

    const screenX = (x - camera.x) * BASE_PIXEL_SIZE * camera.zoom + canvas.width / 2
    const screenY = (y - camera.y) * BASE_PIXEL_SIZE * camera.zoom + canvas.height / 2

    const size = BASE_PIXEL_SIZE * camera.zoom

    // 🔥 frustum culling (nur sichtbare pixels)
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
// CLICK → WORLD COORDS
// =========================
canvas.addEventListener("click", (e) => {
  const worldX =
    Math.floor((e.clientX - canvas.width / 2) / (BASE_PIXEL_SIZE * camera.zoom) + camera.x)

  const worldY =
    Math.floor((e.clientY - canvas.height / 2) / (BASE_PIXEL_SIZE * camera.zoom) + camera.y)

  ws.send(JSON.stringify({
    type: "set_pixel",
    x: worldX,
    y: worldY,
    color: "#ff0000"
  }))
})

// =========================
// PAN (drag)
// =========================
let dragging = false
let last = { x: 0, y: 0 }

canvas.addEventListener("mousedown", (e) => {
  dragging = true
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

  camera.x -= dx / (BASE_PIXEL_SIZE * camera.zoom)
  camera.y -= dy / (BASE_PIXEL_SIZE * camera.zoom)

  last.x = e.clientX
  last.y = e.clientY

  drawAll()
})

// =========================
// ZOOM (mouse wheel)
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
