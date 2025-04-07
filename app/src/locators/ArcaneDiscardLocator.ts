import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

export class ArcaneDiscardLocator extends DeckLocator {
  getCoordinates(_location: Location, context: MaterialContext) {
    const { rules } = context
    return {
      x: -32, y: 20 + (rules.players.length > 4 ? 10: 0)
    }
  }
}

export const arcaneDiscardLocator = new ArcaneDiscardLocator()