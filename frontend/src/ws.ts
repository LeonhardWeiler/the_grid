import { pixels, requestRender } from "./render/render"
import { setCooldown } from "./ui/cooldown"
import { connection } from "./state"

interface InitMessage {
  type: "init_client"
  clientId: string
  lastVersion: number
}

interface PixelMessage {
  type: "init" | "pixel_update" | "sync" | "cooldown"
  version?: number
  pixels?: Record<string, string>
  x?: number
  y?: number
  color?: string
  events?: { version: number; x: number; y: number; color: string}[]
  end?: number
  cooldownEnd?: number
}

export function createWS(clientId: string) {
  let ws: WebSocket | null = null
  let version = Number(localStorage.getItem("version")) || 0

  function connect() {
    ws = new WebSocket("ws://localhost:4000/ws")
    connection.status = "connecting"

    ws.onopen = () => {
      connection.status = "handshaking"

      const msg: InitMessage = {
        type: "init_client",
        clientId,
        lastVersion: version
      }

      ws?.send(JSON.stringify(msg))
    }

    ws.onmessage = (e: MessageEvent) => {
      const msg: PixelMessage = JSON.parse(e.data)

      switch (msg.type) {
        case "init": {
          pixels.clear()
          if (msg.pixels) {
            for (const key in msg.pixels) {
              msg.pixels[key] && pixels.set(key, msg.pixels[key])
            }
          }
          requestRender()
          if (msg.cooldownEnd !== undefined) {
            setCooldown(msg.cooldownEnd)
          }
          if (msg.version !== undefined) {
            version = msg.version
            localStorage.setItem(
              "version",
              String(version)
            )
          }

          connection.status = "connected"
          break
        }

        case "pixel_update": {
          if (msg.x !== undefined && msg.y !== undefined && msg.color) {
            pixels.set(`${msg.x}:${msg.y}`, msg.color)
            requestRender()
            if (msg.version !== undefined) {
              version = msg.version

              localStorage.setItem(
                "version",
                String(version)
              )
            }
          }
          break
        }

        case "sync": {
          if (msg.events) {
            for (const ev of msg.events) {
              pixels.set(`${ev.x}:${ev.y}`, ev.color)
            }
            requestRender()
            if (msg.version !== undefined) {
              version = msg.version

              localStorage.setItem(
                "version",
                String(version)
              )
            }
          }

          connection.status = "connected"
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
      connection.status = "reconnecting"

      setTimeout(() => {
        connect()
      }, 1000)
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
