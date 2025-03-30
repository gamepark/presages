import { isMoveItemType, ItemMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
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
    if (this.player === this.game.players[this.game.players.length - 1]) return [this.startRule(RuleId.EndOfTurn)]
    return [this.startPlayerTurn(RuleId.Place, this.nextPlayer)]
  }
}