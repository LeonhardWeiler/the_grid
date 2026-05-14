import { pixels, requestRender } from "./render/render.js"
import { setCooldown } from "./ui/cooldown"

interface InitMessage {
  type: "init_client"
  clientId: string
}

interface PixelMessage {
  type: "init" | "pixel_update" | "sync" | "cooldown"
  pixels?: Record<string, string>
  x?: number
  y?: number
  color?: string
  events?: { x: number; y: number; color: string }[]
  end?: number
}

export function createWS(clientId: string) {
  let ws: WebSocket | null = null

  function connect() {
    ws = new WebSocket("ws://localhost:4000/ws")

    ws.onopen = () => {
      const msg: InitMessage = { type: "init_client", clientId }
      ws?.send(JSON.stringify(msg))
    }

    ws.onmessage = (e: MessageEvent) => {
      const msg: PixelMessage = JSON.parse(e.data)

      switch (msg.type) {
        case "init": {
          pixels.clear()
          if (msg.pixels) {
            for (const key in msg.pixels) {
              pixels.set(key, msg.pixels[key])
            }
          }
          requestRender()
          break
        }

        case "pixel_update": {
          if (msg.x !== undefined && msg.y !== undefined && msg.color) {
            pixels.set(`${msg.x}:${msg.y}`, msg.color)
            requestRender()
          }
          break
        }

        case "sync": {
          if (msg.events) {
            for (const ev of msg.events) {
              pixels.set(`${ev.x}:${ev.y}`, ev.color)
            }
            requestRender()
          }
          break
        }

        case "cooldown": {
          if (msg.end !== undefined) {
            setCooldown(msg.end)
          }
          break
        }
      }
    }

    ws.onclose = () => {
      setTimeout(connect, 1000)
    }
  }

  connect()

  return {
    send(data: string | ArrayBuffer | Blob) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
    }
  }
}
