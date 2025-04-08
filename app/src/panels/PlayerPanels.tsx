/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialType } from '@gamepark/game-template/material/MaterialType'
import { Memory } from '@gamepark/game-template/Memory'
import { PlayerId } from '@gamepark/game-template/PlayerId'
import { StyledPlayerPanel, usePlayers, useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { createPortal } from 'react-dom'
import Diamond from '../images/panel/diamond-panel.jpg'
import DiamondVictory from '../images/panel/diamond-victory-panel.jpg'
import Moon from '../images/panel/moon-panel.jpg'
import MoonVictory from '../images/panel/moon-victory-panel.jpg'
import Star from '../images/panel/star-panel.jpg'
import StarVictory from '../images/panel/star-victory-panel.jpg'

export const PlayerPanels = () => {
  const players = usePlayers<PlayerId>({ sortFromMe: true })
  const rules = useRules<MaterialRules>()!
  const root = document.getElementById('root')
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player, index) => {
        const rotated = rules.material(MaterialType.Help).player(player.id).getItem()?.location.rotation
        const team = rules.remind(Memory.Team, player.id)
        return (
          <StyledPlayerPanel key={player.id} player={player} backgroundImage={getBackgroundImage(team, rotated)} css={panelPosition(players.length, index)}/>
        )
      })}
    </>,
    root
  )
}
const panelPosition = (players: number, index: number) => css`
  position: absolute;
  //right: 1em;
  //top: ${8.5 + index * 16}em;
  width: 28em;
  font-size: 0.9em;
  ${getPlayerPanelPosition(players, index)}
`

const PanelImage: Record<number, string> = {
  1: Moon,
  2: Diamond,
  3: Star
}

const PanelVictoryImage: Record<number, string> = {
  1: MoonVictory,
  2: DiamondVictory,
  3: StarVictory
}

const getBackgroundImage = (team: number, rotated: boolean) => {
  return rotated? PanelVictoryImage[team] : PanelImage[team]
}

const getPlayerPanelPosition = (players: number, index: number) => {
  if (players === 6) return sixPlayersPanelPosition(index)
  if (players === 5) return fivePlayersPanelPosition(index)
  if (players === 4) return fourPlayersPanelPosition(index)


  return css`
    bottom: 1em;
    left: ${10 + index * 10}em;
  `
}

const fourPlayersPanelPosition = (index: number) => {
  switch (index) {
    case 0: return css`bottom: 1em; left: 40em`
    case 1: return css`top: 51em; left: 1em`
    case 2: return css`top: 9em; right: 50em`
    case 3: return css`top: 51em; right: 1em`
    default: return css`bottom: 1em; left: 1em`
  }

}

const fivePlayersPanelPosition = (index: number) => {
  switch (index) {
    case 0: return css`bottom: 1em; left: 45em`
    case 1: return css`bottom: 35em; left: 1em`
    case 2: return css`top: 10em; left: 1em`
    case 3: return css`top: 10em; right: 1em`
    case 4:
    default: return css`bottom: 35em; right: 1em`
  }
}

const sixPlayersPanelPosition = (index: number) => {
  switch (index) {
    case 0: return css`bottom: 1em; left: 47em`
    case 1: return css`bottom: 28em; left: 1em`
    case 2: return css`top: 22em; left: 1em`
    case 3: return css`top: 9em; right: 62em`
    case 4: return css`top: 22em; right: 1em`
    case 5:
    default: return css`bottom: 28em; right: 1em`
  }
}