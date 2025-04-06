import { MaterialRulesPart } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class RoundEndRule extends MaterialRulesPart {
  onRuleStart() {
    return [
      this.allPlayedCards.moveItemsAtOnce({
        type: LocationType.Deck,
      }),
      this.allCards.shuffle(),
      this.startRule(RuleId.Deal),
    ]
  }

  get allCards() {
    return this
      .material(MaterialType.Arcane)
  }

  get allPlayedCards() {
    return this
      .allCards
      .location((l) => l.type !== LocationType.Deck)
  }
}