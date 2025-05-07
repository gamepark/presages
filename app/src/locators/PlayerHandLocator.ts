import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { Visibility } from '@gamepark/presages/rules/Visibility'
import { DropAreaDescription, getRelativePlayerIndex, HandLocator, isItemContext, ItemContext, MaterialContext, SortFunction } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { arcaneDescription } from '../material/ArcaneDescription'

export class PlayerHandLocator extends HandLocator {
  locationDescription = new DropAreaDescription({
    height: arcaneDescription.height + 1,
    width: arcaneDescription.width * 3.5,
    borderRadius: arcaneDescription.borderRadius
  })

  getCoordinates(location: Location, context: ItemContext) {
    let highlight = false
    if (isItemContext(context)) {
      const { rules, type, index } = context
      const item = rules.material(type).index(index).getItem()
      highlight = item?.location.rotation === Visibility.HIDDEN_FOR_EVERYONE || item?.location.rotation === Visibility.TEMPORARY_VISIBLE_FOR_ME
    }
    const angle = this.getPlayerAngle(location.player!, context)
    const radius = highlight ? 22 : 27
    const x = Math.cos((angle * Math.PI) / 180) * radius
    const y = -Math.sin((angle * Math.PI) / 180) * radius
    return { x, y, z: isItemContext(context) ? 0.05 : 1 }
  }

  getMaxAngle(location: Location, context: MaterialContext): number {
    if (location.player === (context.player ?? context.rules.players[0])) {
      return 20
    }

    return 9
  }

  getPlayerAngle(player: number, context: MaterialContext) {
    const players = context.rules.players.length
    return -90 - (getRelativePlayerIndex(context, player) * 360) / players
  }

  getBaseAngle(location: Location, context: MaterialContext): number {
    const players = context.rules.players.length
    return (getRelativePlayerIndex(context, location.player) * 360) / players
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(10em)', `translateY(-45%)`, `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'scale(2)']
  }

  getItemIndex(item: MaterialItem<PlayerId, LocationType, ArcaneCard>, context: ItemContext) {
    if (item.location.player === context.player) {
      const cards = context.rules
        .material(MaterialType.Arcane)
        .location(LocationType.Hand)
        .player(context.player)
        .getItems<ArcaneCard>()
        .map((item) => item.id)
      cards.sort((a, b) => a - b)
      return cards.indexOf(item.id)
    } else {
      return super.getItemIndex(item, context)
    }
  }

  getNavigationSorts(context: ItemContext): SortFunction[] {
    const { index, type } = context
    const item = context.rules.material(type).index(index).getItem<ArcaneCard>()
    if (!item?.id) return []
    return [(i: MaterialItem) => i.id as ArcaneCard]
  }
}

export const playerHandLocator = new PlayerHandLocator()
