import { MaterialMove } from '@gamepark/rules-api'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheBetrayalDescription extends ArcaneEffect {
  onPlaceTo(): MaterialMove[] {
    return [this.startRule(RuleId.TheBetrayal)]
  }
}