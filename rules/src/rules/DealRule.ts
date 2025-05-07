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
      const playerCards = this.getPlayerCards(player)
      const cardToDeal = this.getCardCountForPlayer(player) - playerCards.length
      moves.push(
        deck.dealAtOnce(
          {
            type: LocationType.Hand,
            player: player,
            rotation: Visibility.VISIBLE_FOR_ME
          },
          cardToDeal
        )
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

  get firstPlayer(): PlayerId {
    const player = this.remind<PlayerId | undefined>(Memory.ForcedFirstPlayer) ?? this.remind<PlayerId>(Memory.FirstPlayer)
    this.memorize(Memory.FirstPlayer, player)
    this.forget(Memory.ForcedFirstPlayer)
    return player
  }

  getCardCountForPlayer(player: PlayerId) {
    if (!this.remind(Memory.RoundWinner) && this.game.players.length === 5 && this.remind(Memory.Team, player) === 1) return 4
    if (this.game.players.length < 6) return 5
    return 4
  }

  getPlayerCards(player: PlayerId) {
    return this.material(MaterialType.Arcane).player(player)
  }

  get deck() {
    return this.material(MaterialType.Arcane).location(LocationType.Deck).deck()
  }

  get isFirstRound() {
    return this.remind(Memory.RoundWinner) === undefined
  }
}
