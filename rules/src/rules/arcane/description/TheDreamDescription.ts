import { MaterialMove } from '@gamepark/rules-api'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { PlayerId } from '../../../PlayerId'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheDreamDescription extends ArcaneEffect {
  canBePlacedInFrontOfOtherPlayers = true

  onPlaceTo(_card: ArcaneCard, target: PlayerId): MaterialMove[] {
    if (this.game.rule?.id === RuleId.TheBetrayal) return []
    if (this.table.length === this.game.players.length) return []
    if (this.getActivePlayer() !== target) return [this.startPlayerTurn(RuleId.TheDream, target)]
    return []
  }
}
