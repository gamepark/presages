/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ArcaneCard, getColors } from '@gamepark/presages/material/ArcaneCard'
import { Color } from '@gamepark/presages/material/Color'
import { Memory } from '@gamepark/presages/Memory'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'
import { TransComponents } from '../utils/trans.components'

export const RoundResolutionHeader = () => {
  const playerId = usePlayerId()
  const rules = useRules<PresagesRules>()!
  const winner = rules.remind<{ player: PlayerId, value: ArcaneCard}>(Memory.WinningCard)
  const itsMe = playerId && winner.player === playerId
  const name = usePlayerName(winner.player)
  
  if (itsMe) {
    return (
        <Trans
          defaults="header.round-resolution.me"
          values={{ value: winner.value }}
          components={{
            ...TransComponents,
            color: <span css={colorCss(getColors(winner.value))} />
          }}
        />
    )}
  
  return (
    <Trans
      defaults="header.round-resolution.player"
      values={{ player: name, value: winner.value }}
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

const getHtmlColor = (color: Color) => {
  switch (color) {
    case Color.Green:
      return '#4e9d6e'
    case Color.Yellow:
      return '#df9a21'
    case Color.Red:
      return '#c12844'
    case Color.Blue:
    default:
      return '#37a2d0'

  }
}