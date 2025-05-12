/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Memory } from '@gamepark/presages/Memory'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { MoveComponentProps, Picture, usePlayerName } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { FC, Fragment } from 'react'
import { Trans } from 'react-i18next'
import { iconCss } from '../../headers/RoundEndHeader'
import { getBackgroundImage } from '../../panels/PresagesPlayerPanel'

export const GameEndLog: FC<MoveComponentProps> = (props) => {
  const { context } = props
  const rules = new PresagesRules(JSON.parse(JSON.stringify(context.game)) as MaterialGame)
  const roundWinner = rules.remind<PlayerId[]>(Memory.Winners)
  const team = rules.remind<number>(Memory.Team, roundWinner[0])
  const name = usePlayerName(roundWinner)

  return (
    <>
      <span css={textCss}>
        <Trans defaults="log.end-game" values={{ player: name }} components={{ team: <Team team={team} />, players: <Players ids={roundWinner} /> }} />
      </span>
    </>
  )
}

const Players: FC<{ ids: PlayerId[] }> = ({ ids }) => {
  return (
    <>
      {ids.map((id, index) => {
        return (
          <Fragment key={id}>
            {index > 0 ? ', ' : ''}
            <PlayerName id={id} />
          </Fragment>
        )
      })}
    </>
  )
}

const PlayerName: FC<{ id: PlayerId }> = ({ id }) => {
  const name = usePlayerName(id)
  return <>{name}</>
}

const Team: FC<{ team: number }> = ({ team }) => {
  // @ts-expect-error the picture css is not exposed in the component
  return <Picture css={[iconCss, pictureCss]} picture={{ css: pictureTestCss }} src={getBackgroundImage(team, true)}></Picture>
}

const pictureTestCss = css`
  display: inline-block;
  position: relative;
  height: 2.5em;
  top: -0.5em;
`

const pictureCss = css`
  height: 3.2em;
  width: 3.5em;
  object-fit: cover;
  object-position: 26%;
`

const textCss = css`
  flex: 1;
`
