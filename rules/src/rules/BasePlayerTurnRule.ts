import { PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from '../Memory'
import { PlayerId } from '../PlayerId'
import { RuleId } from './RuleId'

export class BasePlayerTurnRule extends PlayerTurnRule {
  get nextRuleMove() {
    const nextPlayer = this.nextPlayer
    const someoneHasNotPlayed = this.game.players.some((p) => !this.hasCardOnTable(p))
    if (!someoneHasNotPlayed) return [this.startRule(RuleId.RoundResolution)]
    this.memorize(Memory.CurrentPlayer, nextPlayer)
    return [this.startPlayerTurn(RuleId.Place, nextPlayer)]
  }

  get currentPlayer() {
    return this.remind(Memory.CurrentPlayer)
  }

  get nextPlayer(): PlayerId {
    const currentPlayer = this.currentPlayer ?? this.player
    const players = this.game.players.filter((p) => !this.hasCardOnTable(p) || p === currentPlayer)
    return players[(players.indexOf(currentPlayer) + 1) % players.length]
  }

  hasCardOnTable(player: PlayerId) {
    return this
      .material(MaterialType.Arcane)
      .location(LocationType.Table)
      .player(player).length > 0
  }

}