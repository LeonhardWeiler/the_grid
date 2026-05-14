import { paletteEl } from "../dom"
import { state } from "../state"

export function setupPalette() {

  const buttons =
    paletteEl.querySelectorAll(".color")

  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      state.selectedColor =
        button.dataset.color

      buttons.forEach((b) => {
        b.classList.remove("active")
      })

      button.classList.add("active")
    })
  })

  buttons[0]?.classList.add("active")
}
