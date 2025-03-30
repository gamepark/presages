import { isMoveItemType, ItemMove, Material, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import maxBy from 'lodash/maxBy'
import { ArcaneCard } from '../material/ArcaneCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerId } from '../PlayerId'
import { RoundEffects } from './arcane/RoundEffects'
import { RuleId } from './RuleId'

export class RoundResolution extends MaterialRulesPart {
  onRuleStart() {
    const moves: MaterialMove[] = []
    const cards = this.table

    const discardedIndexes: number[] = []
    const cardWinningTheTrick = this.cardWinningTheTrick
    discardedIndexes.push(cardWinningTheTrick)
    discardedIndexes.push(...this.discardedCards.filter((card) => card !== cardWinningTheTrick))

    const discardedCards = cards.index(discardedIndexes)
    moves.push(
      ...discardedCards.moveItems({
          type: LocationType.Discard
        }
      )
    )

    moves.push(...this.sendCardBackInHandMoves(cards.index((i) => !discardedIndexes.includes(i))))
    moves.push(...this.afterEverythingSolved(discardedCards))

    return moves
  }

  private afterEverythingSolved(discardedCards: Material) {
    const onDiscardMoves = this.onDiscardMoves(discardedCards)
    const discardedIndexes = discardedCards.getIndexes()
    if (onDiscardMoves.length) {
      return onDiscardMoves
    } else if (this.willTriggerEndOfRound(discardedIndexes)) {
      return [this.startRule(RuleId.RoundEnd)]
    } else {
      return [this.startRule(RuleId.Deal)]
    }
  }

  willTriggerEndOfRound(discardedCardIndexes: number[]) {
    for (const player of this.game.players) {
      const playerCards = this
        .material(MaterialType.Arcane)
        .player(player)
        .index((i) => !discardedCardIndexes.includes(i))
      if (playerCards.length === 1) return true
    }

    return false
  }


  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move)) return []
    if (move.location.type === LocationType.Hand) {
      const hand = this.getPlayerHand(move.location.player!)
      if (hand.length > 1) {
        return [hand.shuffle()]
      }
    }

    return []

  }

  sendCardBackInHandMoves(cards: Material) {
    return cards.moveItems((item) => ({
      type: LocationType.Hand,
      player: item.location.player,
    }))
  }

  onDiscardMoves(cards: Material) {
    const effect = cards.getItems()
      .map((item) => new RoundEffects[item.id as ArcaneCard]!(this.game))
      .find((effect) => effect.onDiscard !== undefined)
    if (effect) return effect.onDiscard()
    return []
  }

  get cardWinningTheTrick() {
    const cards = this.table
    const effects = cards.getItems().map((item) => new RoundEffects[item.id as ArcaneCard]!(this.game))
    const winTheTrickCondition = effects.find((e) => e.winTheTrickCondition !== undefined)?.winTheTrickCondition
    if (winTheTrickCondition === undefined) return maxBy(cards.getIndexes(), (index) => cards.index(index).getItem()!.id)!
    return cards.filter((item) => winTheTrickCondition(item.id)).getIndex()
  }

  get discardedCards() {
    const cards = this.table
    const effects = cards.getItems().map((item) => new RoundEffects[item.id as ArcaneCard]!(this.game))
    const discardedIndexes: number[] = []
    const indexes = cards.getIndexes()
    for (let i = 0; i < indexes.length; i++) {
      const card = indexes[i]
      const itsEffect = effects[i]
      if (itsEffect.immuneToDiscard) continue
      const isDiscarded = effects.some((effect) => effect.canDiscard(card))
      if (isDiscarded) discardedIndexes.push(card)
    }

    return discardedIndexes
  }

  get table() {
    return this
      .material(MaterialType.Arcane)
      .location(LocationType.Table)
   getPlayerHand(playerId: PlayerId) {
    return this.material(MaterialType.Arcane)
      .location(LocationType.Hand)
      .player(playerId)}
}