import { CustomMoveType } from '@gamepark/presages/rules/CustomMoveType'
import { MaterialGameAnimationContext, MaterialGameAnimations } from '@gamepark/react-game'
import { isCustomMoveType, MaterialMove } from '@gamepark/rules-api'

class PresageGameAnimation extends MaterialGameAnimations {
  getDuration(move: MaterialMove, context: MaterialGameAnimationContext): number {
    if (isCustomMoveType(CustomMoveType.TempoDiscard)(move)) return context.game.players.length
    return super.getDuration(move, context)
  }
}

export const gameAnimations = new PresageGameAnimation()
