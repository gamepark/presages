import { ArcaneCard, arcanes } from '@gamepark/presages/material/ArcaneCard'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { Memory } from '@gamepark/presages/Memory'
import { PresagesSetup } from '@gamepark/presages/PresagesSetup'
import { RuleId } from '@gamepark/presages/rules/RuleId'
import { Visibility } from '@gamepark/presages/rules/Visibility'
import { shuffle } from 'es-toolkit'

export const me = 2
export const myHand = [ArcaneCard.TheTruth, ArcaneCard.TheEnigma, ArcaneCard.TheFeast, ArcaneCard.TheLove]
export const lisa = 1
export const lisaHand = [ArcaneCard.TheNight, ArcaneCard.TheDay, ArcaneCard.TheDeath, ArcaneCard.TheFriendship]
export const jakob = 3
export const jakobHand = [ArcaneCard.TheLife, ArcaneCard.TheLie, ArcaneCard.TheHarmony, ArcaneCard.TheWinter]
export const jane = 4
export const janeHand = [ArcaneCard.TheFear, ArcaneCard.TheHope, ArcaneCard.TheSpring, ArcaneCard.TheSecret]

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
    const other = shuffle(arcanes.filter((a) => !myHand.includes(a) && !lisaHand.includes(a) && !janeHand.includes(a) && !jakobHand.includes(a) && a < 30))

    this.material(MaterialType.Arcane).createItems(
      other.map((a) => ({
        id: a,
        location: {
          type: LocationType.Deck
        }
      }))
    )

    this.material(MaterialType.Arcane).createItems(
      shuffle(janeHand).map((a) => ({
        id: a,
        location: {
          type: LocationType.Hand,
          player: jane,
          rotation: Visibility.VISIBLE_FOR_ME
        }
      }))
    )

    this.material(MaterialType.Arcane).createItems(
      shuffle(lisaHand).map((a) => ({
        id: a,
        location: {
          type: LocationType.Hand,
          player: lisa,
          rotation: Visibility.VISIBLE_FOR_ME
        }
      }))
    )

    this.material(MaterialType.Arcane).createItems(
      shuffle(jakobHand).map((a) => ({
        id: a,
        location: {
          type: LocationType.Hand,
          player: jakob,
          rotation: Visibility.VISIBLE_FOR_ME
        }
      }))
    )

    this.material(MaterialType.Arcane).createItems(
      shuffle(myHand).map((a) => ({
        id: a,
        location: {
          type: LocationType.Hand,
          player: me,
          rotation: Visibility.VISIBLE_FOR_ME
        }
      }))
    )
  }

  start() {
    const firstPlayer = this.playerWithMaxAbsolute
    this.memorize(Memory.FirstPlayer, firstPlayer)
    this.startSimultaneousRule(RuleId.ShowStarter)
  }
}
