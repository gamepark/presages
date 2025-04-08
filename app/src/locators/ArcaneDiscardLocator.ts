import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

export class ArcaneDiscardLocator extends DeckLocator {
  getCoordinates(_location: Location, _context: MaterialContext) {
    return {
      x: -47, y: 28
    }
  }
}

export const arcaneDiscardLocator = new ArcaneDiscardLocator()