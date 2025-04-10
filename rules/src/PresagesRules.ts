import { hideItemId, MaterialGame, MaterialItem, MaterialMove, PositiveSequenceStrategy, SecretMaterialRules, TimeLimit } from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { DealRule } from './rules/DealRule'
import { TheAbsoluteRule } from './rules/immediate-effect/TheAbsoluteRule'
import { TheAngerRule } from './rules/immediate-effect/TheAngerRule'
import { TheBetrayalRule } from './rules/immediate-effect/TheBetrayalRule'
import { TheDreamRule } from './rules/immediate-effect/TheDreamRule'
import { TheJalousieRule } from './rules/immediate-effect/TheJalousieRule'
import { TheLawRule } from './rules/immediate-effect/TheLawRule'
import { TheLuckRule } from './rules/immediate-effect/TheLuckRule'
import { TheSecretForMeRule } from './rules/immediate-effect/TheSecretForMeRule'
import { TheSecretConfirmRule } from './rules/immediate-effect/TheSecretConfirmRule'
import { TheSecretForOtherRule } from './rules/immediate-effect/TheSecretForOtherRule'
import { PlaceRule } from './rules/PlaceRule'
import { RoundEndRule } from './rules/RoundEndRule'
import { RoundResolutionRule } from './rules/RoundResolutionRule'
import { RuleId } from './rules/RuleId'
import { isVisibleForMe, Visibility } from './rules/Visibility'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class PresagesRules
  extends SecretMaterialRules<PlayerId, MaterialType, LocationType>
  implements TimeLimit<MaterialGame<PlayerId, MaterialType, LocationType>, MaterialMove<PlayerId, MaterialType, LocationType>, PlayerId>
{
  rules = {
    [RuleId.Deal]: DealRule,
    [RuleId.Place]: PlaceRule,
    [RuleId.RoundResolution]: RoundResolutionRule,
    [RuleId.RoundEnd]: RoundEndRule,
    [RuleId.TheLaw]: TheLawRule,
    [RuleId.TheLuck]: TheLuckRule,
    [RuleId.TheDream]: TheDreamRule,
    [RuleId.TheJalousie]: TheJalousieRule,
    [RuleId.TheSecretForMe]: TheSecretForMeRule,
    [RuleId.TheSecretForOther]: TheSecretForOtherRule,
    [RuleId.TheSecretConfirm]: TheSecretConfirmRule,
    [RuleId.TheAnger]: TheAngerRule,
    [RuleId.TheBetrayal]: TheBetrayalRule,
    [RuleId.TheAbsolute]: TheAbsoluteRule
  }

  locationsStrategies = {
    [MaterialType.Arcane]: {
      [LocationType.Deck]: new PositiveSequenceStrategy(),
      [LocationType.Hand]: new PositiveSequenceStrategy(),
      [LocationType.Discard]: new PositiveSequenceStrategy(),
    }
  }

  hidingStrategies = {
    [MaterialType.Arcane]: {
      [LocationType.Deck]: hideItemId,
      [LocationType.Hand]: hideItemIdToOthersWhenNoZ,
    }
  }

  giveTime(): number {
    return 60
  }
}

export const hideItemIdToOthersWhenNoZ = (
  item: MaterialItem, player?: PlayerId
): string[] => item.location.rotation === Visibility.VISIBLE_FOR_EVERYONE || (isVisibleForMe(item, player)) ? [] : ['id']
