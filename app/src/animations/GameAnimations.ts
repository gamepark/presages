import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { CustomMoveType } from '@gamepark/presages/rules/CustomMoveType'
import { RuleId } from '@gamepark/presages/rules/RuleId'
import { Visibility } from '@gamepark/presages/rules/Visibility'
import { and, AnimationPredicate, MaterialGameAnimations, not } from '@gamepark/react-game'
import { isCustomMoveType, isMoveItemType, isStartRule } from '@gamepark/rules-api'
import GiveCard from '../sounds/give-card.wav'

export const gameAnimations = new MaterialGameAnimations()

/**
 * Dealing the arcanas at the start of a round. It gets its own short duration below, and deliberately no
 * sound of its own: the framework's default card sound is what should be heard, once per dealt card, not
 * the give-card cue used when a single card is handed over.
 *
 * The two give-card configurations below therefore have to exclude the deal explicitly. A configuration
 * that sets no sound does not stop the search for one — the animation API keeps looking through the
 * following configurations — so being registered first is not enough to shadow them.
 */
const isDealToHand: AnimationPredicate = (move, context) =>
  context.rules.game.rule?.id === RuleId.Deal
  && isMoveItemType(MaterialType.Arcane)(move)
  && move.location.type === LocationType.Hand

gameAnimations.configure(isMoveItemType(MaterialType.Help)).skip()

gameAnimations
  .configure((move) => isCustomMoveType(CustomMoveType.TempoDiscard)(move))
  .duration(5000)

gameAnimations
  .configure((move) => isCustomMoveType(CustomMoveType.SeeEquality)(move))
  .duration(4000)

gameAnimations
  .configure(isDealToHand)
  .duration(200)

gameAnimations
  .configure(and(
    not(isDealToHand),
    (move, context) =>
      isMoveItemType(MaterialType.Arcane)(move) &&
      move.location.rotation === Visibility.VISIBLE_FOR_ME &&
      context.rules.material(MaterialType.Arcane).getItem(move.itemIndex).location.rotation === Visibility.HIDDEN_FOR_EVERYONE
  ))
  .sound({ sound: GiveCard, volume: 0.2 })
  .duration(500)

gameAnimations
  .configure(and(
    not(isDealToHand),
    (move) => isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Hand
  ))
  .sound({ sound: GiveCard, volume: 0.2 })

gameAnimations
  .configure((move) => isStartRule(move) && move.id === RuleId.Deal)
  .duration(1000)

gameAnimations
  .configure((move) => isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Table)
  .duration(800)
