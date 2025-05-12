/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Memory } from '@gamepark/presages/Memory'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const RoundEndLog: FC<MoveComponentProps> = (props) => {
  const { context } = props
  const move: MoveItem = props.move
  const rules = new PresagesRules(JSON.parse(JSON.stringify(context.game)) as MaterialGame)
  rules.play(move)
  const roundWinner = rules.remind<PlayerId>(Memory.RoundWinner)
  const name = usePlayerName(roundWinner)

  return (
    <>
      <span css={textCss}>
        <Trans defaults="log.round-end" values={{ player: name }} />
      </span>
    </>
  )
}

const textCss = css`
  flex: 1;
`
