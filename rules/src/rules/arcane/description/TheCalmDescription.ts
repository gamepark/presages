import { ArcaneCard, hasColor } from '../../../material/ArcaneCard'
import { Color } from '../../../material/Color'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheCalmDescription extends ArcaneEffect {
  canDiscard(card: ArcaneCard): boolean {
    if (card !== ArcaneCard.TheCalm) return false
    return this.table
      .filter((item) => hasColor(item.id, Color.Red))
      .length > 0
  }
}