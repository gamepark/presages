import { MaterialMove } from '@gamepark/rules-api'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { PlayerId } from '../../../PlayerId'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheAngerDescription extends ArcaneEffect {
  onPlaceTo(cardId: ArcaneCard, player: PlayerId): MaterialMove[] {
    if (this.table.length === 1) return []
    const cardPlayer = this.table.find((item) => item.id === cardId)!.location.player
    if (player === cardPlayer) return [this.startRule(RuleId.TheAnger)]
    return [this.startPlayerTurn(RuleId.TheAnger, cardPlayer!)]
  }
}
