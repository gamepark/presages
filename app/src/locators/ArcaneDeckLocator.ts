import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

export class ArcaneDeckLocator extends DeckLocator {
  getCoordinates(_location: Location, _context: MaterialContext): Partial<Coordinates> {
    return {
      x: -55  , y: 25
    }
  }

  navigationSorts = []
}

export const arcaneDeckLocator = new ArcaneDeckLocator()