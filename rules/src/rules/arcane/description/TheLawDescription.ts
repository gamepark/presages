import { MaterialMove } from '@gamepark/rules-api'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { Memory } from '../../../Memory'
import { PlayerId } from '../../../PlayerId'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheLawDescription extends ArcaneEffect {
  onPlaceTo(_cardId: ArcaneCard, target: PlayerId): MaterialMove[] {
    if (this.table.length === this.game.players.length) return []
    if (this.game.rule?.player === target) return [this.startRule(RuleId.TheLaw)]
    return [this.startPlayerTurn(RuleId.TheLaw, target)]
  }

  canBePlayed(card: ArcaneCard) {
    if (this.theLaw < 0) return card < 15
    return card > 15
  }

  get theLaw() {
    return this.remind<number>(Memory.TheLaw)
  }
}
