import { isMoveItemType, ItemMove, Material, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import maxBy from 'lodash/maxBy'
import { ArcaneCard } from '../material/ArcaneCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from '../Memory'
import { PlayerId } from '../PlayerId'
import { RoundEffects } from './arcane/RoundEffects'
import { CustomMoveType } from './CustomMoveType'
import { RuleId } from './RuleId'
import { Visibility } from './Visibility'

export class RoundResolutionRule extends MaterialRulesPart {
  onRuleStart() {
    const moves: MaterialMove[] = []
    const cards = this.table
    this.forget(Memory.CurrentPlayer)

    const cardWinningTheTrick = this.cardWinningTheTrick
    const item = cardWinningTheTrick.getItem()!
    this.memorize(Memory.WinningCard, {
      player: item.location.player,
      value: item.id as ArcaneCard
    })
    this.memorize(Memory.FirstPlayer, cardWinningTheTrick.getItem()!.location.player)

    moves.push(this.customMove(CustomMoveType.TempoDiscard))
    moves.push(
      cardWinningTheTrick.moveItem({
          type: LocationType.Discard
        }
      )
    )

    const discardedCards = this.discardedCards.filter((_, index) => index !== cardWinningTheTrick.getIndex())
    moves.push(
      ...discardedCards
        .moveItems({
          type: LocationType.Discard
        }
      )
    )

    const discardedIndexes = [...discardedCards.getIndexes(), cardWinningTheTrick.getIndex()]
    moves.push(...this.sendCardBackInHandMoves(cards.index((i) => !discardedIndexes.includes(i))))
    moves.push(...this.afterEverythingSolved(discardedIndexes))

    return moves
  }

  private afterEverythingSolved(discardedIndexes: number[]): MaterialMove[] {
    const onDiscardMoves = this.onDiscardMoves(discardedIndexes)

    this.afterResolution()
    if (onDiscardMoves.length) {
      return onDiscardMoves
    } else if (this.willTriggerEndOfRound(discardedIndexes)) {
      return [this.startRule(RuleId.RoundEnd)]
    } else {
      const firstPlayer = this.firstPlayer
      this.memorize(Memory.CurrentPlayer, firstPlayer)
      return [this.startPlayerTurn(RuleId.Place, firstPlayer)]
    }
  }

  get firstPlayer() {
    const player = this.remind(Memory.ForcedFirstPlayer) ?? this.remind(Memory.FirstPlayer)
    this.memorize(Memory.FirstPlayer, player)
    this.forget(Memory.ForcedFirstPlayer)
    return player
  }

  willTriggerEndOfRound(discardedCardIndexes: number[]) {
    for (const player of this.game.players) {
      const playerCards = this
        .material(MaterialType.Arcane)
        .player(player)
        .index((i) => !discardedCardIndexes.includes(i))
      
      if (playerCards.length <= 1) return true
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
    return cards
      .sort((item) => item.location.player!)
      .moveItems((item) => ({
      type: LocationType.Hand,
      player: item.location.player,
      rotation: Visibility.VISIBLE_FOR_ME
    }))
  }

  onDiscardMoves(discardedIndexes: number[]) {
    const cards = this.table.index(discardedIndexes)
    return cards.getItems()
      .flatMap((item) => new RoundEffects[item.id as ArcaneCard]!(this.game).onDiscard())
  }

  afterResolution() {
    return this.table.getItems()
      .forEach((item) => new RoundEffects[item.id as ArcaneCard]!(this.game).afterResolution(item.id))
  }

  get cardWinningTheTrick(): Material {
    const cards = this.table
    const effects = cards.getItems().map((item) => new RoundEffects[item.id as ArcaneCard]!(this.game))
    const winTheTrickCondition = effects.find((e) => e.winTheTrickCondition !== undefined)?.winTheTrickCondition
    if (winTheTrickCondition === undefined) return cards.index(maxBy(cards.getIndexes(), (index) => cards.index(index).getItem()!.id)!)
    return cards.filter((item) => winTheTrickCondition(item.id))
  }

  get discardedCards(): Material {
    const cards = this.table
    const effects = cards.getItems().map((item) => new RoundEffects[item.id as ArcaneCard]!(this.game))
    const discardedIndexes: number[] = []
    const indexes = cards.getIndexes()
    const cardItems = cards.getItems()
    for (let i = 0; i < indexes.length; i++) {
      const card = indexes[i]
      const id = cardItems[i].id as ArcaneCard
      const itsEffect = effects[i]
      if (itsEffect.immuneToDiscard) continue
      const isDiscarded = effects.some((effect) => effect.canDiscard(id))
      if (isDiscarded) discardedIndexes.push(card)
    }

    return cards.index(discardedIndexes)
  }

  get table() {
    return this
      .material(MaterialType.Arcane)
      .location(LocationType.Table)
  }

  getPlayerHand(playerId: PlayerId) {
    return this.material(MaterialType.Arcane)
      .location(LocationType.Hand)
      .player(playerId)
  }
}