import { isMoveItemTypeAtOnce, ItemMove, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from '../Memory'
import { PlayerId } from '../PlayerId'
import { RuleId } from './RuleId'
import { Visibility } from './Visibility'

export class RoundEndRule extends MaterialRulesPart {
  onRuleStart() {
    return [
      this
        .material(MaterialType.Arcane)
        .location(LocationType.Hand)
        .moveItemsAtOnce({ rotation: Visibility.VISIBLE_FOR_EVERYONE })
    ]
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemTypeAtOnce(MaterialType.Arcane)(move)) return []
    const players = this.winningPlayers
    this.memorize(Memory.RoundWinner, players[0])
    const cards = this.material(MaterialType.Help).location(LocationType.Help).player((p) => players.includes(p as PlayerId))
    if (cards.rotation(true).length > 0) {
      this.memorize(Memory.Winners, players)
      return [this.endGame()]
    }
    const moves: MaterialMove[] = []

    moves.push(
      ...cards.rotateItems(true),
      this.allPlayedCards.moveItemsAtOnce({
        type: LocationType.Deck,
      }),
      this.allCards.shuffle(),
      this.startRule(RuleId.Deal),
    )

    return moves
  }

  get winningPlayers(): PlayerId[] {
    const rankedPlayers = this.rankPlayers()
    const player = rankedPlayers[0]
    const team = this.remind(Memory.Team, player)
    return this.getTeamPlayers(team)
  }

  rankPlayers() {
    return  this.game
      .players
      .filter((p) => this.getPlayerCards(p).length <= 1)
      .sort((a, b) => {
        const aCards = this.getPlayerCards(a)
        const bCards = this.getPlayerCards(b)
        if (aCards.length !== bCards.length) return aCards.length - bCards.length
        return bCards.getItem()?.id ?? 0 - aCards.getItem()?.id ?? 0
      })
  }

  getPlayerCards(player: PlayerId) {
    return this.material(MaterialType.Arcane).location(LocationType.Hand).player(player)
  }

  getTeamPlayers(team: number): PlayerId[] {
    return this.game.players.filter((p) => this.remind(Memory.Team, p) === team)
  }

  get allCards() {
    return this
      .material(MaterialType.Arcane)
  }

  get allPlayedCards() {
    return this
      .allCards
      .location((l) => l.type !== LocationType.Deck)
  }
}