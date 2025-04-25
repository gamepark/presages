import { MaterialMove } from '@gamepark/rules-api'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { Memory } from '../../../Memory'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheLawDescription extends ArcaneEffect {
  onPlaceTo(): MaterialMove[] {
    if (this.table.length === this.game.players.length) return []
    return [this.startRule(RuleId.TheLaw)]
  }

  canBePlayed(card: ArcaneCard) {
    if (this.theLaw < 0) return card < 15
    return card > 15
  }

  get theLaw() {
    return this.remind<number>(Memory.TheLaw)
  }
}
