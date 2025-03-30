import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { ArcaneCard } from '../../material/ArcaneCard'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'

export type WinTheTrickCondition = (_card: ArcaneCard) => boolean

export abstract class ArcaneEffect extends MaterialRulesPart {
  onPlace(_card: ArcaneCard): MaterialMove[] {
    return []
  }

  afterResolution(_card: ArcaneCard) {
  }

  canDiscard(_card: ArcaneCard): boolean {
    return false
  }

  onDiscard(): MaterialMove[] {
    return []
  }

  get winTheTrickCondition(): WinTheTrickCondition | undefined {
    return
  }

  get table() {
    return this
      .material(MaterialType.Arcane)
      .location(LocationType.Table)
      .getItems()
  }

  get immuneToDiscard() {
    return false
  }
}