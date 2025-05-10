import { MaterialMove } from '@gamepark/rules-api'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheLuckDescription extends ArcaneEffect {
  onDiscard(): MaterialMove[] {
    return [this.startPlayerTurn(RuleId.TheLuck, this.owner)]
  }

  get owner() {
    return this.table.find((c) => c.id === ArcaneCard.TheLuck)!.location.player!
  }
}
