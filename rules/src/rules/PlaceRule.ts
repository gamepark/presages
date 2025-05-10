import { isMoveItemType, ItemMove, Material, MaterialMove } from '@gamepark/rules-api'
import { ArcaneCard } from '../material/ArcaneCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from '../Memory'
import { RoundEffects } from './arcane/RoundEffects'
import { BasePlayerTurnRule } from './BasePlayerTurnRule'

export class PlaceRule extends BasePlayerTurnRule {
  getPlayerMoves() {
    const hand = this.hand
    const moves: MaterialMove[] = []
    for (const index of hand.getIndexes()) {
      const card = hand.index(index)
      const item = card.getItem<ArcaneCard>()!

      const Effect = RoundEffects[item.id]
      if (new Effect(this.game).canBePlacedInFrontOfOtherPlayers) {
        moves.push(...this.placeCardInFrontOfAnyone(card))
      } else {
        moves.push(this.placeCardInFrontOfMe(card))
      }
    }

    return moves
  }

  placeCardInFrontOfMe(card: Material) {
    return card.moveItem({
      type: LocationType.Table,
      player: this.player
    })
  }

  placeCardInFrontOfAnyone(card: Material) {
    return this.game.players
      .filter((p) => !this.hasCardOnTable(p))
      .map((p) =>
        card.moveItem({
          type: LocationType.Table,
          player: p
        })
      )
  }

  get hand() {
    const hand = this.material(MaterialType.Arcane)
      .location(LocationType.Hand)
      .player(this.player)
      .filter((_item, index) => this.blockedCard !== index)

    return this.filterPlayable(hand)
  }

  filterPlayable(hand: Material) {
    const cardIndexes = hand.getIndexes()
    const table = this.table
    const effects = table.getItems<ArcaneCard>().map((item) => new RoundEffects[item.id](this.game))
    const playableIndexes: number[] = []
    for (const index of cardIndexes) {
      const item = hand.getItem<ArcaneCard>(index)
      if (effects.some((effect) => !effect.canBePlayed(item.id))) continue
      playableIndexes.push(index)
    }

    if (playableIndexes.length === 0) return hand
    return hand.index(playableIndexes)
  }

  get blockedCard() {
    return this.remind<ArcaneCard | undefined>(Memory.BlockedCard)
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move) || move.location.type !== LocationType.Table) return []
    const card = this.material(MaterialType.Arcane).getItem<ArcaneCard>(move.itemIndex)
    const Effect = RoundEffects[card.id]
    const moves: MaterialMove[] = new Effect(this.game).onPlaceTo(card.id, move.location.player!)
    if (moves.length) return moves

    return this.nextRuleMove
  }

  get table() {
    return this.material(MaterialType.Arcane).location(LocationType.Table)
  }

  onRuleEnd() {
    this.forget(Memory.BlockedCard)
    return []
  }
}
