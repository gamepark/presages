import { RuleMove, RuleStep } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { Memory } from '../../Memory'
import { PlayerId } from '../../PlayerId'
import { PlaceRule } from '../PlaceRule'

export class TheDreamRule extends PlaceRule {
  onRuleStart(_move: RuleMove, previousRule?: RuleStep) {
    if (previousRule) {
      this.memorize(Memory.EffectPlayer, previousRule.player)
    }

    return []
  }

  getPlayerMoves() {
    return this.hand.moveItems({
      type: LocationType.Table,
      player: this.effectPlayer
    })
  }

  get effectPlayer() {
    return this.remind<PlayerId>(Memory.EffectPlayer)
  }

  onRuleEnd() {
    this.forget(Memory.EffectPlayer)
    return []
  }
}
