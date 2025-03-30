import { ArcaneCard, hasColor } from '../../../material/ArcaneCard'
import { Color } from '../../../material/Color'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheFeastDescription extends ArcaneEffect {
  canDiscard(card: ArcaneCard): boolean {
    if (card !== ArcaneCard.TheFeast) return false
    return this
      .table
      .some((item) => hasColor(item.id, Color.Blue))
  }
}