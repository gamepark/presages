import { MaterialMove } from '@gamepark/rules-api'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { PlayerId } from '../../../PlayerId'
import { RuleId } from '../../RuleId'
import { ArcaneEffect } from '../ArcaneEffect'

export class TheSecretDescription extends ArcaneEffect {
  onPlaceTo(_card: ArcaneCard, target: PlayerId): MaterialMove[] {
    if (this.player !== target) return [this.startPlayerTurn(RuleId.TheSecretForMe, target)]
    return [this.startRule(RuleId.TheSecretForMe)]
  }

  get player() {
    return this.game.rule?.player
  }
}
