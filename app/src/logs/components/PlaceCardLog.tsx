/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ArcaneCard } from '@gamepark/presages/material/ArcaneCard'
import { MaterialType } from '@gamepark/presages/material/MaterialType'
import { PlayerId } from '@gamepark/presages/PlayerId'
import { PresagesRules } from '@gamepark/presages/PresagesRules'
import { ThePrideDescription } from '@gamepark/presages/rules/arcane/description/ThePrideDescription'
import { MoveComponentContext, MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { CardNameLink } from './CardNameLink'

export const PlaceCardLog: FC<MoveComponentProps> = (props) => {
  const move = props.move as MoveItem
  const context: MoveComponentContext<MaterialMove, PlayerId, MaterialGame> = props.context
  const rule = new PresagesRules(JSON.parse(JSON.stringify(context.game)) as MaterialGame)
  rule.play(move)
  const item = rule.material(MaterialType.Arcane).getItem<ArcaneCard>(move.itemIndex)
  const id: ArcaneCard = (move.reveal?.id ?? item.id) as ArcaneCard
  const activePlayer = rule.getActivePlayer()
  const target = usePlayerName(move.location.player)
  const player = usePlayerName(activePlayer)
  const thePrideLeft = new ThePrideDescription(rule.game).leftPlayerFor(id)
  const thePridePlayer = usePlayerName(thePrideLeft)

  return (
    <>
      <span css={textCss}>
        <Trans
          defaults={activePlayer === move.location.player ? 'log.place' : 'log.place.other'}
          values={{ player: player, target: target }}
          components={{
            arcane: <CardNameLink id={id} />
          }}
        />
        {id === ArcaneCard.ThePride && (
          <>
            <br />
            <br />
            <span>
              <Trans
                defaults="log.the-pride"
                values={{ player: thePridePlayer }}
                components={{
                  italic: <i />
                }}
              />
            </span>
          </>
        )}
      </span>
    </>
  )
}

const textCss = css`
  flex: 1;
`
