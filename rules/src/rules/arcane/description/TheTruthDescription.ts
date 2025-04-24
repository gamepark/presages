import { ArcaneCard, hasColor } from '../../../material/ArcaneCard'
import { Color } from '../../../material/Color'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheTruthDescription extends ArcaneEffect {
  canDiscard(card: ArcaneCard): boolean {
    if (!hasColor(card, Color.Yellow)) return false
    return !this.table.some((item) => hasColor(item.id, Color.Yellow) && item.id < card)
  }
}
