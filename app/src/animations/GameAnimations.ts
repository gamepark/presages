import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { CustomMoveType } from '@gamepark/presages/rules/CustomMoveType'
import { RuleId } from '@gamepark/presages/rules/RuleId'
import { Visibility } from '@gamepark/presages/rules/Visibility'
import { MaterialGameAnimations } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, isStartRule } from '@gamepark/rules-api'
import GiveCard from '../sounds/give-card.wav'

export const gameAnimations = new MaterialGameAnimations()

gameAnimations.when().move(isMoveItemType(MaterialType.Help)).none()

gameAnimations
  .when()
  .move((move) => isCustomMoveType(CustomMoveType.TempoDiscard)(move))
  .duration(5)

gameAnimations
  .when()
  .move((move) => isCustomMoveType(CustomMoveType.SeeEquality)(move))
  .duration(4)

gameAnimations
  .when()
  .move((move, context) => context.rules.game.rule?.id === RuleId.Deal && isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Hand)
  .duration(0.2)

gameAnimations
  .when()
  .move(
    (move, context) =>
      isMoveItemType(MaterialType.Arcane)(move) &&
      move.location.rotation === Visibility.VISIBLE_FOR_ME &&
      context.rules.material(MaterialType.Arcane).getItem(move.itemIndex).location.rotation === Visibility.HIDDEN_FOR_EVERYONE
  )
  .sound({ sound: GiveCard, volume: 0.2 })
  .duration(0.5)

gameAnimations
  .when()
  .move((move) => {
    return isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Hand
  })
  .sound({ sound: GiveCard, volume: 0.2 })

gameAnimations
  .when()
  .move((move) => isStartRule(move) && move.id === RuleId.Deal)
  .duration(1)

gameAnimations
  .when()
  .move((move) => isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Table)
  .duration(0.8)
