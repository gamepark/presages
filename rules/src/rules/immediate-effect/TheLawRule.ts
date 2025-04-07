import { CustomMove, isCustomMoveType } from '@gamepark/rules-api'
import { CustomMoveType } from '../CustomMoveType'
import { BasePlayerTurnRule } from '../BasePlayerTurnRule'

export class TheLawRule extends BasePlayerTurnRule {
  getPlayerMoves() {
    return [
      this.customMove(CustomMoveType.TheLaw, +15),
      this.customMove(CustomMoveType.TheLaw, -15)
    ]
  }

  onCustomMove(move: CustomMove) {
    if (!isCustomMoveType(CustomMoveType.TheLaw)(move)) return []
    return this.nextRuleMove
  }
}