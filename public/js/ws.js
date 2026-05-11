import { pixels, requestRender } from "./render/render.js"
import { setCooldown } from "./ui/cooldown.js"

export function createWS(clientId) {

  const ws =
    new WebSocket("ws://localhost:4000/ws")

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

        requestRender()
        break
      }

      case "pixel_update": {
        pixels.set(
          `${msg.x}:${msg.y}`,
          msg.color
        )

        requestRender()
        break
      }

      case "sync": {
        for (const ev of msg.events) {
          pixels.set(
            `${ev.x}:${ev.y}`,
            ev.color
          )
        }

        requestRender()
        break
      }

      case "cooldown": {
        setCooldown(msg.end)
        break
      }
    }
  }

  return ws
}
