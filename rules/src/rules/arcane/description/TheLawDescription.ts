import { MaterialMove } from '@gamepark/rules-api'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheLawDescription extends ArcaneEffect {
  onPlaceTo(): MaterialMove[] {
    if (this.table.length === this.game.players.length) return []
    return [this.startRule(RuleId.TheLaw)]
  }

}