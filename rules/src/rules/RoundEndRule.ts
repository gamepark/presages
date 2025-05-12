import { isMoveItemTypeAtOnce, ItemMove, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from '../Memory'
import { PlayerId } from '../PlayerId'
import { CustomMoveType } from './CustomMoveType'
import { RuleId } from './RuleId'
import { Visibility } from './Visibility'

export class RoundEndRule extends MaterialRulesPart {
  onRuleStart() {
    return [this.material(MaterialType.Arcane).location(LocationType.Hand).moveItemsAtOnce({ rotation: Visibility.VISIBLE_FOR_EVERYONE })]
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemTypeAtOnce(MaterialType.Arcane)(move) || move.location.rotation !== Visibility.VISIBLE_FOR_EVERYONE) return []
    const players = this.winningPlayers

    const winner = players[0]
    this.memorize(Memory.RoundWinner, winner)
    this.memorize(Memory.FirstPlayer, winner)
    const cards = this.material(MaterialType.Help)
      .location(LocationType.Help)
      .player((p) => players.includes(p!))
    if (cards.rotation(true).length > 0) {
      this.memorize(Memory.Winners, players)
      return [this.customMove(CustomMoveType.TempoDiscard), this.endGame()]
    }
    const moves: MaterialMove[] = []

    moves.push(...cards.rotateItems(true))

    if (this.isThereEquality) {
      moves.push(this.customMove(CustomMoveType.SeeEquality))
    }

    moves.push(
      this.allPlayedCards.moveItemsAtOnce({
        type: LocationType.Deck
      }),
      this.allCards.shuffle(),
      this.startRule(RuleId.Deal)
    )

    return moves
  }

  /**
   * There is an equality if two player has 0 or two players has 1 card
   */
  get isThereEquality(): boolean {
    const zeroCardPlayers = this.game.players.filter((p) => this.getPlayerCards(p).length === 0)
    if (zeroCardPlayers.length === 1) return false

    const oneCardPlayers = this.game.players.filter((p) => this.getPlayerCards(p).length === 1)
    return zeroCardPlayers.length >= 2 || oneCardPlayers.length >= 2
  }

  get winningPlayers(): PlayerId[] {
    const rankedPlayers = this.rankPlayers()
    const player = rankedPlayers[0]
    const team = this.remind<number>(Memory.Team, player)
    return [player, ...this.getTeamPlayers(team).filter((p) => p !== player)]
  }

  rankPlayers() {
    return this.game.players
      .filter((p) => this.getPlayerCards(p).length <= 1)
      .sort((a, b) => {
        const aCards = this.getPlayerCards(a)
        const bCards = this.getPlayerCards(b)
        if (aCards.length !== bCards.length) return aCards.length - bCards.length
        const bId = bCards.getItem()?.id ?? 0
        const aId = aCards.getItem()?.id ?? 0
        return bId - aId
      })
  }

  getPlayerCards(player: PlayerId) {
    return this.material(MaterialType.Arcane).location(LocationType.Hand).player(player)
  }

  getTeamPlayers(team: number): PlayerId[] {
    return this.game.players.filter((p) => this.remind(Memory.Team, p) === team)
  }

  get allCards() {
    return this.material(MaterialType.Arcane)
  }

  get allPlayedCards() {
    return this.allCards.location((l) => l.type !== LocationType.Deck)
  }
}
