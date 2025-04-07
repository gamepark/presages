import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Coordinates, Location } from '@gamepark/rules-api'

export class ArcaneDeckLocator extends DeckLocator {
  getCoordinates(_location: Location, context: MaterialContext): Partial<Coordinates> {
    const { rules } = context
    return {
      x: -40  , y: 20 + (rules.players.length > 4? 5: 0)
    }
  }

  navigationSorts = []
}

export const arcaneDeckLocator = new ArcaneDeckLocator()