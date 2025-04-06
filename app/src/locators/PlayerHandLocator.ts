import { LocationType } from '@gamepark/game-template/material/LocationType'
import { MaterialType } from '@gamepark/game-template/material/MaterialType'
import { getRelativePlayerIndex, HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'

export class PlayerHandLocator extends HandLocator {

  getCoordinates(location: Location, context: ItemContext) {
    const { rules, type, index } = context
    const item = rules.material(type).index(index).getItem()
    const angle = this.getPlayerAngle(location.player!, context)
    const radiusX = 37
    const radiusY = 20
    const x = Math.cos(angle * Math.PI / 180) * radiusX
    const y = -Math.sin(angle * Math.PI / 180) * radiusY - (item?.selected ? 2 : 0)
    return { x, y }
  }

  getMaxAngle(location: Location, context: MaterialContext): number {
    if (location.player === (context.player ?? context.rules.players[0])) {
      return 20
    }

    return 9
  }

  getPlayerAngle(player: number, context: MaterialContext) {
    const players = context.rules.players.length
    return -90 - getRelativePlayerIndex(context, player) * 360 / players
  }

  getBaseAngle(location: Location, context: MaterialContext): number {
    const players = context.rules.players.length
    return getRelativePlayerIndex(context, location.player) * 360 / players
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(10em)', 'translateY(-30%)',`rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }

  getItemIndex(item: MaterialItem, context: ItemContext) {
    if (item.location.player === context.player) {
      const cards = context.rules.material(MaterialType.Arcane).location(LocationType.Hand).player(context.player).getItems().map(item => item.id)
      cards.sort((a, b) => a - b)
      return cards.indexOf(item.id)
    } else {
      return super.getItemIndex(item, context)
    }
  }

}

export const playerHandLocator = new PlayerHandLocator()