import { ArcaneCard, hasColor } from '../../../material/ArcaneCard'
import { Color } from '../../../material/Color'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheLoveDescription extends ArcaneEffect {
  canDiscard(card: ArcaneCard): boolean {
    if (card !== ArcaneCard.TheLove) return false
    return this.table
      .filter((item) => hasColor(item.id, Color.Green))
      .length > 1
  }
}