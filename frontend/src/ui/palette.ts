import { paletteEl } from "../dom"
import { state } from "../state"

export function setupPalette(): void {
  if (!paletteEl) return

  const buttons = paletteEl.querySelectorAll<HTMLButtonElement>(".color")

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.dataset.color
      if (color) {
        state.selectedColor = color
      }

      buttons.forEach((b) => b.classList.remove("active"))

      button.classList.add("active")
    })
  })

  buttons[0]?.classList.add("active")
}
