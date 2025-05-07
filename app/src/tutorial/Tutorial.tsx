import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { Visibility } from '@gamepark/presages/rules/Visibility'
import { MaterialTutorial } from '@gamepark/react-game'
import { TutorialStep } from '@gamepark/react-game/dist/components/tutorial/MaterialTutorial'
import { isEndPlayerTurn, isMoveItemType } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'
import { jakob, jane, lisa, me, TutorialSetup } from './TutorialSetup'

export class Tutorial extends MaterialTutorial {
  version = 1
  options = {
    players: [{ id: me }, { id: lisa }, { id: jakob }, { id: jane }]
  }

  players = [{ id: me }, { id: lisa }, { id: jakob }, { id: jane }]

  setup = new TutorialSetup()

  steps: TutorialStep[] = [
    { popup: { text: () => <Trans defaults="tuto.welcome" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.goal" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.start" components={TransComponents} /> } },
    {
      popup: {
        text: () => <Trans defaults="tuto.mate" components={TransComponents} />
      }
    },
    {
      move: {
        player: me,
        filter: (move) => isEndPlayerTurn(move)
      }
    },
    {
      move: { player: lisa }
    },
    {
      move: { player: jakob }
    },
    {
      move: { player: jane }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.hand" components={TransComponents} />,
        position: { y: -17, x: 0 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Arcane).location(LocationType.Hand).player(me)],
        margin: {
          top: 10,
          bottom: 20
        }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.absolute" components={TransComponents} />,
        position: { y: -17, x: 0 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Arcane).location(LocationType.Hand).player(me).id(ArcaneCard.TheAbsolute34)],
        locations: [{ type: LocationType.Table, player: me }],
        margin: {
          top: 10,
          left: 10,
          bottom: 20
        }
      }),
      move: {
        filter: (move, game) => isMoveItemType(MaterialType.Arcane)(move) && game.items[MaterialType.Arcane]![move.itemIndex].id === ArcaneCard.TheAbsolute34
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.immediate" components={TransComponents} />,
        position: { y: -17, x: 0 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Arcane).player(me)],
        locations: [{ type: LocationType.Table, player: me }],
        margin: {
          top: 10,
          bottom: 20
        }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.absolute.effect" components={TransComponents} />,
        position: { y: -17, x: 17 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Arcane).location(LocationType.Table).player(me)],
        locations: [{ type: LocationType.Hand, player: lisa, rotation: Visibility.HIDDEN_FOR_EVERYONE }],
        margin: {
          top: 5,
          bottom: 20
        }
      }),
      move: {
        filter: (move) => isMoveItemType(MaterialType.Arcane)(move) && move.location.player === lisa
      }
    },
    { popup: { text: () => <Trans defaults="tuto.absolute.effect.opponent" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.life" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.trigger.end" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.win.turn" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.death" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.take.inhand" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.new.round" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.help" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.win.round" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.2winround" components={TransComponents} /> } }
  ]
}
