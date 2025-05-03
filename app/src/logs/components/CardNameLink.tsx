import { css } from '@emotion/react'
import { ArcaneCard, getColors, isAbsolute } from '@gamepark/presages/material/ArcaneCard'
import { Color } from '@gamepark/presages/material/Color'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { PlayMoveButton } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { getHtmlColor } from '../../utils/color'
import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

export const CardNameLink: FC<{ id: ArcaneCard }> = ({ id }) => {
  const { t } = useTranslation()
  return (
    <PlayMoveButton
      move={displayMaterialHelp(MaterialType.Arcane, { id: id })}
      transient={true}
      css={[boldCss, id !== ArcaneCard.TheMischief && coloredCss(getColors(id)[0])]}
    >
      {t(isAbsolute(id) ? `card.absolute` : `card.${id}`)} ({id})
    </PlayMoveButton>
  )
}

const boldCss = css`
  font-weight: bold;
`

const coloredCss = (color: Color) => css`
  color: ${getHtmlColor(color)};
`
