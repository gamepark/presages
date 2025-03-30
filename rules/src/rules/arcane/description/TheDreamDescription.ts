import { MaterialMove } from '@gamepark/rules-api'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheDreamDescription extends ArcaneEffect {
  onPlace(): MaterialMove[] {
    return [this.startRule(RuleId.TheDream)]
  }
}