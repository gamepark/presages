import { isMoveItemType, ItemMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../../Memory'
import { PlayerId } from '../../PlayerId'
import { RuleId } from '../RuleId'

export class TheLuckRule extends PlayerTurnRule {
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

    const firstPlayer = this.firstPlayer
    if (firstPlayer === this.player) return [this.startRule(RuleId.Place)]
    return [this.startPlayerTurn(RuleId.Place, firstPlayer)]
  }

  get firstPlayer() {
    return this.remind<PlayerId>(Memory.FirstPlayer)
  }

  get hand() {
    return this.material(MaterialType.Arcane).location(LocationType.Hand).player(this.player)
  }
}
