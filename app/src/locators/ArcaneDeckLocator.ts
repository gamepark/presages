import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

export class ArcaneDeckLocator extends DeckLocator {
  getCoordinates(_location: Location<number, number>, _context: MaterialContext<number, number, number>): Partial<Coordinates> {
    return {
      x: -40  , y: 20
    }
  }

  navigationSorts = []
}

export const arcaneDeckLocator = new ArcaneDeckLocator()