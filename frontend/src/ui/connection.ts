import { connectionOverlay, connectionWarning } from "../dom"
import { connection } from "../state"

export function updateConnectionUI(): void {
  if (!connectionOverlay || !connectionWarning) return

  if (connection.status === "connected") {
    connectionOverlay.style.display = "none"
    return
  }

  connectionOverlay.style.display = "flex"

  if (connection.status === "connecting") {
    connectionWarning.textContent = "🔄 Connecting..."
  }

  if (connection.status === "disconnected") {
    connectionWarning.textContent = "⚠️ Disconnected – reconnecting..."
  }
}
