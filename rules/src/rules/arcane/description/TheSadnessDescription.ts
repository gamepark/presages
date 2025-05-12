import maxBy from 'lodash/maxBy'
import { ArcaneCard } from '../../../material/ArcaneCard'
import { ArcaneEffect, WinTheTrickCondition } from '../ArcaneEffect'

export class TheSadnessDescription extends ArcaneEffect {
  get winTheTrickCondition(): WinTheTrickCondition | undefined {
    if (this.table.some((item) => item.id === ArcaneCard.TheMirror)) return
    const maxCard = maxBy(this.table, (item) => item.id)?.id
    const tableWithoutMax = this.table.filter((item) => item.id !== maxCard)
    return (card: ArcaneCard) => maxBy(tableWithoutMax, (item) => item.id)?.id === card
  }
}
