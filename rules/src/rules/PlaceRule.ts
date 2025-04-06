import { isMoveItemType, ItemMove, PlayerTurnRule } from '@gamepark/rules-api'
import { ArcaneCard } from '../material/ArcaneCard'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from '../Memory'
import { RoundEffects } from './arcane/RoundEffects'
import { RuleId } from './RuleId'

export class PlaceRule extends PlayerTurnRule {
  getPlayerMoves() {
    return this.hand.moveItems({
      type: LocationType.Table,
      player: this.player,
    })
  }

  get hand() {
    return this
      .material(MaterialType.Arcane)
      .location(LocationType.Hand)
      .player(this.player)
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.Arcane)(move)) return []
    const card = this.material(MaterialType.Arcane).getItem(move.itemIndex)!
    const effect = RoundEffects[card.id as ArcaneCard]
    if (effect) {
      const
    }
    if (this.nextPlayer === this.remind(Memory.FirstPlayer)) return [this.startRule(RuleId.RoundResolution)]
    return [this.startPlayerTurn(RuleId.Place, this.nextPlayer)]
  }
}