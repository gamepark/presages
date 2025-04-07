import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../../Memory'
import { CustomMoveType } from '../CustomMoveType'
import { RuleId } from '../RuleId'
import { BasePlayerTurnRule } from '../BasePlayerTurnRule'
import { Visibility } from '../Visibility'

export class TheSecretChoiceRule extends BasePlayerTurnRule {

  getPlayerMoves() {
    const showCardTo = this.showCardTo
    if (showCardTo) {
      return this.showCardToPlayer
    }

    return this.secretChoice
  }

  get showCardToPlayer() {
    return this.hand.moveItems({
      type: LocationType.Hand,
      player: this.showCardTo,
      rotation: Visibility.VISIBLE_FOR_ME
    })
  }

  get secretChoice() {
    const moves: MaterialMove[] = []

    for (const player of this.game.players) {
      if (player === this.player) continue
      moves.push(this.customMove(CustomMoveType.ShowCard, player))
      moves.push(this.customMove(CustomMoveType.SeeCard, player))
    }

    return moves
  }

  get showCardTo() {
    return this.remind(Memory.ShowCardTo)
  }

  onCustomMove(move: CustomMove) {
    if (isCustomMoveType(CustomMoveType.SeeCard)(move)) {
      return [this.startPlayerTurn(RuleId.TheSecret, move.data)]
    }

    if (isCustomMoveType(CustomMoveType.ShowCard)(move)) {
      this.memorize(Memory.ShowCardTo, move.data)
    }

    return []
  }

  get hand() {
    return this
      .material(MaterialType.Arcane)
      .location(LocationType.Hand)
      .player(this.player)
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move)) return []

    const moves: MaterialMove[] = []
    if (move.location.type === LocationType.Hand && move.location.player !== this.player) {
      const card = this.material(MaterialType.Arcane).index(move.itemIndex)
      moves.push(
        card.moveItem({
          type: LocationType.Hand,
          player: this.player,
          rotation: Visibility.VISIBLE_FOR_ME
        })
      )

      if (this.hand.length > 0) {
        moves.push(this.hand.shuffle())
      }

      moves.push(...this.nextRuleMove)
    }

    return moves
  }

  onRuleEnd() {
    this.forget(Memory.ShowCardTo)
    return []
  }
}