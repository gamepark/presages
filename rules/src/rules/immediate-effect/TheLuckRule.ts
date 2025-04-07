import { isMoveItemType, ItemMove } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { BasePlayerTurnRule } from '../BasePlayerTurnRule'

export class TheLuckRule extends BasePlayerTurnRule {
  getPlayerMoves() {
    return this.hand.moveItems({
      type: LocationType.Discard
    })
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move)) return []
    return this.nextRuleMove
  }

  get hand() {
    return this
      .material(MaterialType.Arcane)
      .location(LocationType.Hand)
      .player(this.player)
  }
}