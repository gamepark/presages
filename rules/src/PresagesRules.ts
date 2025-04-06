import { hideItemId, hideItemIdToOthers, MaterialGame, MaterialMove, PositiveSequenceStrategy, SecretMaterialRules, TimeLimit } from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { DealRule } from './rules/DealRule'
import { PlaceRule } from './rules/PlaceRule'
import { RoundEndRule } from './rules/RoundEndRule'
import { RoundResolutionRule } from './rules/RoundResolutionRule'
import { RuleId } from './rules/RuleId'

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
      [LocationType.Hand]: hideItemIdToOthers,
    }
  }

  giveTime(): number {
    return 60
  }
}
