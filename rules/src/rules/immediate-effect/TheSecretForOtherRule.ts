import { isMoveItemType, ItemMove, MaterialMove, RuleMove, RuleStep } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../../Memory'
import { PlayerId } from '../../PlayerId'
import { BasePlayerTurnRule } from '../BasePlayerTurnRule'
import { RuleId } from '../RuleId'
import { Visibility } from '../Visibility'

export class TheSecretForOtherRule extends BasePlayerTurnRule {
  onRuleStart(_move: RuleMove, previousRule?: RuleStep) {
    if (previousRule) {
      this.memorize(Memory.EffectPlayer, previousRule.player)
    }

    return []
  }

  getPlayerMoves() {
    return this.hand.moveItems({
      type: LocationType.Hand,
      player: this.effectPlayer,
      rotation: Visibility.TEMPORARY_VISIBLE_FOR_ME
    })
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move)) return []

    const moves: MaterialMove[] = []
    if (move.location.type === LocationType.Hand && move.location.player === this.effectPlayer) {
      this.memorize(Memory.ShownCard, { player: this.player, index: move.itemIndex })
      return [this.startPlayerTurn(RuleId.TheSecretConfirm, move.location.player)]
    }

    if (move.location.type === LocationType.Hand && move.location.player === this.player) {
      if (this.hand.length > 1) {
        moves.push(this.hand.shuffle())
      }

      moves.push(...this.nextRuleMove)
    }

    return moves
  }

  get effectPlayer() {
    return this.remind<PlayerId>(Memory.EffectPlayer)
  }

  get hand() {
    return this.material(MaterialType.Arcane).location(LocationType.Hand).player(this.player)
  }

  onRuleEnd() {
    this.forget(Memory.EffectPlayer)
    return []
  }
}
