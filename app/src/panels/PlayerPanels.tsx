/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { PlayerId } from '@gamepark/game-template/PlayerId'
import { StyledPlayerPanel, usePlayers } from '@gamepark/react-game'
import { createPortal } from 'react-dom'

export const PlayerPanels = () => {
  const players = usePlayers<PlayerId>({ sortFromMe: true })
  const root = document.getElementById('root')
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player, index) => (
        <StyledPlayerPanel key={player.id} player={player} color={playerColorCode[player.id]} css={panelPosition(index)} />
      ))}
    </>,
    root
  )
}
const panelPosition = (index: number) => css`
  position: absolute;
  right: 1em;
  top: ${8.5 + index * 16}em;
  width: 28em;
`

export const playerColorCode: Record<PlayerId, string> = {
  [PlayerId.Red]: 'red',
  [PlayerId.Blue]: 'blue',
  [PlayerId.Green]: 'green',
  [PlayerId.Yellow]: 'yellow'
}
