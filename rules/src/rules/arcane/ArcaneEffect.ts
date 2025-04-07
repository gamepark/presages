import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { ArcaneCard } from '../../material/ArcaneCard'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerId } from '../../PlayerId'

export type WinTheTrickCondition = (_card: ArcaneCard) => boolean

export abstract class ArcaneEffect extends MaterialRulesPart {
  onPlaceTo(_card: ArcaneCard, _player: PlayerId): MaterialMove[] {
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

  canBePlayed(_card: ArcaneCard): boolean {
    return true
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

  immuneToDiscard: boolean = false

  canBePlacedInFrontOfOtherPlayers: boolean = false
}