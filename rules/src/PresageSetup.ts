import { MaterialGameSetup } from '@gamepark/rules-api'
import { PresagesOptions } from './PresagesOptions'
import { PresagesRules } from './PresagesRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerId } from './PlayerId'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class PresageSetup extends MaterialGameSetup<PlayerId, MaterialType, LocationType, PresagesOptions> {
  Rules = PresagesRules

  setupMaterial(_options: PresagesOptions) {
    // TODO
  }

  start() {
    this.startRule(RuleId.Deal)
  }
}
