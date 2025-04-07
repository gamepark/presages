import { isMoveItemType, ItemMove, MaterialMove, RuleMove } from '@gamepark/rules-api'
import { RuleStep } from '@gamepark/rules-api/dist/material/rules/RuleStep'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../../Memory'
import { BasePlayerTurnRule } from '../BasePlayerTurnRule'
import { Visibility } from '../Visibility'

export class TheSecretRule extends BasePlayerTurnRule {
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
      rotation: Visibility.VISIBLE_FOR_ME
    })
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move)) return []

    const moves: MaterialMove[] = []
    if (move.location.type === LocationType.Hand && move.location.player === this.effectPlayer) {
      const card = this.material(MaterialType.Arcane).index(move.itemIndex)
      moves.push(
        card.moveItem({
          type: LocationType.Hand,
          player: this.player,
          rotation: Visibility.VISIBLE_FOR_ME
        })
      )
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
    return this.remind(Memory.EffectPlayer)
  }

  get hand() {
    return this
      .material(MaterialType.Arcane)
      .location(LocationType.Hand)
      .player(this.player)
  }

  onRuleEnd() {
    this.forget(Memory.EffectPlayer)
    return []
  }
}