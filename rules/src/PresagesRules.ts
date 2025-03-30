import { MaterialGame, MaterialMove, MaterialRules, TimeLimit } from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { DealRule } from './rules/DealRule'
import { PlaceRule } from './rules/PlaceRule'
import { RuleId } from './rules/RuleId'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class PresagesRules
  extends MaterialRules<PlayerId, MaterialType, LocationType>
  implements TimeLimit<MaterialGame<PlayerId, MaterialType, LocationType>, MaterialMove<PlayerId, MaterialType, LocationType>, PlayerId>
{
  rules = {
    [RuleId.Deal]: DealRule,
    [RuleId.Place]: PlaceRule
  }

  giveTime(): number {
    return 60
  }
}
