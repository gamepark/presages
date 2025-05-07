import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { PresagesSetup } from '@gamepark/presages/PresagesSetup'

export const me = 2
export const lisa = 1
export const jakob = 3
export const jane = 4

export class TutorialSetup extends PresagesSetup {
  setupTeamsWithAbsolutes() {
    this.material(MaterialType.Arcane).createItem({ id: ArcaneCard.TheAbsolute30, location: { type: LocationType.Table, player: lisa } })
    this.material(MaterialType.Arcane).createItem({ id: ArcaneCard.TheAbsolute34, location: { type: LocationType.Table, player: me } })
    this.material(MaterialType.Arcane).createItem({ id: ArcaneCard.TheAbsolute31, location: { type: LocationType.Table, player: jakob } })
    this.material(MaterialType.Arcane).createItem({ id: ArcaneCard.TheAbsolute33, location: { type: LocationType.Table, player: jane } })

    this.markInTeam(lisa, 1)
    this.markInTeam(me, 1)
    this.markInTeam(jakob, 3)
    this.markInTeam(jane, 3)
  }
}
