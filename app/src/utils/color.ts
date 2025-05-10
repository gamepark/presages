import { Color } from '@gamepark/presages/material/Color'

export const getHtmlColor = (color: Color) => {
  switch (color) {
    case Color.Green:
      return '#4e9d6e'
    case Color.Yellow:
      return '#df9a21'
    case Color.Red:
      return '#c12844'
    case Color.Blue:
    default:
      return '#37a2d0'
  }
}
