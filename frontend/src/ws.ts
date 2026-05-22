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

let manuallyClosed = false

export function createWS(clientId: string) {
  let ws: WebSocket | null = null
  let version = Number(localStorage.getItem("version")) || 0
  let reconnectDelay = 1000
  let reconnectTimer: number | null = null
  let isSynced = false

  function connect() {
    if (!window.navigator.onLine) {
      connection.status = "disconnected"
      return
    }

    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return
    }

    ws = new WebSocket(`ws://${window.location.hostname}:4000/ws`)
    isSynced = false
    connection.status = "connecting"

    ws.onopen = () => {
      connection.status = "handshaking"
      version = Number(localStorage.getItem("version")) || 0

      const msg: InitMessage = {
        type: "init_client",
        clientId,
        lastVersion: version
      }

      ws?.send(JSON.stringify(msg))
    }

    ws.onmessage = (e: MessageEvent) => {
      let msg: PixelMessage
      try {
        msg = JSON.parse(e.data)
      } catch {
        return
      }

      switch (msg.type) {
        case "init": {
          pixels.clear()
          if (msg.pixels) {
            for (const key in msg.pixels) {
              msg.pixels[key] && pixels.set(key, msg.pixels[key])
            }
          }
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

          requestRender()
          isSynced = false
          connection.status = "connected"
          reconnectDelay = 1000
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
            if (msg.version !== undefined) {
              version = msg.version

              localStorage.setItem(
                "version",
                String(version)
              )
            }
          }

          requestRender()
          isSynced = true
          connection.status = "connected"
          reconnectDelay = 1000
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
      if (manuallyClosed || !window.navigator.onLine) {
        connection.status = "disconnected"
        return
      }

      connection.status = "reconnecting"

      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }

      const jitter = Math.random() * 500
      const delay = reconnectDelay + jitter

      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = null
        connect()
      }, delay)

      reconnectDelay = Math.min(
        reconnectDelay * 2,
        15000
      )
    }

    ws.onerror = () => {
      ws?.close()
    }
  }

  window.addEventListener("online", () => {
    manuallyClosed = false
    if (connection.status === "disconnected") {
      connect()
    }
  })

  window.addEventListener("offline", () => {
    manuallyClosed = true
    connection.status = "disconnected"
  })

  connect()

  return {
    send(data: string | ArrayBuffer | Blob) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
    }
  }
}
