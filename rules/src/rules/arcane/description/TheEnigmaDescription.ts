import { ArcaneCard } from '../../../material/ArcaneCard'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheEnigmaDescription extends ArcaneEffect {
  canDiscard(card: ArcaneCard): boolean {
    if (card !== ArcaneCard.TheEnigma) return false
    return this.table.some((item) => item.id >= ArcaneCard.TheAbsolute30)
  }
}
