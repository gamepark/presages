/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { GameTable, GameTableNavigation } from '@gamepark/react-game'
import { FC } from 'react'
import { PlayerPanels } from './panels/PlayerPanels'

type GameDisplayProps = {
  players: number
}

export const GameDisplay: FC<GameDisplayProps> = ({ players }) => {
  const margin = { top: 7, left: 0, right: 0, bottom: 0 }
  const bigTable = players > 4
  return (
    <>
      <GameTable xMin={-45} xMax={45} yMin={-28} yMax={29 + (bigTable? 3: 0)} margin={margin} css={process.env.NODE_ENV === 'development' && tableBorder}>
        <GameTableNavigation />
        <PlayerPanels />
      </GameTable>
    </>
  )
}


const tableBorder = css`
  border: 1px solid white;
`
