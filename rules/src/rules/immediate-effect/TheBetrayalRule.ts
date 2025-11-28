import { isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { isEqual } from 'es-toolkit'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlaceRule } from '../PlaceRule'

export class TheBetrayalRule extends PlaceRule {
  getPlayerMoves() {
    const table = this.table.getItems()
    const hand = this.hand
    const moves: MaterialMove[] = []
    for (const tableItem of table) {
      moves.push(...hand.moveItems(tableItem.location))
    }

    return moves
  }

  beforeItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move) || move.location.type !== LocationType.Table) return []
    const cardInPlace = this.table.filter((item) => isEqual(item.location, move.location))
    const movedCard = this.hand.getItem(move.itemIndex)
    return cardInPlace.moveItems(movedCard.location)
  }

  get table() {
    return this.material(MaterialType.Arcane)
      .location(LocationType.Table)
      .player((p) => p !== this.player)
  }

  get hand() {
    const hand = this.material(MaterialType.Arcane).location(LocationType.Hand).player(this.player)

    return this.filterPlayable(hand)
  }
}
