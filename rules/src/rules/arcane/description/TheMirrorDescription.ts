import { minBy } from 'es-toolkit'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { ArcaneEffect, WinTheTrickCondition } from '../ArcaneEffect'

export class TheMirrorDescription extends ArcaneEffect {
  get winTheTrickCondition(): WinTheTrickCondition | undefined {
    return (card: ArcaneCard) => minBy(this.table, (item) => item.id)?.id === card
  }
}
