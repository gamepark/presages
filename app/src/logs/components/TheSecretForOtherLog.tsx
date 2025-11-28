import { css } from '@emotion/react'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, StartPlayerTurn } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const TheSecretForOtherLog: FC<MoveComponentProps> = (props) => {
  const { context } = props
  const move: StartPlayerTurn = props.move
  const rules = new PresagesRules(JSON.parse(JSON.stringify(context.game)) as MaterialGame)
  const activePlayer = rules.getActivePlayer()
  const name = usePlayerName(activePlayer)
  const targetName = usePlayerName(move.player)

  return (
    <>
      <span css={textCss}>
        <Trans i18nKey="log.secret-for-other" values={{ player: name, target: targetName }} />
      </span>
    </>
  )
}

const textCss = css`
  flex: 1;
`
