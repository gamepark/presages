/** @jsxImportSource @emotion/react */
import { Memory } from '@gamepark/presages/Memory'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { centeredCss, underlineCss } from './styles'

export const StartRoundLog: FC<MoveComponentProps> = (props) => {
  const game = props.context.game as MaterialGame
  const rule = new PresagesRules(game)
  const name = usePlayerName(rule.remind(Memory.FirstPlayer))
  return (
    <span css={[underlineCss, centeredCss]}>
      <Trans defaults="log.start.round" values={{ player: name }} />
    </span>
  )
}
