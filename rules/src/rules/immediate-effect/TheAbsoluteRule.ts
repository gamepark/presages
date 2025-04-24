import { isMoveItemType, ItemMove, Material, MaterialMove } from '@gamepark/rules-api'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { Memory } from '../../Memory'
import { PlayerId } from '../../PlayerId'
import { BasePlayerTurnRule } from '../BasePlayerTurnRule'
import { RuleId } from '../RuleId'
import { Visibility } from '../Visibility'

export class TheAbsoluteRule extends BasePlayerTurnRule {
  onRuleStart() {
    if (!this.effectPlayer) {
      const card = this.material(MaterialType.Arcane).location(LocationType.Table).player(this.player).getItem()!
      this.memorize(Memory.EffectPlayer, card.location.player!)
    }

    return []
  }

  get effectPlayer() {
    return this.remind(Memory.EffectPlayer)
  }

  getPlayerMoves() {
    if (this.effectPlayer === this.player) {
      const moves: MaterialMove[] = []
      for (const player of this.otherPlayers) {
        moves.push(...this.giveCardTo(player))
      }

      return moves
    }

    return this.giveCardTo(this.effectPlayer)
  }

  giveCardTo(player: PlayerId) {
    return this.hand.moveItems({
      type: LocationType.Hand,
      player: player,
      rotation: Visibility.HIDDEN_FOR_EVERYONE
    })
  }

  get otherPlayers() {
    return this.game.players.filter((player) => player !== this.player)
  }

  beforeItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move) || move.location.type !== LocationType.Hand || move.location.rotation !== Visibility.HIDDEN_FOR_EVERYONE)
      return []

    if (this.effectPlayer === this.player) {
      this.memorize(Memory.BlockedCard, move.itemIndex)
    }

    return []
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move) || move.location.type !== LocationType.Hand || !move.location.rotation) return []

    if (this.effectPlayer === this.player) {
      return [this.startPlayerTurn(RuleId.TheAbsolute, move.location.player!)]
    } else {
      const effectPlayerHand = this.effectPlayerHand
      const hand = this.hand

      const moves: MaterialMove[] = []
      moves.push(...this.givenCards.rotateItems(Visibility.VISIBLE_FOR_ME))
      if (effectPlayerHand.length > 1) moves.push(effectPlayerHand.shuffle())
      if (hand.length > 1) moves.push(hand.shuffle())
      moves.push(...this.nextRuleMove)
      return moves
    }
  }

  get effectPlayerHand(): Material {
    return this.material(MaterialType.Arcane).location(LocationType.Hand).player(this.effectPlayer)
  }

  get givenCards() {
    return this.material(MaterialType.Arcane).location((l) => l.type === LocationType.Hand && !!l.rotation)
  }

  get hand() {
    return this.material(MaterialType.Arcane)
      .location(LocationType.Hand)
      .player(this.player)
      .filter((item, index) => this.blockedCard !== index && !item.location.rotation)
  }

  get blockedCard() {
    return this.remind(Memory.BlockedCard)
  }

  onRuleEnd() {
    if (this.player !== this.effectPlayer) {
      this.forget(Memory.BlockedCard)
      this.forget(Memory.EffectPlayer)
    }

    return []
  }
}
