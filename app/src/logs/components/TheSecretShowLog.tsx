/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const TheSecretShowLog: FC<MoveComponentProps> = (props) => {
  const { context } = props
  const move: MoveItem = props.move
  const rules = new PresagesRules(JSON.parse(JSON.stringify(context.game)) as MaterialGame)
  const item = rules.material(MaterialType.Arcane).getItem<ArcaneCard>(move.itemIndex)
  const name = usePlayerName(item.location.player)
  const targetName = usePlayerName(move.location.player)

  return (
    <>
      <span css={textCss}>
        <Trans defaults="log.secret-show" values={{ player: name, target: targetName }} />
      </span>
    </>
  )
}

const textCss = css`
  flex: 1;
`
