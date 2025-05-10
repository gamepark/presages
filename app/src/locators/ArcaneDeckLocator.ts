import { DeckLocator, ItemContext, MaterialContext, SortFunction } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

export class ArcaneDeckLocator extends DeckLocator {
  getCoordinates(_location: Location, _context: MaterialContext): Partial<Coordinates> {
    return {
      x: -55,
      y: 28
    }
  }

  getNavigationSorts(context: ItemContext): SortFunction[] {
    return context.rules.game.rule ? [] : super.getNavigationSorts(context)
  }
}

export const arcaneDeckLocator = new ArcaneDeckLocator()
