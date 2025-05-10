import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { arcaneDescription } from './ArcaneDescription'
import { helpDescription } from './HelpDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.Arcane]: arcaneDescription,
  [MaterialType.Help]: helpDescription
}
