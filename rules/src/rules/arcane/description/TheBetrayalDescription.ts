import { MaterialMove } from '@gamepark/rules-api'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheBetrayalDescription extends ArcaneEffect {
  onPlace(_card: ArcaneCard): MaterialMove[] {
    return [this.startRule(RuleId.TheBetrayal)]
  }
}