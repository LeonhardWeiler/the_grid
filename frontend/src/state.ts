export interface Pixel {
  x: number
  y: number
}

export const state = {
  hoverPixel: null as Pixel | null,
  selectedPixel: null as Pixel | null,
  selectedColor: "#ff0000",
}
