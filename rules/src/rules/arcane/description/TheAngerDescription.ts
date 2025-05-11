import { MaterialMove } from '@gamepark/rules-api'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { PlayerId } from '../../../PlayerId'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheAngerDescription extends ArcaneEffect {
  onPlaceTo(_cardId: ArcaneCard, target: PlayerId): MaterialMove[] {
    if (this.table.length === 1) return []
    if (this.game.rule?.player === target) return [this.startRule(RuleId.TheAnger)]
    return [this.startPlayerTurn(RuleId.TheAnger, target)]
  }
}
