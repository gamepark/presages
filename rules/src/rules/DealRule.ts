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
    for (const player of this.game.players) {
      const hand = this.getPlayerHand(player)
      const drawCount = this.cardPerPlayer - hand.length
      moves.push(
        ...deck.deal({
          type: LocationType.Hand,
          player: player,
          rotation: Visibility.VISIBLE_FOR_ME
        }, drawCount)
      )
    }

    const firstPlayer = this.firstPlayer
    this.memorize(Memory.FirstPlayer, firstPlayer)
    moves.push(this.startPlayerTurn(RuleId.Place, firstPlayer))
    return moves
  }

  get firstPlayer() {
    const player = this.remind(Memory.ForcedFirstPlayer) ?? this.remind(Memory.FirstPlayer)
    this.memorize(Memory.FirstPlayer, player)
    this.forget(Memory.ForcedFirstPlayer)
    return player
  }

  get cardPerPlayer() {
    return 9 - this.game.players.length
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