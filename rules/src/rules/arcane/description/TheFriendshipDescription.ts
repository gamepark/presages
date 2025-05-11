import { ArcaneCard, hasColor } from '../../../material/ArcaneCard'
import { Color } from '../../../material/Color'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheFriendshipDescription extends ArcaneEffect {
  canDiscard(card: ArcaneCard): boolean {
    if (card !== ArcaneCard.TheFriendship) return false
    console.log(card, this.table.length)
    return this.table.filter((item) => hasColor(item.id, Color.Yellow)).length > 0
  }
}
