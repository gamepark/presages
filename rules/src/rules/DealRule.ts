import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
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
    for (const player of this.game.players) {
      const hand = this.getPlayerHand(player)
      count += this.getCardCountForPlayer(player) - hand.length
    }

    for (let i = 0; i < count; i++) {
      const players = this.playerWithoutFullHand
      const player = players[i % players.length]
      moves.push(deck.dealOne({
        type: LocationType.Hand,
        player: player,
        rotation: Visibility.VISIBLE_FOR_ME
      }))
    }

    const firstPlayer = this.firstPlayer
    this.memorize(Memory.FirstPlayer, firstPlayer)
    moves.push(this.startPlayerTurn(RuleId.Place, firstPlayer))
    return moves
  }

  get playerWithoutFullHand() {
    return this.game.players.filter((p) => (this.getCardCountForPlayer(p) - this.getPlayerHand(p).length) > 0)
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
    return this.material(MaterialType.Arcane)
      .location(LocationType.Hand)
      .player(player)
  }

  get deck() {
    return this.material(MaterialType.Arcane)
      .location(LocationType.Deck)
      .deck()
  }
}