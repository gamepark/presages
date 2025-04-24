import { isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { isEqual } from 'lodash'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { BasePlayerTurnRule } from '../BasePlayerTurnRule'

export class TheJalousieRule extends BasePlayerTurnRule {
  getPlayerMoves() {
    const table = this.table.getItems()
    const myCard = this.myCard
    const moves: MaterialMove[] = []
    for (const card of table) {
      moves.push(
        myCard.moveItem({
          ...card.location
        })
      )
    }

    return moves
  }

  beforeItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move) || !this.myCard.length) return []
    const cardInPlace = this.table.filter((item) => isEqual(item.location, move.location))
    const movedCard = this.myCard.getItem(move.itemIndex)!
    return [cardInPlace.moveItem(movedCard.location), ...this.nextRuleMove]
  }

  get myCard() {
    return this.material(MaterialType.Arcane).location(LocationType.Table).player(this.player)
  }

  get table() {
    return this.material(MaterialType.Arcane)
      .location(LocationType.Table)
      .player((p) => p !== this.player)
  }
}
