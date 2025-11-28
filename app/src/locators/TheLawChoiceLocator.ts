import { css } from '@emotion/react'
import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { Memory } from '@gamepark/presages/Memory'
import { LocationDescription, Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { useTranslation } from 'react-i18next'

class TheLawChoiceLocator extends Locator {
  coordinates = { x: 0, y: 0 }

  getLocations(context: MaterialContext) {
    const { rules } = context
    const theLaw = rules.material(MaterialType.Arcane).location(LocationType.Table).id(ArcaneCard.TheLaw)
    const choice = rules.remind(Memory.TheLaw)
    if (!theLaw.length || !choice) return super.getLocations(context)
    return [
      {
        type: LocationType.TheLawChoice
      }
    ]
  }

  locationDescription = new TheLawChoiceDescription()
}

class TheLawChoiceDescription extends LocationDescription {
  constructor() {
    super({
      height: 3.5,
      width: 11
    })
  }

  getExtraCss(_location: Location, context: MaterialContext) {
    const { rules } = context
    const { t } = useTranslation()
    const choice = rules.remind(Memory.TheLaw)
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0.15em solid #df9a20;
      border-radius: 0.5em;
      background-color: #1c2242;
      box-sizing: content-box;
      &:after {
        position: absolute;
        content: '${choice < 0 ? t('the-law.minus') : t('the-law.plus')}';
        line-height: 1.3;
        white-space: pre;
        width: 100%;
        text-align: center;
        transform: translateX(-50%);
        left: 50%;
      }
    `
  }
}

export const theLawChoiceLocator = new TheLawChoiceLocator()
