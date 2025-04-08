import { getRelativePlayerIndex, ItemContext, Locator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { playerHandLocator } from './PlayerHandLocator'

export class TableLocator extends Locator {

  getCoordinates(location: Location, context: ItemContext) {
    const { rules, type, index } = context
    const item = rules.material(type).index(index).getItem()
    const angle = playerHandLocator.getPlayerAngle(location.player!, context)
    const radiusX = 26.5
    const bigCircle = rules.players.length > 4
    const radiusY = 7.5 + (bigCircle ? 5 : 0)
    const x = Math.cos(angle * Math.PI / 180) * radiusX
    const y = -Math.sin(angle * Math.PI / 180) * radiusY - (item?.selected ? 2 : 0)
    return { x, y }
  }

  getRotateZ(location: Location, context: MaterialContext): number {
    const players = context.rules.players.length
    return getRelativePlayerIndex(context, location.player) * 360 / players
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(10em)', `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }
}

export const tableLocator = new TableLocator()