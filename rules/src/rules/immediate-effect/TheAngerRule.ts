import { isMoveItemType, ItemMove } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../../Memory'
import { BasePlayerTurnRule } from '../BasePlayerTurnRule'
import { RuleId } from '../RuleId'
import { Visibility } from '../Visibility'

export class TheAngerRule extends BasePlayerTurnRule {
  getPlayerMoves() {
    return this.table.moveItems((item) => ({
      type: LocationType.Hand,
      player: item.location.player,
      rotation: Visibility.VISIBLE_FOR_ME
    }))
  }

  get table() {
    return this.material(MaterialType.Arcane)
      .location(LocationType.Table)
      .player((p) => p !== this.player)
  }

  beforeItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move) || move.location.type !== LocationType.Hand) return []
    this.memorize(Memory.BlockedCard, move.itemIndex)
    return []
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move) || move.location.type !== LocationType.Hand) return []

    return [
      this.material(MaterialType.Arcane).location(LocationType.Hand).player(this.player).shuffle(),
      this.startPlayerTurn(RuleId.Place, move.location.player!)
    ]
  }
}
