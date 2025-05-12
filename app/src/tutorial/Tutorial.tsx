import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { RuleId } from '@gamepark/presages/rules/RuleId'
import { Visibility } from '@gamepark/presages/rules/Visibility'
import { MaterialTutorial } from '@gamepark/react-game'
import { TutorialStep } from '@gamepark/react-game/dist/components/tutorial/MaterialTutorial'
import { isEndPlayerTurn, isMoveItemType, isStartRule } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'
import { jakob, jane, lisa, me, TutorialSetup } from './TutorialSetup'

export class Tutorial extends MaterialTutorial {
  version = 2
  options = {
    players: [{ id: me }, { id: jakob }, { id: lisa }, { id: jane }]
  }

  players = [{ id: me }, { id: jakob }, { id: lisa }, { id: jane }]

  setup = new TutorialSetup()

  steps: TutorialStep[] = [
    { popup: { text: () => <Trans defaults="tuto.welcome" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.goal" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.start" components={TransComponents} /> } },
    {
      popup: {
        text: () => <Trans defaults="tuto.mate" components={TransComponents} />
      },
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
        text: () => <Trans defaults="tuto.absolute.effect" components={TransComponents} />
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Arcane).location(LocationType.Table).player(me),
          this.material(game, MaterialType.Arcane).location(LocationType.Hand).id(ArcaneCard.TheTruth)
        ],
        locations: [{ type: LocationType.Hand, player: lisa, rotation: Visibility.HIDDEN_FOR_EVERYONE }],
        margin: {
          top: 10,
          bottom: 5,
          left: 5
        }
      }),
      move: {
        filter: (move, game) =>
          isMoveItemType(MaterialType.Arcane)(move) && move.location.player === lisa && game.items[move.itemType]![move.itemIndex].id === ArcaneCard.TheTruth
      }
    },
    {
      move: {
        player: lisa,
        filter: (move, game) =>
          isMoveItemType(MaterialType.Arcane)(move) && move.location.player === me && game.items[move.itemType]![move.itemIndex].id === ArcaneCard.TheDay
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.absolute.effect.opponent" components={TransComponents} />,
        position: { x: 30, y: -15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Arcane).location(LocationType.Hand).id(ArcaneCard.TheDay)],
        margin: {
          top: 10,
          bottom: 10,
          right: 16
        }
      })
    },
    {
      move: {
        player: jakob,
        filter: (move, game) => isMoveItemType(MaterialType.Arcane)(move) && game.items[move.itemType]![move.itemIndex].id === ArcaneCard.TheLife
      }
    },
    {
      popup: { text: () => <Trans defaults="tuto.life" components={TransComponents} />, position: { x: 30, y: -15 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Arcane).location(LocationType.Table).id(ArcaneCard.TheLife)],
        margin: {
          top: 10,
          bottom: 10,
          right: 16
        }
      })
    },
    { popup: { text: () => <Trans defaults="tuto.trigger.end" components={TransComponents} /> } },
    {
      move: {
        player: lisa,
        filter: (move, game) => isMoveItemType(MaterialType.Arcane)(move) && game.items[move.itemType]![move.itemIndex].id === ArcaneCard.TheDeath
      }
    },
    {
      move: {
        player: jane,
        filter: (move, game) => isMoveItemType(MaterialType.Arcane)(move) && game.items[move.itemType]![move.itemIndex].id === ArcaneCard.TheFear,
        interrupt: (move) => isStartRule(move) && move.id === RuleId.RoundResolution
      }
    },
    {
      popup: { text: () => <Trans defaults="tuto.win.turn" components={TransComponents} />, position: { x: 35, y: 30 }, size: { width: 70 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Arcane).location(LocationType.Table)],
        margin: {
          top: 5,
          bottom: 5,
          right: 18
        }
      })
    },
    {
      popup: { text: () => <Trans defaults="tuto.death" components={TransComponents} />, position: { x: 0, y: 25 }, size: { width: 100 } },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Arcane)
            .location(LocationType.Table)
            .id((id: ArcaneCard) => [ArcaneCard.TheLife, ArcaneCard.TheDeath].includes(id))
        ],
        margin: {
          top: 5,
          bottom: 25,
          right: 18,
          left: 0
        }
      }),
      move: {
        interrupt: (move) => isMoveItemType(MaterialType.Arcane)(move) && move.location.type === LocationType.Hand
      }
    },
    {
      popup: { text: () => <Trans defaults="tuto.take.inhand" components={TransComponents} />, position: { y: 20 } },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Arcane).id(ArcaneCard.TheFear)],
        margin: {
          top: 10,
          bottom: 25
        }
      }),
      move: {}
    },
    { popup: { text: () => <Trans defaults="tuto.new.round" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.help" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.win.round" components={TransComponents} /> } },
    { popup: { text: () => <Trans defaults="tuto.2winround" components={TransComponents} /> } }
  ]
}
