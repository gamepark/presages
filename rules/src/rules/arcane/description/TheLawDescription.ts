import { MaterialMove } from '@gamepark/rules-api'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheLawDescription extends ArcaneEffect {
  onPlace(): MaterialMove[] {
    return [this.startRule(RuleId.TheLaw)]
  }
}