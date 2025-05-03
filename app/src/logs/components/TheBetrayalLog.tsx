/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { usePlayerName } from '@gamepark/react-game'
import { MoveComponentProps } from '@gamepark/react-game/dist/components/History'
import { MaterialGame, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'

export const TheBetrayalLog: FC<MoveComponentProps> = (props) => {
  const { context } = props
  const move: MoveItem = props.move
  const rules = new PresagesRules(JSON.parse(JSON.stringify(context.game)) as MaterialGame)
  const item = rules.material(MaterialType.Arcane).getItem<ArcaneCard>(move.itemIndex)
  const name = usePlayerName(move.location.player)
  const targetName = usePlayerName(item.location.player)

  return (
    <>
      <span css={textCss}>
        <Trans defaults="log.the-betrayal" values={{ player: name, target: targetName }} />
      </span>
    </>
  )
}

const textCss = css`
  flex: 1;
`
