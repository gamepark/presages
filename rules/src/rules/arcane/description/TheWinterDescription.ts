import { ArcaneCard, hasColor } from '../../../material/ArcaneCard'
import { Color } from '../../../material/Color'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheWinterDescription extends ArcaneEffect {
  canDiscard(card: ArcaneCard): boolean {
    return hasColor(card, Color.Yellow)
  }
}
