/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import {
  FailuresDialog,
  FullscreenDialog,
  LiveLogContainer,
  LoadingScreen,
  MaterialGameSounds,
  MaterialHeader,
  MaterialImageLoader,
  Menu,
  useGame
} from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { useEffect, useState } from 'react'
import { GameDisplay } from './GameDisplay'
import { Headers } from './headers/Headers'

export default function App() {
  const game = useGame<MaterialGame>()
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  const [isImagesLoading, setImagesLoading] = useState(true)
  const [isSoundLoading, setSoundsLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || isJustDisplayed || isImagesLoading || isSoundLoading
  return (
    <>
      {!!game && <GameDisplay players={game.players.length} />}
      <LoadingScreen display={loading} author="Maxime Rambourg" artist="Ben Renaut" publisher="Spiral Editions" developer="Game Park" />
      <MaterialHeader rulesStepsHeaders={Headers} loading={loading} />
      <MaterialImageLoader onImagesLoad={() => setImagesLoading(false)} />
      <MaterialGameSounds onSoundsLoad={() => setSoundsLoading(false)} />
      <Menu />
      <FailuresDialog />
      <FullscreenDialog />
      {!loading && <LiveLogContainer css={[liveLogCss, liveLogPosition(game.players.length)]} />}
    </>
  )
}

const liveLogCss = css`
  position: absolute;
  width: 45em;
  pointer-events: none;
`

const liveLogPosition = (players: number) => {
  switch (players) {
    case 4:
      return css`
        top: 10em;
      `
    case 5:
      return css`
        top: 18em;
      `
    default:
      return css`
        top: 28em;
      `
  }
}
