/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { usePlayerName } from '@gamepark/react-game'
import { MoveComponentProps } from '@gamepark/react-game/dist/components/History'
import { MaterialGame, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const TheAngerLog: FC<MoveComponentProps> = (props) => {
  const { context } = props
  const move: MoveItem = props.move
  const rules = new PresagesRules(JSON.parse(JSON.stringify(context.game)) as MaterialGame)
  const activePlayer = rules.getActivePlayer()
  const name = usePlayerName(activePlayer)
  const targetName = usePlayerName(move.location.player)

  return (
    <>
      <span css={textCss}>
        <Trans defaults="log.the-anger" values={{ player: name, target: targetName }} />
      </span>
    </>
  )
}

const textCss = css`
  flex: 1;
`
