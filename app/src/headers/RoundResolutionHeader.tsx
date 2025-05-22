/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ArcaneCard, getColors } from '@gamepark/presages/material/ArcaneCard'
import { Color } from '@gamepark/presages/material/Color'
import { Memory } from '@gamepark/presages/Memory'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans, useTranslation } from 'react-i18next'
import { getHtmlColor } from '../utils/color'
import { TransComponents } from '../utils/trans.components'

export const RoundResolutionHeader = () => {
  const playerId = usePlayerId()
  const rules = useRules<PresagesRules>()!
  const winner = rules.remind<{ player: PlayerId; value: ArcaneCard }>(Memory.WinningCard)
  const itsMe = playerId && winner.player === playerId
  const name = usePlayerName(winner.player)
  const { t } = useTranslation()
  const card = winner.value < ArcaneCard.TheAbsolute30 ? t(`card.${winner.value}`) : t(`card.absolute`)

  if (itsMe) {
    return (
      <Trans
        defaults="header.round-resolution.me"
        values={{ card }}
        components={{
          ...TransComponents,
          color: <span css={colorCss(getColors(winner.value))} />
        }}
      />
    )
  }

  return (
    <Trans
      defaults="header.round-resolution.player"
      values={{ player: name, card }}
      components={{
        ...TransComponents,
        color: <span css={colorCss(getColors(winner.value))} />
      }}
    />
  )
}

const colorCss = (colors: Color[]) => {
  if (colors.length > 1) return undefined
  return css`
    color: ${getHtmlColor(colors[0])};
  `
}
