import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { CustomMoveType } from '@gamepark/presages/rules/CustomMoveType'
import { RuleId } from '@gamepark/presages/rules/RuleId'
import { Visibility } from '@gamepark/presages/rules/Visibility'
import { MaterialGameAnimationContext, MaterialGameAnimations } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, isMoveItemTypeAtOnce, isStartRule, MaterialMove } from '@gamepark/rules-api'
import PlayCard from '../sounds/play-card.wav'
import GiveCard from '../sounds/give-card.wav'

class PresageGameAnimation extends MaterialGameAnimations {
  getDuration(move: MaterialMove, context: MaterialGameAnimationContext): number {
    if (isCustomMoveType(CustomMoveType.TempoDiscard)(move)) return context.game.players.length
    if (isCustomMoveType(CustomMoveType.SeeEquality)(move)) return 3
    return super.getDuration(move, context)
  }
}

export const gameAnimations = new PresageGameAnimation()

gameAnimations.when().move(isMoveItemType(MaterialType.Help)).none()

gameAnimations
  .when()
  .move(
    (move, context) =>
      context.rules.game.rule?.id === RuleId.Deal && isMoveItemTypeAtOnce(MaterialType.Arcane)(move) && move.location.type === LocationType.Hand
  )
  .duration(0.2)

gameAnimations
  .when()
  .move(
    (move, context) =>
      isMoveItemType(MaterialType.Arcane)(move) &&
      move.location.rotation === Visibility.VISIBLE_FOR_ME &&
      context.rules.material(MaterialType.Arcane).getItem(move.itemIndex).location.rotation === Visibility.HIDDEN_FOR_EVERYONE
  )
  .sound(false)
  .duration(0.5)

gameAnimations
  .when()
  .move((move) => isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Hand)
  .sound({ sound: GiveCard, volume: 0.4 })

gameAnimations
  .when()
  .move((move) => isStartRule(move) && move.id === RuleId.Deal)
  .duration(1)

gameAnimations
  .when()
  .move((move) => isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Table)
  .duration(0.8)
  .sound({ sound: PlayCard, volume: 0.2 })

gameAnimations
  .when()
  .move((move) => isMoveItemTypeAtOnce(MaterialType.Arcane)(move) && move.location.rotation === Visibility.VISIBLE_FOR_EVERYONE)
  .duration(0.2)
