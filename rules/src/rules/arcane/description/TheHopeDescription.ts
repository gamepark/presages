import { ArcaneCard } from '../../../material/ArcaneCard'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheHopeDescription extends ArcaneEffect {
  canDiscard(card: ArcaneCard): boolean {
    if (card !== ArcaneCard.TheHope) return false
    return this.table
      .filter((item) => item.id < ArcaneCard.TheHope)
      .length === 0
  }
}