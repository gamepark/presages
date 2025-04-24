import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { keyBy, mapValues } from 'lodash'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from '../Memory'
import { PlayerId } from '../PlayerId'
import { RuleId } from './RuleId'
import { Visibility } from './Visibility'

export class DealRule extends MaterialRulesPart {
  onRuleStart() {
    const moves: MaterialMove[] = []
    const deck = this.deck
    let count = 0
    const cardsByPlayer: Record<PlayerId, number> = mapValues(keyBy(this.game.players), () => 0)
    for (const player of this.game.players) {
      const hand = this.getPlayerHand(player)
      cardsByPlayer[player] = this.getCardCountForPlayer(player) - hand.length
      count += cardsByPlayer[player]
    }
    for (let i = 0; i < count; i++) {
      const players = this.getPlayerWithoutFullHand(cardsByPlayer)
      const player = players[i % players.length]
      cardsByPlayer[player]--
      moves.push(
        deck.dealOne({
          type: LocationType.Hand,
          player: player,
          rotation: Visibility.VISIBLE_FOR_ME
        })
      )
    }

    const firstPlayer = this.firstPlayer
    if (this.isFirstRound) {
      moves.push(this.startSimultaneousRule(RuleId.ShowStarter))
    } else {
      moves.push(this.startPlayerTurn(RuleId.Place, firstPlayer))
    }
    return moves
  }

  getPlayerWithoutFullHand(cardsByPlayer: Record<PlayerId, number>) {
    return this.game.players.filter((p) => cardsByPlayer[p] > 0)
  }

  get firstPlayer() {
    const player = this.remind(Memory.ForcedFirstPlayer) ?? this.remind(Memory.FirstPlayer)
    this.memorize(Memory.FirstPlayer, player)
    this.forget(Memory.ForcedFirstPlayer)
    return player
  }

  getCardCountForPlayer(player: PlayerId) {
    if (!this.remind(Memory.RoundWinner) && this.game.players.length === 5 && this.remind(Memory.Team, player) === 1) return 4
    if (this.game.players.length < 6) return 5
    return 4
  }

  getPlayerHand(player: PlayerId) {
    return this.material(MaterialType.Arcane).location(LocationType.Hand).player(player)
  }

  get deck() {
    return this.material(MaterialType.Arcane).location(LocationType.Deck).deck()
  }

  get isFirstRound() {
    return this.remind(Memory.RoundWinner) === undefined
  }
}
