import { ArcaneCard } from '../../../material/ArcaneCard'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheHarmonyDescription extends ArcaneEffect {
  canDiscard(card: ArcaneCard): boolean {
    return !this.table.some((item) => item.id < card)
  }
}
