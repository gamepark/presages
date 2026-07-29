import { css } from '@emotion/react'
import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { Memory } from '@gamepark/presages/Memory'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { LocationDescription, Locator, MaterialContext, useRules } from '@gamepark/react-game'
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

const TheLawChoiceContent = () => {
  const { t } = useTranslation()
  const rules = useRules<PresagesRules>()
  const choice = rules?.remind<number>(Memory.TheLaw) ?? 0
  return <span css={textCss}>{choice < 0 ? t('the-law.minus') : t('the-law.plus')}</span>
}

const textCss = css`
  line-height: 1.3;
  white-space: pre-line;
  text-align: center;
`

class TheLawChoiceDescription extends LocationDescription {
  constructor() {
    super({
      height: 3.5,
      width: 11
    })
  }

  content = TheLawChoiceContent

  extraCss = css`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.15em solid #df9a20;
    border-radius: 0.5em;
    background-color: #1c2242;
    box-sizing: content-box;
  `
}

export const theLawChoiceLocator = new TheLawChoiceLocator()
