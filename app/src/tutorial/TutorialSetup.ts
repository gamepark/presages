import { ArcaneCard, arcanes } from '@gamepark/presages/material/ArcaneCard'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { PresagesSetup } from '@gamepark/presages/PresagesSetup'
import shuffle from 'lodash/shuffle'

export const me = 2
export const myHand = [ArcaneCard.TheWinter, ArcaneCard.TheSpring, ArcaneCard.TheMischief, ArcaneCard.TheHarmony]
export const lisa = 1
export const lisaHand = [ArcaneCard.TheNight, ArcaneCard.TheDay, ArcaneCard.TheJalousie, ArcaneCard.TheFriendship]
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

  setupCards() {
    const other = shuffle(arcanes.filter((a) => !myHand.includes(a) && !lisaHand.includes(a) && a < 30))

    this.material(MaterialType.Arcane).createItems(
      other.map((a) => ({
        id: a,
        location: {
          type: LocationType.Deck
        }
      }))
    )

    this.material(MaterialType.Arcane)
      .location(LocationType.Deck)
      .sort((item) => item.location.x!)
      .id((id: ArcaneCard) => !lisaHand.includes(id) && !myHand.includes(id) && id !== ArcaneCard.TheDeath && id !== ArcaneCard.TheLife)
      .limit(3)
      .moveItems({
        type: LocationType.Deck
      })

    // Just to be sure jane has the life (for tuto explanation)
    this.material(MaterialType.Arcane).location(LocationType.Deck).id(ArcaneCard.TheDeath).moveItem({ type: LocationType.Deck })

    this.material(MaterialType.Arcane).createItems(
      shuffle(lisaHand).map((a) => ({
        id: a,
        location: {
          type: LocationType.Deck
        }
      }))
    )

    this.material(MaterialType.Arcane)
      .location(LocationType.Deck)
      .sort((item) => item.location.x!)
      .id((id: ArcaneCard) => !lisaHand.includes(id) && !myHand.includes(id) && id !== ArcaneCard.TheDeath && id !== ArcaneCard.TheLife)
      .limit(3)
      .moveItems({
        type: LocationType.Deck
      })

    // Just to be sure jakob has the life (for tuto explanation)
    this.material(MaterialType.Arcane).location(LocationType.Deck).id(ArcaneCard.TheLife).moveItem({ type: LocationType.Deck })

    this.material(MaterialType.Arcane).createItems(
      shuffle(myHand).map((a) => ({
        id: a,
        location: {
          type: LocationType.Deck
        }
      }))
    )
  }
}
