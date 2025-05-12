import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../../Memory'
import { PlayerId } from '../../PlayerId'
import { CustomMoveType } from '../CustomMoveType'
import { RuleId } from '../RuleId'
import { BasePlayerTurnRule } from '../BasePlayerTurnRule'
import { Visibility } from '../Visibility'

export class TheSecretForMeRule extends BasePlayerTurnRule {
  getPlayerMoves() {
    const showCardTo = this.showCardTo
    if (showCardTo) {
      return this.showCardToPlayer
    }

    return [...this.showCardToPlayer, ...this.secretChoice]
  }

  get showCardToPlayer() {
    const players = this.game.players.filter((p) => p !== this.player)
    const moves: MaterialMove[] = []
    for (const player of players) {
      moves.push(
        ...this.hand.moveItems({
          type: LocationType.Hand,
          player: player,
          rotation: Visibility.TEMPORARY_VISIBLE_FOR_ME
        })
      )
    }

    return moves
  }

  get secretChoice() {
    const moves: MaterialMove[] = []

    for (const player of this.game.players) {
      if (player === this.player) continue
      moves.push(this.customMove(CustomMoveType.SeeCard, player))
    }

    return moves
  }

  get showCardTo() {
    return this.remind<PlayerId | undefined>(Memory.ShowCardTo)
  }

  onCustomMove(move: CustomMove) {
    if (isCustomMoveType(CustomMoveType.SeeCard)(move)) {
      return [this.startPlayerTurn(RuleId.TheSecretForOther, move.data)]
    }

    return []
  }

  get hand() {
    return this.material(MaterialType.Arcane).location(LocationType.Hand).player(this.player)
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move)) return []

    const moves: MaterialMove[] = []
    if (move.location.type === LocationType.Hand && move.location.player !== this.player) {
      this.memorize(Memory.ShownCard, { player: this.player, index: move.itemIndex })
      return [this.startPlayerTurn(RuleId.TheSecretConfirm, move.location.player!)]
    }

    if (move.location.type === LocationType.Hand && move.location.player === this.player) {
      if (this.hand.length > 1) {
        moves.push(this.hand.shuffle())
      }

      moves.push(...this.nextRuleMove)
    }

    return moves
  }

  onRuleEnd() {
    return []
  }
}
