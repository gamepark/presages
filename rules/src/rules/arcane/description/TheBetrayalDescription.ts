import { MaterialMove } from '@gamepark/rules-api'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheBetrayalDescription extends ArcaneEffect {
  onPlaceTo(): MaterialMove[] {
    if (this.table.length === 1) return []
    return [this.startRule(RuleId.TheBetrayal)]
  }
}