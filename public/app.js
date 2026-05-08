const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const GRID_SIZE = 100
const PIXEL_SIZE = 8

canvas.width = GRID_SIZE * PIXEL_SIZE
canvas.height = GRID_SIZE * PIXEL_SIZE

const ws = new WebSocket("ws://localhost:4000/ws")

function drawPixel(x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(
    x * PIXEL_SIZE,
    y * PIXEL_SIZE,
    PIXEL_SIZE,
    PIXEL_SIZE
  )
}

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)

  if (msg.type === "init") {
    for (const key in msg.pixels) {
      const [x, y] = key.split(":").map(Number)
      drawPixel(x, y, msg.pixels[key])
    }
  }

  if (msg.type === "pixel_update") {
    drawPixel(msg.x, msg.y, msg.color)
  }
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect()

  const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE)
  const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE)

  ws.send(JSON.stringify({
    type: "set_pixel",
    x,
    y,
    color: "#ff0000"
  }))
})
