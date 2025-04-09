/** @jsxImportSource @emotion/react */
import { pointerWithin } from '@dnd-kit/core'
import { css } from '@emotion/react'
import { GameTable } from '@gamepark/react-game'
import { FC } from 'react'
import { PlayerPanels } from './panels/PlayerPanels'

type GameDisplayProps = {
  players: number
}

export const GameDisplay: FC<GameDisplayProps> = () => {
  const margin = { top: 0, left: 0, right: 0, bottom: 0 }
  return (
    <>
      <GameTable verticalCenter xMin={-60} xMax={60} yMin={-35} yMax={35} margin={margin} css={process.env.NODE_ENV === 'development' && tableBorder} collisionAlgorithm={pointerWithin}>
        {/*<GameTableNavigation />*/}
        <PlayerPanels />
      </GameTable>
    </>
  )
}


const tableBorder = css`
  border: 1px solid white;
`
