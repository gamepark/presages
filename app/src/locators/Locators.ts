import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { Locator } from '@gamepark/react-game'
import { arcaneDeckLocator } from './ArcaneDeckLocator'
import { arcaneDiscardLocator } from './ArcaneDiscardLocator'
import { helpLocator } from './HelpLocator'
import { playerHandLocator } from './PlayerHandLocator'
import { tableLocator } from './TableLocator'
import { theLawChoiceLocator } from './TheLawChoiceLocator'

export const Locators: Partial<Record<LocationType, Locator<PlayerId, MaterialType, LocationType>>> = {
  [LocationType.Hand]: playerHandLocator,
  [LocationType.Deck]: arcaneDeckLocator,
  [LocationType.Table]: tableLocator,
  [LocationType.Discard]: arcaneDiscardLocator,
  [LocationType.Help]: helpLocator,
  [LocationType.TheLawChoice]: theLawChoiceLocator
}
