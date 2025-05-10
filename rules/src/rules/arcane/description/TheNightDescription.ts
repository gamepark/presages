import { ArcaneCard, hasColor } from '../../../material/ArcaneCard'
import { Color } from '../../../material/Color'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheNightDescription extends ArcaneEffect {
  canDiscard(card: ArcaneCard): boolean {
    if (!hasColor(card, Color.Red)) return false
    return !this.table.some((item) => hasColor(item.id, Color.Red) && item.id < card)
  }
}
