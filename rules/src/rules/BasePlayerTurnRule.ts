import { PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from '../Memory'
import { PlayerId } from '../PlayerId'
import { RuleId } from './RuleId'

export class BasePlayerTurnRule extends PlayerTurnRule {
  get nextRuleMove() {
    const nextPlayer = this.computeNextPlayer()
    const players = this.orderedPlayers.some((p) => !this.hasCardOnTable(p))
    if (!players || !nextPlayer) return [this.startRule(RuleId.RoundResolution)]
    return [this.startPlayerTurn(RuleId.Place, nextPlayer)]
  }

  get firstPlayer(): PlayerId {
    return this.remind<PlayerId>(Memory.FirstPlayer)
  }

  computeNextPlayer(): PlayerId | undefined {
    return this.orderedPlayers.find((p) => !this.hasCardOnTable(p))
  }

  get orderedPlayers(): PlayerId[] {
    const orderedPlayers: PlayerId[] = [this.firstPlayer]
    for (let i = 0; i < this.game.players.length - 1; i++) {
      const lastPlayer = orderedPlayers[orderedPlayers.length - 1]
      orderedPlayers.push(this.game.players[(this.game.players.indexOf(lastPlayer) + 1) % this.game.players.length])
    }

    return orderedPlayers
  }

  hasCardOnTable(player: PlayerId) {
    return this.material(MaterialType.Arcane).location(LocationType.Table).player(player).length > 0
  }
}
