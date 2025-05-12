import { MaterialMove } from '@gamepark/rules-api'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { PlayerId } from '../../../PlayerId'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheJalousieDescription extends ArcaneEffect {
  onPlaceTo(_cardId: ArcaneCard, target: PlayerId): MaterialMove[] {
    if (this.table.length === 1) return []
    if (this.getActivePlayer() === target) return [this.startRule(RuleId.TheJalousie)]
    return [this.startPlayerTurn(RuleId.TheJalousie, target)]
  }
}
