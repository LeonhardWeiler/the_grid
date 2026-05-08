const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const SIZE = 100
const PIXEL = 8

canvas.width = SIZE * PIXEL
canvas.height = SIZE * PIXEL

const ws = new WebSocket("ws://localhost:4000/ws")

let version = 0

function draw(x, y, color) {
  ctx.fillStyle = color
  ctx.fillRect(x * PIXEL, y * PIXEL, PIXEL, PIXEL)
}

ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)

  if (msg.type === "init") {
    version = msg.version

    for (const key in msg.pixels) {
      const [x, y] = key.split(":").map(Number)
      draw(x, y, msg.pixels[key])
    }
  }

  if (msg.type === "pixel_update") {
    if (msg.version > version) {
      version = msg.version
      draw(msg.x, msg.y, msg.color)
    }
  }
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect()

  const x = Math.floor((e.clientX - rect.left) / PIXEL)
  const y = Math.floor((e.clientY - rect.top) / PIXEL)

  ws.send(JSON.stringify({
    type: "set_pixel",
    x,
    y,
    color: "#ff0000"
  }))
})
