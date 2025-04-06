import { LocationType } from '@gamepark/game-template/material/LocationType'
import { MaterialType } from '@gamepark/game-template/material/MaterialType'
import { PlayerId } from '@gamepark/game-template/PlayerId'
import { Locator } from '@gamepark/react-game'
import { arcaneDeckLocator } from './ArcaneDeckLocator'
import { arcaneDiscardLocator } from './ArcaneDiscardLocator'
import { playerHandLocator } from './PlayerHandLocator'
import { tableLocator } from './TableLocator'

export const Locators: Partial<Record<LocationType, Locator<PlayerId, MaterialType, LocationType>>> = {
  [LocationType.Hand]: playerHandLocator,
  [LocationType.Deck]: arcaneDeckLocator,
  [LocationType.Table]: tableLocator,
  [LocationType.Discard]: arcaneDiscardLocator
}
