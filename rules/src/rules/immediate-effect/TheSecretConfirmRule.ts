import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../../Memory'
import { PlayerId } from '../../PlayerId'
import { BasePlayerTurnRule } from '../BasePlayerTurnRule'
import { CustomMoveType } from '../CustomMoveType'
import { Visibility } from '../Visibility'

export class TheSecretConfirmRule extends BasePlayerTurnRule {

  getPlayerMoves() {
    return [
      this.customMove(CustomMoveType.Confirm)
    ]
  }

  onCustomMove(move: CustomMove) {
    if (!isCustomMoveType(CustomMoveType.Confirm)(move)) return []
    const shownCard = this.shownCard
    const card = this.material(MaterialType.Arcane).index(shownCard.index)
    return [
      card.moveItem({
        type: LocationType.Hand,
        player: shownCard.player,
        rotation: Visibility.VISIBLE_FOR_ME
      })
    ]
  }

  get shownCard() {
    return this.remind<{ player: PlayerId, index: number}>(Memory.ShownCard)
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move)) return []

    const moves: MaterialMove[] = []
    if (move.location.type === LocationType.Hand && move.location.player !== this.player) {
      const hand = this
        .material(MaterialType.Arcane)
        .location(LocationType.Hand)
        .player(move.location.player)

      if (hand.length > 1) {
        moves.push(hand.shuffle())
      }

      moves.push(...this.nextRuleMove)
    }

    return moves
  }

  onRuleEnd() {
    this.forget(Memory.ShownCard)
    return []
  }
}