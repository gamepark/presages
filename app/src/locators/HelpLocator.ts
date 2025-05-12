import { getRelativePlayerIndex, ItemContext, Locator } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { playerHandLocator } from './PlayerHandLocator'

export class HelpLocator extends Locator {
  getCoordinates(location: Location, context: ItemContext) {
    const { rules } = context
    const index = getRelativePlayerIndex(context, location.player)
    if (rules.players.length === 6) return sixPlayersPanelPosition(index)
    if (rules.players.length === 5) return fivePlayersPanelPosition(index)
    if (rules.players.length === 4) return fourPlayersPanelPosition(index)
    return playerHandLocator.getCoordinates(location, context)
  }
}

const fourPlayersPanelPosition = (index: number) => {
  switch (index) {
    case 0:
      return { x: -22, y: 19.5, z: 0 }
    case 1:
      return { x: -55, y: -6.5, z: 0 }
    case 2:
      return { x: 22, y: -19.5, z: 0 }
    case 3:
      return { x: 55, y: 6.5, z: 0 }
    default:
      return { x: -10, y: -50, z: 0 }
  }
}

const sixPlayersPanelPosition = (index: number) => {
  switch (index) {
    case 0:
      return { x: 16, y: 25, z: 0 }
    case 1:
      return { x: -55, y: 9, z: 0 }
    case 2:
      return { x: -55, y: -19, z: 0 }
    case 3:
      return { x: 16, y: -25, z: 0 }
    case 4:
      return { x: 55, y: -19, z: 0 }
    case 5:
    default:
      return { x: 55, y: 9.5, z: 0 }
  }
}

const fivePlayersPanelPosition = (index: number) => {
  switch (index) {
    case 0:
      return { x: -19, y: 19.5, z: 0 }
    case 1:
      return { x: -55, y: 2.7, z: 0 }
    case 2:
      return { x: -55, y: -19, z: 0 }
    case 3:
      return { x: 55, y: -19, z: 0 }
    case 4:
    default:
      return { x: 55, y: 2.7, z: 0 }
  }
}

export const helpLocator = new HelpLocator()
