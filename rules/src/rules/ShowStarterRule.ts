import { MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from '../Memory'
import { RuleId } from './RuleId'
import { Visibility } from './Visibility'

export class ShowStarterRule extends SimultaneousRule {
  getActivePlayerLegalMoves(player: number) {
    return [
      this.endPlayerTurn(player)
    ]
  }

  getMovesAfterPlayersDone() {
    const moves: MaterialMove[] = []

    moves.push(
      ...this.absolutes.moveItems((item) => ({
        type: LocationType.Hand,
        player: item.location.player,
        rotation: Visibility.VISIBLE_FOR_ME
      }))
    )

    moves.push(
      this.startPlayerTurn(RuleId.Place, this.remind(Memory.FirstPlayer))
    )

    return moves
  }

  get absolutes() {
    return this
      .material(MaterialType.Arcane)
      .location(LocationType.Table)
  }
}