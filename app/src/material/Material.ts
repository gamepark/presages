import { MaterialType } from '@gamepark/game-template/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { arcaneDescription } from './ArcaneDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.Arcane]: arcaneDescription
}
