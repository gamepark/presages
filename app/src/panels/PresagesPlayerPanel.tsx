/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { Memory } from '@gamepark/presages/Memory'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { getRelativePlayerIndex, StyledPlayerPanel, useMaterialContext, usePlayer, useRules } from '@gamepark/react-game'
import { MaterialRules } from '@gamepark/rules-api'
import { FC } from 'react'
import Diamond from '../images/panel/diamond-panel.jpg'
import DiamondVictory from '../images/panel/diamond-victory-panel.jpg'
import Moon from '../images/panel/moon-panel.jpg'
import MoonVictory from '../images/panel/moon-victory-panel.jpg'
import Star from '../images/panel/star-panel.jpg'
import StarVictory from '../images/panel/star-victory-panel.jpg'

type PresagesPlayerPanelProps = {
  playerId: PlayerId
}
export const PresagesPlayerPanel: FC<PresagesPlayerPanelProps> = ({ playerId }) => {
  const player = usePlayer(playerId)
  const rules = useRules<MaterialRules>()!
  const context = useMaterialContext()
  const index = getRelativePlayerIndex(context, playerId)
  const rotated: boolean = rules.material(MaterialType.Help).player(playerId).getItem()?.location.rotation
  const team = rules.remind<number>(Memory.Team, playerId)
  return (
    <StyledPlayerPanel
      key={playerId}
      player={player ?? { id: playerId }}
      backgroundImage={getBackgroundImage(team, rotated)}
      css={panelPosition(rules.players.length, index)}
    />
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
  return rotated ? PanelVictoryImage[team] : PanelImage[team]
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
    case 0:
      return css`
        bottom: 1em;
        left: 40em;
      `
    case 1:
      return css`
        top: 51em;
        left: 1em;
      `
    case 2:
      return css`
        top: 9em;
        right: 50em;
      `
    case 3:
      return css`
        top: 51em;
        right: 1em;
      `
    default:
      return css`
        bottom: 1em;
        left: 1em;
      `
  }
}

const fivePlayersPanelPosition = (index: number) => {
  switch (index) {
    case 0:
      return css`
        bottom: 1em;
        left: 40em;
      `
    case 1:
      return css`
        bottom: 35em;
        left: 1em;
      `
    case 2:
      return css`
        top: 10em;
        left: 1em;
      `
    case 3:
      return css`
        top: 10em;
        right: 1em;
      `
    case 4:
    default:
      return css`
        bottom: 35em;
        right: 1em;
      `
  }
}

const sixPlayersPanelPosition = (index: number) => {
  switch (index) {
    case 0:
      return css`
        bottom: 1em;
        left: 42em;
      `
    case 1:
      return css`
        bottom: 28em;
        left: 1em;
      `
    case 2:
      return css`
        top: 22em;
        left: 1em;
      `
    case 3:
      return css`
        top: 9em;
        right: 62em;
      `
    case 4:
      return css`
        top: 22em;
        right: 1em;
      `
    case 5:
    default:
      return css`
        bottom: 28em;
        right: 1em;
      `
  }
}
