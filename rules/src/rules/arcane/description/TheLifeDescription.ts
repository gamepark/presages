import { ArcaneCard, hasColor } from '../../../material/ArcaneCard'
import { Color } from '../../../material/Color'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheLifeDescription extends ArcaneEffect {
  canDiscard(card: ArcaneCard): boolean {
    if (!hasColor(card, Color.Green)) return false
    return !this.table.some((item) => hasColor(item.id, Color.Green) && item.id > card)
  }
}
