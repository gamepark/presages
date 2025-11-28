import { css } from '@emotion/react'
import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { LocationType } from '@gamepark/presages/material/LocationType'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { CardNameLink } from './CardNameLink'

export const TheJalousieLog: FC<MoveComponentProps> = (props) => {
  const { context } = props
  const move: MoveItem = props.move
  const rules = new PresagesRules(JSON.parse(JSON.stringify(context.game)) as MaterialGame)
  const activePlayer = rules.getActivePlayer()
  const given = rules.material(MaterialType.Arcane).getItem<ArcaneCard>(move.itemIndex)
  const obtain = rules.material(MaterialType.Arcane).location(LocationType.Table).player(move.location.player).getItem<ArcaneCard>()!
  const name = usePlayerName(activePlayer)

  return (
    <>
      <span css={textCss}>
        <Trans
          i18nKey="log.the-jalousie"
          values={{ player: name }}
          components={{ givenArcane: <CardNameLink id={given.id} />, obtainedArcane: <CardNameLink id={obtain.id} /> }}
        />
      </span>
    </>
  )
}

const textCss = css`
  flex: 1;
`
