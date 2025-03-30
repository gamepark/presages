import { MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { RuleId } from './RuleId'

export class EndOfTurn extends MaterialRulesPart {
  onRuleStart() {
    if (this.someoneWinsTheRound) return [this.startRule(RuleId.RoundEnd)]
    return [this.startPlayerTurn(RuleId.Place, this.game.players[0])]
  }

  get someoneWinsTheRound() {
    return this.game.players.some((p) => this.getPlayerHand(p) === 1)
  }

  getPlayerHand(player: PlayerId) {
    return this
      .material(MaterialType.Arcane)
      .location(LocationType.Hand)
      .player(player)
      .length
  }
}