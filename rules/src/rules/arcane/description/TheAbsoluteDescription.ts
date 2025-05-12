import { MaterialMove } from '@gamepark/rules-api'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { PlayerId } from '../../../PlayerId'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheAbsoluteDescription extends ArcaneEffect {
  onPlaceTo(_card: ArcaneCard, target: PlayerId): MaterialMove[] {
    if (this.getActivePlayer() === target) return [this.startRule(RuleId.TheAbsolute)]
    return [this.startPlayerTurn(RuleId.TheAbsolute, target)]
  }
}
