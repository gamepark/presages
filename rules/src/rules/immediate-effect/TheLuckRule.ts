import { isMoveItemType, ItemMove } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { BasePlayerTurnRule } from '../BasePlayerTurnRule'
import { RuleId } from '../RuleId'

export class TheLuckRule extends BasePlayerTurnRule {
  getPlayerMoves() {
    return this.hand.moveItems({
      type: LocationType.Discard
    })
  }

  get triggersEndOfRound() {
    for (const player of this.game.players) {
      const playerCards = this.material(MaterialType.Arcane).player(player)

      if (playerCards.length <= 1) return true
    }

    return false
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move)) return []
    if (this.triggersEndOfRound) return [this.startRule(RuleId.RoundEnd)]
    return this.nextRuleMove
  }

  get hand() {
    return this.material(MaterialType.Arcane).location(LocationType.Hand).player(this.player)
  }
}
